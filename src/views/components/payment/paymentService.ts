import { ApiClient } from "@/lib/apiClient";

class PaymentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PaymentError";
    }
}

type PaymentInitializationRequest = {
    email: string;
    userId: string;
    reservationId: string;
}

type PaymentInitializationResponse = {

    status: boolean;
    message: string;
    data: {  
        accessCode: string;
        authorizationUrl: string;
        reference: string;
    }
}

class PaymentService {

    private static instance: PaymentService;
    private constructor() {}

    public static getInstance(): PaymentService {
        if (!PaymentService.instance) {
            PaymentService.instance = new PaymentService();
        }
        return PaymentService.instance;
    }

    async initiateTransaction(data?: PaymentInitializationRequest): Promise<PaymentInitializationResponse> {
        try{
            const apiClient = new ApiClient<unknown | PaymentInitializationRequest, PaymentInitializationResponse>("");
            
            const response = await apiClient.post("/payment/init", data);
            if (response.status === 200) {
                return response.data;
            } else {
                throw new PaymentError("Failed to initialize payment");
            }
        }catch (error: unknown) {
            if (error instanceof PaymentError) {
                throw error;
            } else {
                throw new PaymentError("An unexpected error occurred");
            }
        }
    }

}

export default PaymentService;