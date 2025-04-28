import DashboardNavBar from '@src/views/components/users/customer/dashboard/navbar'
import { useCallback, useState } from 'react'
import DashBoardSideBar from '../sidebar'
import Logger from '@src/utils/logger'
import { NavLink, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { CONFIG } from '@src/utils/constants'

interface Reservation {
    
    publicId: string;
    status: string;
    flightId: string;
    reservationNumber: string;
    creationDate: Date;
    amount: number;
    currency: "NGN" | "USD" | "EUR" | "JPY";
    paymentStatus: "SUCCESSFUL" | "PENDING" | "FAILED";
    timeStamp: Date;
    paymentMethod: "CARD" | "DIRECT_DEBIT" | "BANK_TRANSFER" | "GOOGLE_PAY" | "PAY_PAL" | "APPLE_PAY";
}
const Reservations = () => {

    const param = useParams()
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [reservations, setReservations] = useState<Reservation[]>();

    const {data, error, isLoading} = useQuery({
        queryKey: [`${param.username}-reservations`],
        queryFn: fetchReservations,
        staleTime: 6_000_000

    });

    useCallback(() => {
        if (data) {
            setReservations(data);
        }
    }, [data])
    
    async function fetchReservations() {
        let result: Reservation[] | undefined = [];
        
        await axios.get<Reservation[]>(`${CONFIG.production.SERVER_BASE_URL}customer/${param.userId}/reservations`, {
            headers: {

            },
            params: {

            }
        }).then((response) => {
            Logger.info(JSON.stringify(response.data));
            result = data;
        }).catch((error) => {
            Logger.error(error.message);
        });
        return result;
    }
    

    function openSidebar(arg: boolean): void {
        setSidebarOpen(arg);
    }

    return (
        <div className='flex w-full h-screen overflow-hidden items-center justify-between'>
            
            <DashBoardSideBar userId={param.username} open={isSidebarOpen} setSidebarOpen={openSidebar}/>
            
            <main className='flex flex-col w-screen min-h-screen px-4 lg:px-6'>
                
                <DashboardNavBar sidebarOpen={false} setSidebarOpen={()=>{}}/>

                <section className="flex-1 overflow-y-auto mt-6 lg:mt-8">
                    {/* Filter, Sort */}

                    <div className='h-10 w-full flex justify-end items-center'>
                        <NavLink 
                            to={'/reservations/new'} 
                            className={'bg-[#2563eb] h-full flex items-center p-2 rounded-lg'}
                        >
                            <span className='text-[#f3f4f6] dark:text-[#1f2937]'>Make a reservation</span>
                        </NavLink>
                    </div>
                    {/*  */}
                </section>

                {/*  */}
                
                <div className=''>
                    {isLoading 
                        ? (
                            <div className={"w-full flex items-center justify-center"}>
                                Loading...
                            </div>
                        )
                        : error
                            ? (
                                <div className={"w-full flex items-center justify-center"}>
                                    Unable to fetch reservations
                                </div>
                            )
                            : (
                                <ul className={"w-full flex flex-col items-center px-4 justify-between gap-4"}>
                                    {
                                        reservations?.map((reservation, index) => (
                                            <li key={index} className={"h-20 w-full flex"}>
                                                {reservation.reservationNumber}
                                            </li>
                                        ))
                                    }
                                </ul>
                            )
                    }
                </div>
                
            </main>
        </div>
    )
}

export default Reservations
