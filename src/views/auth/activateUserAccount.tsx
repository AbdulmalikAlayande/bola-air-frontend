import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { CONFIG } from '@src/utils/constants';
import { ApiClient } from '@/lib/apiClient';
import { toast } from 'react-toastify';
import Logger from '../../utils/logger';
import { userDetailsStore } from '@src/store/userDetailsStore';

const ActivateUserAccount = () => {
    
    const [otp, setOtp] = useState(Array(6).fill(''));
    const inputs = useRef<HTMLInputElement[]>([]);
    const navigate = useNavigate();

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^\d$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < 5) {
                inputs.current[index + 1].focus();
            } else {
                sendOTPToBackend(newOtp.join(''));
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newOtp = [...otp];
            if (newOtp[index] === '') {
                if (index > 0) {
                    inputs.current[index - 1].focus();
                }
            } else {
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
    };

    const sendOTPToBackend = (otp: string) => {
    	const publicId = userDetailsStore.getState().publicId;
        axios
            .post(`${CONFIG.production.SERVER_BASE_URL}customer/activate-account/${publicId}/${otp}`)
            .then(response => {
                if (response.status === 200) {
                    Logger.debug(`${response.data}`);
                    toast.success('Account activation successful, please login!', {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    navigate(`/auth/login`);
                    Logger.success('Response Data: ' + response.data);
                }
                else {
                    toast.error("Something went wrong, please reload this page and request another OTP", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                }
            })
            .catch(error => {
                toast.error(error.message || error.response.message || error.response.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                });
                Logger.error(error);
            });
    };

    const resendOTP = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            const email = userDetailsStore.getState().email;
            
            const apiClient = new ApiClient<object, {data: string}>(CONFIG.production.SERVER_BASE_URL, {params: {email: email}});
            
            const response = await apiClient.post(`/auth/resend-otp`, {});
            
            if(response.data){
                toast.info("A new OTP has been sent to your mail", {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }
        catch (error: unknown) {
            Logger.error(JSON.stringify(error));
            toast.error("Failed to resend OTP", {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
                    Account Activation
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                    Enter the 6-digit code sent to your email.
                </p>
                <form onSubmit={(event) => {
                	event.preventDefault();
                	sendOTPToBackend(otp.join(''));
                }}>
                    <div className="flex justify-center space-x-2 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleChange(e, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                ref={el => el && (inputs.current[index] = el)}
                                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                        ))}
                    </div>
                    <div className={'flex flex-col space-y-4'}>
                        <button
                            type="submit"
                            className="w-full text-sm md:text-[16px] md:line-height-[calc(1.5/1.0)] py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            Activate
                        </button>
                        <p className="w-full py-2 px-4 text-sm text-center dark:text-white cursor-pointer">
                            Didn't Receive an OPT?{' '}
                            <button 
                            	onClick={resendOTP}
                            	className="text-blue-600 hover:bg-blue-100 focus:bg-blue-100 hover:text-blue-800 focus:text-blue-800 dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:bg-blue-800/30 dark:focus:text-blue-400 focus:outline-hidden py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent disabled:opacity-50 disabled:pointer-events-none"
                            >
                            	Click here to resend.
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActivateUserAccount;
