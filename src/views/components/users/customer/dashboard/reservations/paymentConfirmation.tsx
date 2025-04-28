import React from 'react';
import { Passenger } from '@/views/types';
import { AvailableFlight, Seat } from '@/views/interfaces/interface';

type PaymentConfirmationProps = {
    passengers: Passenger[];
    reservedSeats: string[];
    seats: Seat[];
    flightDetails: AvailableFlight;
};

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = (props) => {

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Payment Confirmation</h2>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">Flight Details</h3>
                <p>Flight Number: {props.flightDetails.flightNumber}</p>
                <p>Departure: {props.flightDetails.flight.departureCity}</p>
                <p>Arrival: {props.flightDetails.flight.arrivalCity}</p>
                <p>Date: {props.flightDetails.departureTime.toLocaleString()}</p>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">Passengers</h3>
                {props.passengers.map((passenger, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        <p>Name: {`${passenger.firstName} ${passenger.lastName}`}</p>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">Reserved Seats</h3>
                {props.reservedSeats.map((seat, index) => (
                    <p key={index}>Seat Number: {seat}</p>
                ))}
            </div>
        </div>
    );

}

export default PaymentConfirmation;
