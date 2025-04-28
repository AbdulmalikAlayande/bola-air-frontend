import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenService } from './tokenService';
import Logger from '../utils/logger';

export class ApiClient<REQ, RES> {
    
    private client: AxiosInstance;
    private baseUrl: string;
    private tokenService: TokenService;
    private defaultTimeout: number = 30000;

    constructor(baseUrl: string, config: AxiosRequestConfig = {}) {
        this.baseUrl = baseUrl;

        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: this.defaultTimeout,
            ...config,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        this.tokenService = new TokenService();

        this.setUpInterceptors();
    }

    private setUpInterceptors(){

        this.client.interceptors.request.use(
            config => {
                const token = this.tokenService.getAccessToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        )

        this.client.interceptors.response.use(
            (response) => response, (error) => {
                if (error.response){
                    switch(error.response.status){
                        case 401: 
                            this.handleUnauthorized();
                            break;
                        case 403:
                            this.handleForbidden();
                            break;
                        case 404:
                            this.handleNotFound();
                            break;
                        case 500:
                            this.handleInternalServerError();
                            break;
                        default:
                            this.handleDefaultError();
                    }
                }

                return Promise.reject({
                    ...error,
                    isApiError: true,
                    message: error.response?.data?.message || 'An unexpected error occurred',  
                });
            }
        )
    }

    async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<RES>> {
        return this.client.get<RES>(url, config);
    }

    async post(
        url: string,
        data: REQ,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<RES>> {
        return this.client.post<RES>(url, data, config);
    }

    withAbortSignal<T>(func: (signal: AbortSignal) => Promise<T>): {
        promise: Promise<T>;
        abort: () => void;
    } {
        const abortController = new AbortController();
        const promise = func(abortController.signal);
        return {
            promise,
            abort: () => abortController.abort(),
        };
    }

    private handleUnauthorized(): void {
        // Handle 401 unauthorized error
        Logger.error('Unauthorized access');
        this.tokenService.removeAccessToken();
        Logger.info(window.location.href)
        Logger.debug(JSON.stringify(window.location))
        //window.location.href = '/auth/login';
    }

    private handleForbidden(): void {

        Logger.error('Forbidden access');
    }

    private handleNotFound(): void {

        Logger.error('Resource not found');
    }

    private handleInternalServerError(): void {

        console.error('Internal server error');
    }

    private handleDefaultError(): void {

        Logger.error('An error occurred');
    }
}
