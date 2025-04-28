import React, { FormEvent, useState } from 'react';
import AuthInput from '../components/reusables/authInput';
import CallToActionButton from '../components/reusables/callToActionButton';
import { Icon } from '@iconify-icon/react';
import { NavLink, useNavigate } from 'react-router';
import Logo from '@src/assets/icons/tsx/Logo';
import ThemeToggle from '@src/utils/themeToggle';
import { CONFIG } from '@src/utils/constants';
import { ApiClient } from '@/lib/apiClient';
import { TokenService } from '@/lib/tokenService';
import Logger from '@src/utils/logger';
import { toast } from 'react-toastify';
import { userDetailsStore } from '@src/store/userDetailsStore';

interface LoginData {
    email: string;
    password: string;
    phoneNumber?: string;
}

interface LoginResponse extends LoginData {

    userId: string;
    message: string;
    publicId: string;
    accessToken: string;
    refreshToken: string;
}

const Login = () => {

    const [userData, setUserData] = useState<LoginData>({ 
        email: '', 
        password: '' 
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigateTo = useNavigate();
    const tokenService = new TokenService();

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        const { name, value } = event.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
        
        Logger.info(`onchange:: name: ${name}, value: ${value}`);
        if (error) setError(null);
    }

    const validateForm = (): boolean => {

        return true;
    }

    function handleFormSubmission(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        login(userData);
    }

    async function login(data: LoginData) {
        
        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        try {

            const apiClient = new ApiClient<LoginData, LoginResponse>(CONFIG.production.SERVER_BASE_URL, {});
            const response = await apiClient.post('auth/login', data);
	
	    Logger.info("login:: Response data: "+JSON.stringify(response.data))
            if (response.data.accessToken) {
                tokenService.setAccessToken(response.data.accessToken);
            }

            toast.success("Logged In Successfully", {
                position: toast.POSITION.TOP_CENTER,
            })

            Logger.info(`User logged in: ${response.data.publicId}`);
            const publicId = userDetailsStore.getState().publicId;
            navigateTo(`/${publicId || response.data.userId}/dashboard`);
        }
        catch(error: unknown){

            const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
            Logger.error('Login Error: ' + errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-4 m-0 h-full flex flex-col">
            <div className="w-full flex items-center justify-end">
                <ThemeToggle />
            </div>

            {/* Sign In Section */}
            <section className={'flex min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8'}>
                <div className={'sm:mx-auto sm:w-full sm:max-w-sm'}>
                    <Logo className="mx-auto h-15 w-15" />
                    <h2 className="mt-6 text-center text-xl/6 md:text-2xl/8 font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl/9">
                        Sign in to your account
                    </h2>
                </div>
                {/* #1E293B, #273449, #323F57, #3D4B66 */}

                <div
                    className={
                        'flex flex-col items-center justify-center mt-10 p-6 h-[70dvh] sm:mx-auto sm:w-full sm:max-w-sm max-w-md bg-white dark:bg-transparent rounded-lg shadow-2xl'
                    }
                >
                    <form onSubmit={handleFormSubmission} className="w-full space-y-6">
                        <AuthInput
                            name={'email'}
                            inputType={'email'}
                            inputLabel={'Email'}
                            className={
                                'block w-full rounded-md bg-transparent px-3 py-1.5 text-base dark:text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#2563eb] dark:focus:outline-[#1e40af] sm:text-sm/6'
                            }
                            labelClassName={
                                'block text-sm/6 font-medium dark:text-white text-gray-900'
                            }
                            inputPlaceHolder={'johndoe@gmail.com'}
                            onChange={handleInputChange}
                            required
                        />

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block sm:text-sm/6 text-lg/8 font-medium text-gray-900 dark:text-white"
                                >
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a
                                        href="#"
                                        className="font-semibold text-[#2563eb] hover:text-indigo-500"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md bg-transparent px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#2563eb] dark:focus:outline-[#1e40af] sm:text-sm/6"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <CallToActionButton
                            type={'submit'}
                            buttonPlaceHolder={isLoading ? 'Logging in...' : 'Login'}
                            disabled={isLoading}
                            className={`
                                flex w-full justify-center rounded-md 
                                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2563eb] hover:bg-indigo-500'}
                                px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs 
                                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                            `}
                        />
                    </form>

                    {/* Divider Text */}

                    <div className="w-full my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-500">Or continue with</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                        {/* <div className="py-3 flex items-center text-sm text-gray-800 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:before:border-neutral-600 dark:after:border-neutral-600">Or continue with</div> */}
                    </div>

                    {/* Social Sign In Button */}
                    <div className="w-full md:px-8 mt-4 flex gap-4">
                        <button
                            type="button"
                            className={
                                'flex items-center text-gray-900 dark:text-white justify-center gap-4 w-full h-10 border border-gray-300 py-2 rounded-lg hover:bg-[#2563eb] hover:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-gray-900 cursor-pointer'
                            }
                        >
                            <Icon icon={'flat-color-icons:google'} height={'25px'} width={'25px'} />
                            <span>Google</span>
                        </button>
                        <button
                            type="button"
                            className={
                                'flex items-center text-gray-900 dark:text-white justify-center gap-4 w-full h-10 border border-gray-300 py-2 rounded-lg hover:bg-[#2563eb] hover:text-gray-100 dark:hover:bg-gray-100 dark:hover:text-gray-900 cursor-pointer'
                            }
                        >
                            <Icon icon={'logos:facebook'} height={'25px'} width={'25px'} />
                            <span>Facebook</span>
                        </button>
                    </div>
                </div>

                {/* Sign In Route */}
                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Don't have an account?{' '}
                    <NavLink
                        to="/auth/signup"
                        className="font-semibold text-[#2563eb] dark:text-[#1e40af] hover:text-indigo-500"
                    >
                        Sign Up
                    </NavLink>
                </p>
            </section>
        </div>
    );
};

export default Login;

