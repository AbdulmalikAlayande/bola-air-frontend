import { useEffect } from 'react';
import { useLocation } from 'react-router';

import 'preline/preline';
import { IStaticMethods } from 'preline/preline';

import LandingPage from './views/landingPage/landingPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router';

import Dashboard from './views/components/users/customer/dashboard';
import Profile from './views/components/users/customer/profile/profile';
import AdminSignUp from './views/auth/adminSignUp';
import Users from './views/components/users/admin/users/users';
import AdminDashboard from './views/components/users/admin/dashboard';
import Login from './views/auth/login';
import SignUp from './views/auth/signUp';
import ActivateUserAccount from './views/auth/activateUserAccount';
import PageTitle from './utils/pageTitle';
import Reservations from './views/components/users/customer/dashboard/reservations';
import NewReservation from './views/components/users/customer/dashboard/reservations/newReservation';
import BookFlight from './views/components/users/customer/dashboard/reservations/bookFlight';

declare global {
    interface Window {
        HSStaticMethods: IStaticMethods;
    }
}

function useDarkMode() {
    useEffect(() => {
        const root = window.document.documentElement;
        const isDark = localStorage.getItem('theme') === 'dark';

        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, []);
}

function App() {
    useDarkMode();

    return (
        <Router>
            <AppContent />
        </Router>
    );
}

function AppContent() {
    const location = useLocation();

    useEffect(() => {
        const initPreline = async () => {
            const { HSStaticMethods } = await import('preline/preline');
            if (typeof HSStaticMethods !== 'undefined') {
                HSStaticMethods.autoInit();
            }
        };

        if (document.readyState === 'complete') {
            initPreline();
        } else {
            window.addEventListener('load', initPreline);
            return () => window.removeEventListener('load', initPreline);
        }
    }, [location.pathname]);

    return (
        <Routes>
            <Route path={'/:username/dashboard'} element={<Dashboard />} />
            <Route
                path={'/home'}
                element={
                    <>
                        <PageTitle title={'Home'} />
                        <LandingPage />
                    </>
                }
            />
            <Route
                path={'/'}
                element={
                    <>
                        <PageTitle title={'Home'} />
                        <LandingPage />
                    </>
                }
            />
            <Route
                path={'/auth/login'}
                element={
                    <>
                        <PageTitle title={'Login'} />
                        <Login />
                    </>
                }
            />
            <Route
                path={'/auth/signup'}
                element={
                    <>
                        <PageTitle title={'Signup'} />
                        <SignUp />
                    </>
                }
            />
            <Route
                path={'/:pid/dashboard'}
                element={
                    <>
                        <PageTitle title={'Dashboard | Quick Analytics'} />
                        <Dashboard />
                    </>
                }
            />
            <Route
                path={'auth/activate-account/'}
                element={
                    <>
                        <PageTitle title={'Activate Account'} />
                        <ActivateUserAccount />
                    </>
                }
            />
            <Route
                path={'/:pid/reservations'}
                element={
                    <>
                        <PageTitle title={'Reservation | Flight Booking Views'} />
                        <Reservations />
                    </>
                }
            />
            <Route
                path={'/reservations/new'}
                element={
                    <>
                        <PageTitle title={'FlyWell | New Reservation'} />
                        <NewReservation />
                    </>
                }
            />

            <Route
                path={'/book-flight/:pid'}
                element={
                    <>
                        <PageTitle title={'FlyWell | Book Flight'} />
                        <BookFlight />
                    </>
                }
            />

            <Route path={'/:pid/profile'} element={<Profile />} />
            <Route path={'/admin-signup'} element={<AdminSignUp />} />
            <Route path={'/bola-air/users'} element={<Users />} />
            <Route path={'bola-air/admin/dashboard'} element={<AdminDashboard />} />
        </Routes>
    );
}

export default App;
