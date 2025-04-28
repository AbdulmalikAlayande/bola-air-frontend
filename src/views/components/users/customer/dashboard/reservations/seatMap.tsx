import React, { useState, useEffect } from 'react';
import { Seat } from '@src/views/interfaces/interface';
import { Label } from '@/components/ui/label';
import Logger from '@/utils/logger';

interface SeatMapProps {
    onSeatSelect: (seat: Seat) => void;
    selectedSeats: Seat[];
    seats: Map<string, Seat[]>;
}

const seatStyles = {
    EMPTY: { fill: '#bfdbfe', stroke: '#60a5fa' }, // Light blue
    SELECTED: { fill: '#4ade80', stroke: '#16a34a' }, // Green
    RESERVED: { fill: '#d1d5db', stroke: '#9ca3af', cursor: 'not-allowed' }, // Gray
};

const seatSections = [
    { id: 'FIRST_CLASS', name: 'First Class', columns: 4, color: 'bg-violet-200' },
    { id: 'BUSINESS_CLASS', name: 'Business Class', columns: 4, color: 'bg-teal-200' },
    { id: 'PREMIUM_ECONOMY', name: 'Premium Economy', columns: 4, color: 'bg-orange-200' },
    { id: 'ECONOMY', name: 'Economy Class', columns: 4, color: 'bg-blue-200' },
];

const SeatMap: React.FC<SeatMapProps> = ({ onSeatSelect, selectedSeats, seats }) => {
    const [seatData, setSeatData] = useState<Map<string, Seat>>(new Map());

    useEffect(() => {
        if (seats.size > 0) {
            const flattenedSeats = new Map<string, Seat>();
            
            // This flattens Map<string, Seat[]> to Map<string, Seat>
            for (const [sectionKey, sectionSeats] of seats.entries()) {
                for (const seat of sectionSeats) {
                    flattenedSeats.set(seat.publicId, {...seat});
                }
            }
            Logger.debug("Seat:: "+JSON.stringify(flattenedSeats))
            setSeatData(flattenedSeats);
        }
    }, [seats]);


    // function handleSeatMapSeatSelection(seat: Seat): void {
    
    //     if (selectedSeats.length >= reservationRequest.passengers.length) {
    //         toast.info('Maximum number of seats already selected', {
    //             description:
    //                 'You can only select up to ' + reservationRequest.passengers.length + ' seats.',
    //             duration: 3000,
    //             style: { backgroundColor: 'red', color: 'white' },
    //         });
    //     }
    //     else if (selectedSeats.some(s => s.publicId === seat.publicId)) {
    //         setSelectedSeats(prev => prev.filter(s => s.publicId !== seat.publicId));
    //     }
    //     else {
    //         setSelectedSeats(prev => [...prev, seat]);
    //     }
    // }

    const handleSeatClick = (seat: Seat) => {
        if (seat.status === 'RESERVED') 
            return;
        if (seat.status === 'SELECTED') {
            seat.status = 'EMPTY';
            onSeatSelect(seat); 
        } else {
            seat.status = 'SELECTED';
            onSeatSelect(seat); 
        }
        Logger.info("selected Seats:: "+JSON.stringify(selectedSeats.length))
    };

    // Group seats by section and row
    const groupedSeats = Array.from(seatData.values()).reduce((acc, seat) => {

        const sectionId = seat.sectionKey;
        
        if (!acc[sectionId]) {
            acc[sectionId] = {};
        }

        if (!acc[sectionId][seat.row]) {
            acc[sectionId][seat.row] = [];
        }

        acc[sectionId][seat.row].push(seat);
        return acc;
    }, {} as Record<string, Record<number, Seat[]>>);

    const getSeatStyle = (seat: Seat) => {
        if (seat.status === 'SELECTED') return seatStyles.SELECTED;
        else if (seat.status === 'RESERVED') return seatStyles.RESERVED;
        else return seatStyles.EMPTY; // Always use EMPTY style for available seats
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-between bg-gray-800 dark:bg-white gap-4 px-4">
            {/* Seat status legend */}
            <svg
                viewBox="0 0 300 30"
                className="w-full max-w-md h-12 mt-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
                <g transform="translate(20, 8)">
                    <rect x="0" y="0" width="12" height="12" style={seatStyles.EMPTY} />
                    <text x="18" y="10" fontSize="10" fill="#64748b">
                        Available
                    </text>

                    <rect x="80" y="0" width="12" height="12" style={seatStyles.SELECTED} />
                    <text x="98" y="10" fontSize="10" fill="#64748b">
                        Selected
                    </text>

                    <rect x="160" y="0" width="12" height="12" style={seatStyles.RESERVED} />
                    <text x="178" y="10" fontSize="10" fill="#64748b">
                        Occupied
                    </text>
                </g>
            </svg>

            {/* Seat Map with custom scrollbar */}
            <div className="w-full h-9/10 flex flex-col items-center justify-between gap-4">
                <div
                    className="w-full h-9.5/10 flex flex-col items-center gap-4 overflow-y-auto scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {seatSections.map(section => {
                        if (!groupedSeats[section.id]) return null;

                        return (
                            <div key={section.id} className="w-full">
                                <Label
                                    className={`w-full flex items-center px-2 py-1 ${section.color} text-gray-800 font-medium`}
                                >
                                    {section.name}
                                </Label>

                                {Object.entries(groupedSeats[section.id])
                                    .sort((rowA, rowB) => Number(rowA) - Number(rowB))
                                    .map(([row, seats]) => {
                                        const leftSeats = seats.slice(0, 2);
                                        const rightSeats = seats.slice(2, 4);

                                        return (
                                            <div
                                                key={`${section.id}-row-${row}`}
                                                className="w-full flex items-center justify-between py-2"
                                            >
                                                {/* Row number */}
                                                <div className="w-8 text-center text-white dark:text-gray-700">
                                                    {row}
                                                </div>

                                                {/* Left side seats */}
                                                <div className="h-full w-1/2 flex items-center justify-start gap-2">
                                                    {leftSeats.map(seat => (
                                                        <div
                                                            key={`seat-${seat.publicId}`}
                                                            className={`
                                                                h-10 w-10 flex items-center justify-center rounded-sm cursor-pointer ${
                                                                seat.status === 'RESERVED' ? 'cursor-not-allowed': ''}
                                                            `}
                                                            onClick={() => handleSeatClick(seat)}
                                                        >
                                                            <svg width="100%" height="100%" viewBox="0 0 40 40">
                                                                <rect x="4" y="4" width="32" height="32" rx="3" style={getSeatStyle(seat)}/>
                                                                <text
                                                                    x="20"
                                                                    y="24"
                                                                    textAnchor="middle"
                                                                    fontSize="10"
                                                                    fill={
                                                                        seat.status === 'SELECTED'
                                                                            ? 'white'
                                                                            : 'black'
                                                                    }
                                                                >
                                                                    {seat.seatNumber}
                                                                </text>
                                                            </svg>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Right side seats */}
                                                <div className="h-full w-1/2 flex items-center justify-end gap-2">
                                                    {rightSeats.map(seat => (
                                                            <div
                                                                key={`seat-${seat.publicId}`}
                                                                className={`
                                                                    h-10 w-10 flex items-center justify-center rounded-sm cursor-pointer 
                                                                    ${seat.status === 'RESERVED'? 'cursor-not-allowed' : ''}
                                                                `}
                                                                onClick={() => handleSeatClick(seat)}
                                                            >
                                                                <svg
                                                                    width="100%"
                                                                    height="100%"
                                                                    viewBox="0 0 40 40"
                                                                >
                                                                    <rect
                                                                        x="4"
                                                                        y="4"
                                                                        width="32"
                                                                        height="32"
                                                                        rx="3"
                                                                        style={getSeatStyle(seat)}
                                                                    />
                                                                    <text
                                                                        x="20"
                                                                        y="24"
                                                                        textAnchor="middle"
                                                                        fontSize="10"
                                                                        fill={
                                                                            seat.status === 'SELECTED'
                                                                                ? 'white'
                                                                                : 'black'
                                                                        }
                                                                    >
                                                                        {seat.seatNumber}
                                                                    </text>
                                                                </svg>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
