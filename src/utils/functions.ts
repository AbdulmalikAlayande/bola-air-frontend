import ReactModal from 'react-modal';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDuration, intervalToDuration } from 'date-fns';
import { isToday, isTomorrow, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getRandomInt(min: number, max: number): number {
    const byteArray = new Uint32Array(1);
    const unitArray = window.crypto.getRandomValues(byteArray);
    console.log('unitArray', unitArray);
    const range = max - min + 1;
    const maxRange = Math.pow(2, 32) - 1;
    console.log('maxRange ==> ', maxRange);
    if (unitArray[0] >= Math.floor(maxRange / range) * range) {
        return getRandomInt(min, max);
    }
    return min + (byteArray[0] % range);
}

export const profileEditModalStyle: ReactModal.Styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50vw',
        height: '85vh',
        backgroundColor: 'azure',
        border: 'none',
        borderRadius: '5px',
        borderStyle: 'solid',
        borderWidth: '5px',
        borderColor: 'powderblue',
    },
};
export const inviteAdminModalStyle: ReactModal.Styles = {
    overlay: {
        position: 'absolute',
        zIndex: '3',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        borderColor: 'powderblue',
        borderRadius: '30px',
        borderStyle: 'solid',
        borderWidth: '3px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40vw',
        height: '30vh',
    },
};

export const addNewFlightModalStyle: ReactModal.Styles = {
    overlay: {
        position: 'absolute',
        zIndex: '3',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        borderColor: 'powderblue',
        borderRadius: '30px',
        borderStyle: 'solid',
        borderWidth: '3px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40vw',
        height: '89vh',
    },
};

const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;
export const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload/`;

export const emailPattern =
    /^[a-z0-9._%±]+@(gmail|yahoo|outlook|hotmail|aol|icloud|mail|msn|live|yandex).com$/i;
export const emailPattern2 = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
export const adminSideBarButtonData = () => {
    return [
        {
            btnLabel: 'Dashbaord',
            btnIcon: 'pixelarticons:dashbaord',
            btnUrl: '/bola-air/admin/dashboard',
            value: 'dashboard',
        },
        {
            btnLabel: 'Profile',
            btnIcon: 'gg:profile',
            btnUrl: '/bola-air/admin/profile',
            value: 'profile',
        },
        {
            btnLabel: 'Users',
            btnIcon: 'uil:users-alt',
            btnUrl: '/bola-air/users',
            value: 'users',
        },
        {
            btnLabel: 'Flights',
            btnIcon: 'mdi:flight',
            btnUrl: '/bola-air/all-flights',
            value: 'flights',
        },
        {
            btnLabel: 'Instances',
            btnIcon: 'icon-park-outline:round-trip',
            btnUrl: '/bola-air/all-instances',
            value: 'flight-instance',
        },
        {
            btnLabel: 'Air Crafts',
            btnIcon: 'material-symbols:flightsmode',
            btnUrl: '/bola-air/all-aircrafts',
            value: 'air-crafts',
        },
        {
            btnLabel: 'Trips',
            btnIcon: 'icon-park-outline:round-trip',
            btnUrl: '/bola-air/all-trips',
            value: 'trips',
        },
    ];
};

export const formatToDuration = (start: Date, end: Date) => {
    const duration = intervalToDuration({
        start: start,
        end: end,
    });

    return formatDuration(duration, {
        format: ['hours', 'minutes'],
    });
};


export function formatFlightDate(date: Date) {
    if (isToday(date)) return `Today, ${format(date, 'HH:mm')}`;
    if (isTomorrow(date)) return `Tomorrow, ${format(date, 'HH:mm')}`;
    return format(date, 'EEE, MMM d • HH:mm');
}