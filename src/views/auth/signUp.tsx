import React, { FormEvent, useState } from 'react';
import AuthInput from '../components/reusables/authInput';
import CallToActionButton from '../components/reusables/callToActionButton';
import { Icon } from '@iconify-icon/react';
import { AxiosError } from 'axios';
import { NavLink, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Logger from '@utils/logger';
import { ApiClient } from '@/lib/apiClient';
import ThemeToggle from '@src/utils/themeToggle';
import { CONFIG } from '@src/utils/constants';
import Logo from '@src/assets/icons/tsx/Logo';
import { userDetailsStore } from '@src/store/userDetailsStore';

interface SignupData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

const initialData: SignupData = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
};

interface SignupResponse {
    message: string;
    publicId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

const SignUp = () => {
    const [userData, setUserData] = useState<SignupData>(initialData);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigateTo = useNavigate();

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        const { name, value } = event.target;

        setUserData(prev => ({
            ...prev,
            [name]: value,
        }));

        Logger.info(`onchange:: name: ${name}, value: ${value}`);
        if (error) setError(null);
    }

    const validateForm = (): boolean => {
        return true;
    };

    function handleFormSubmission(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        signup(userData);
    }

    async function signup(request: SignupData) {
        Logger.info('request:: ' + JSON.stringify(request));

        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        try {
            const apiClient = new ApiClient<SignupData, SignupResponse>(
                CONFIG.production.SERVER_BASE_URL,
                {}
            );
            const response = await apiClient.post('customer/new', userData);

            Logger.info('signup:: Response data: ' + response.data);
            if (response.status === 201) {
                const { publicId, firstName, lastName, email, phoneNumber } = response.data;
                userDetailsStore
                    .getState()
                    .setUserDetails({ publicId, firstName, lastName, email, phoneNumber });

                toast.success('Sign up was successful');
                Logger.success('Sign up was successful');

                navigateTo('/auth/activate-account');
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof AxiosError || error instanceof Error
                    ? error.message
                    : 'Signup failed';
            setError(errorMessage);
            Logger.error(errorMessage);
            toast.error(errorMessage, {
                position: toast.POSITION.TOP_CENTER,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={'p-4 m-0 h-full flex flex-col'}>
            <div className="w-full flex items-center justify-end">
                <ThemeToggle />
            </div>

            {/* Sign Up Section */}
            <section className={'flex min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8'}>
                {/* bg-[#273449] */}
                <div className={'sm:mx-auto sm:w-full sm:max-w-sm'}>
                    <Logo className="mx-auto h-15 w-15" />
                    <h2 className="mt-6 text-center text-xl/6 md:text-2xl/8 font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl/9">
                        Create An Account
                    </h2>
                </div>
                <div
                    className={
                        'flex flex-col items-center justify-center mt-10 p-6 sm:mx-auto sm:w-full sm:max-w-sm max-w-md bg-white dark:bg-transparent rounded-lg shadow-2xl'
                    }
                >
                    <form onSubmit={handleFormSubmission} className={'w-full space-y-6'}>
                        <AuthInput
                            name={'firstName'}
                            inputType={'text'}
                            className={
                                'block w-full rounded-md bg-transparent px-3 py-1.5 text-base dark:text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#2563eb] dark:focus:outline-[#1e40af] sm:text-sm/6'
                            }
                            labelClassName={
                                'block text-sm/6 font-medium dark:text-white text-gray-900'
                            }
                            inputPlaceHolder={'john'}
                            inputLabel={'First Name'}
                            onChange={handleInputChange}
                            required
                        />
                        <AuthInput
                            name={'lastName'}
                            inputType={'text'}
                            className={
                                'block w-full rounded-md bg-transparent px-3 py-1.5 text-base dark:text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#2563eb] dark:focus:outline-[#1e40af] sm:text-sm/6'
                            }
                            labelClassName={
                                'block text-sm/6 font-medium dark:text-white text-gray-900'
                            }
                            inputPlaceHolder={'doe'}
                            inputLabel={'Last Name'}
                            onChange={handleInputChange}
                            required
                        />
                        <AuthInput
                            name={'email'}
                            inputType={'email'}
                            className={
                                'block w-full rounded-md bg-transparent px-3 py-1.5 text-base dark:text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#2563eb] dark:focus:outline-[#1e40af] sm:text-sm/6'
                            }
                            labelClassName={
                                'block text-sm/6 font-medium dark:text-white text-gray-900'
                            }
                            inputPlaceHolder={'johndoe@gmail.com'}
                            inputLabel={'Email'}
                            onChange={handleInputChange}
                            required
                        />
                        <AuthInput
                            name={'password'}
                            inputType={'password'}
                            className={
                                'block w-full rounded-md bg-transparent px-3 py-1.5 text-base dark:text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#2563eb] dark:focus:outline-[#1e40af] sm:text-sm/6'
                            }
                            labelClassName={
                                'block text-sm/6 font-medium dark:text-white text-gray-900'
                            }
                            inputPlaceHolder={'********'}
                            inputLabel={'Password'}
                            onChange={handleInputChange}
                            required
                        />
                        <AuthInput
                            name={'phoneNumber'}
                            inputType={'tel'}
                            className={
                                'block w-full rounded-md bg-transparent px-3 py-1.5 text-base dark:text-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#2563eb] dark:focus:outline-[#1e40af] sm:text-sm/6'
                            }
                            labelClassName={
                                'block text-sm/6 font-medium dark:text-white text-gray-900'
                            }
                            inputPlaceHolder={'+2347036174617'}
                            inputLabel={'Phone Number'}
                            onChange={handleInputChange}
                            required
                        />

                        <div className="w-full flex flex-column items-center justify-between gap-4">
                            {error && (
                                <div className="text-red-500 text-sm text-center">{error}</div>
                            )}
                            <CallToActionButton
                                type={'submit'}
                                buttonPlaceHolder={isLoading ? 'Signing up' : 'Sign up'}
                                className={`flex w-full justify-center rounded-md bg-[#2563eb] dark:bg-[#1e40af] ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#2563eb] hover:bg-indigo-500'
                                } px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs cursor-pointer hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                            />
                        </div>
                    </form>

                    {/* Divider Text */}
                    <div className="w-full my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-500">Or continue with</span>
                        <div className="flex-grow border-t border-gray-300"></div>
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
                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Already have an account?{' '}
                    <NavLink
                        to="/auth/login"
                        className="font-semibold text-[#2563eb] dark:text-[#1e40af] hover:text-indigo-500"
                    >
                        Sign In
                    </NavLink>
                </p>
            </section>
        </div>
    );
};

export default SignUp;
