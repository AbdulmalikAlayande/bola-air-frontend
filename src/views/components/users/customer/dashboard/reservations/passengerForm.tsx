import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Plane, Briefcase, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '@/lib/apiClient';
import Logger from '@/utils/logger';
import { Passenger } from '@src/views/types';
import { toast } from 'sonner';
import DatePicker from '@/components/ui/datepicker';

type Country = {
    name: {
        common: string;
        official: string;
    };
    cca2: string;
    maps: {
        googleMaps: string;
        openStreetMaps: string;
    };
    timezones: [];
    flags: {
        png: string;
        svg: string;
    };
};

interface PassengerFormProps {
    onSubmit: (passengers: Passenger[]) => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ onSubmit }) => {

    const [currentTab, setCurrentTab] = useState("basic")
    const [passenger, setPassenger] = useState<Passenger>(
        {
            title: 'Mr',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            nationality: '',
            passportNumber: '',
            passportExpiryDate: '',
            mealPreference: 'Standard',
            specialAssistance: false,
            activeTab: 'basic',
        },
    );

    const [countries, setCountries] = useState<Country[]>([
        {
            name: { common: 'Nigeria', official: 'Federal Republic of Nigeria' },
            cca2: 'NG',
            maps: { googleMaps: '', openStreetMaps: '' },
            timezones: [],
            flags: { png: '', svg: '' },
        },
    ]);

    const fetchCountries = async (): Promise<Country[]> => {
        try {
            const apiClient = new ApiClient<unknown, Country[]>('https://restcountries.com/v3.1');
            const response = await apiClient.get('/all');
            if (response.data) {
                Logger.debug('Countries fetched successfully');
                return response.data.map(country => ({
                    name: country.name,
                    cca2: country.cca2,
                    maps: country.maps,
                    timezones: country.timezones,
                    flags: country.flags,
                }));
            }
        } catch (error) {
            Logger.error(`Failed to fetch countries: ${error}`);
        }
        return countries;
    };

    const { data } = useQuery<Country[]>({
        queryKey: ['countries'],
        queryFn: fetchCountries,
    });

    useEffect(() => {
        if (data && data.length > 0) {
            setCountries(
                data.sort((a, b) =>
                    a.name.common.toLowerCase().localeCompare(b.name.common.toLowerCase())
                )
            );
        }
    }, [data]);

    const isPassengerDataValid = () => {
        
        if ( !passenger.firstName ||!passenger.lastName ||
             !passenger.title || !passenger.dateOfBirth ||
             !passenger.nationality
            ) {
                return false;
            }
        else return true;
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        Logger.debug('Passenger form submitted: ' + JSON.stringify(passenger));
        if (isPassengerDataValid()) {
            onSubmit(Array.of(passenger));
        } else {
            Logger.error('Passenger form validation failed: ' + JSON.stringify(passenger));
            toast('Please fill in all required fields for all passengers');
        }
    };

    const handleInputChange = (field: string, value: string | number | boolean) => {
        setPassenger(prev => ({
            ...prev,
            [field]: value,
        }));
    };
    
    const isTabComplete = (passenger: Passenger, tab: string) => {
        switch (tab) {
            case 'basic':
                return Boolean(passenger.firstName && passenger.lastName && passenger.title);
            case 'travel':
                return Boolean(
                    passenger.nationality &&
                        passenger.passportNumber &&
                        passenger.passportExpiryDate
                );
            case 'preferences':
                return true; // Optional fields, always complete
            default:
                return false;
        }
    };

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab)
    }


    return (
        <div className={'w-full flex flex-col items-center justify-center gap-6'}>

            <Tabs
                defaultValue={currentTab}
                onValueChange={handleTabChange}
                className={'w-full md:w-2/3 lg:w-1/2'}
            >
                <TabsList>
                    {[{id: "basic", name: "Basic Details"}, 
                    {id: "travel", name: "Travel Details"}, 
                    {id: "preference", name: "Preferences"}].map((tab) => (
                        <TabsTrigger 
                            key={tab.id}
                            value={tab.id}
                            className={'flex items-center'}
                        >
                            <div className={"flex items-center justify-between gap-2"}>
                                {tab.id === "basic" && <User className="h-4 w-4" />}
                                {tab.id === "travel" && <Plane className="h-4 w-4" />}
                                {tab.id === "preference" && <Briefcase className="h-4 w-4" />}
                                <span className={""}>
                                    {tab.name}
                                </span>
                            </div>
                            
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <form 
                onSubmit={handleSubmit}
                className={"w-full md:w-2/3 lg:w-1/2"}
            >
                <Card className={'w-full h-full max-h-screen p-6'}>
                    <CardHeader className={"w-full"}>
                        <Label></Label>
                    </CardHeader>
                    <CardContent className={'w-full flex flex-col gap-4'}>
                        <div className={"w-full h-12 flex gap-4 items-center justify-center"}>
                            <div className={"flex flex-col gap-2"}>
                                <Label htmlFor={`title`}>
                                    Title<span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={''}
                                    onValueChange={(value) => {
                                        handleInputChange("title", value)
                                    }}
                                >
                                    <SelectTrigger id={`title`} className={"w-full"}>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className={"w-full"}>
                                        <SelectItem value="Mr">Mr.</SelectItem>
                                        <SelectItem value="Mrs">Mrs.</SelectItem>
                                        <SelectItem value="Ms">Ms.</SelectItem>
                                        <SelectItem value="Dr">Dr.</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className={"flex flex-col gap-2"}>
                                <Label htmlFor={`nationality`}>
                                    Nationality<span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={''}
                                    onValueChange={(value) => {
                                        handleInputChange("nationality", value)
                                    }}
                                >
                                    <SelectTrigger id={`nationality`} className={"w-full"}>
                                        <SelectValue placeholder="Select nationality" />
                                    </SelectTrigger>
                                    <SelectContent className={"w-full"}>
                                        {countries.map(country => (
                                            <SelectItem
                                                key={country.cca2}
                                                value={country.cca2}
                                            >
                                                {country.name.common}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className={"w-full h-12 flex gap-4 items-center justify-center"}>
                            <div className={'flex flex-col gap-2'}>
                                <Label htmlFor={"firstName"}>
                                    First Name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input 
                                    id={"firstName"}
                                    placeholder="As shown on ID/passport"
                                    className={'w-full'}
                                    onChange={(event) => {
                                        handleInputChange("firstName", event.target.value);
                                    }}
                                />
                            </div>
                            <div className={'flex flex-col gap-2'}>
                                <Label htmlFor={"lastName"}>
                                    Last Name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input 
                                    id={"lastName"}
                                    placeholder="As shown on ID/passport"
                                    className={'w-full'}
                                    onChange={(event) => {
                                        handleInputChange("lastName", event.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className={"w-full h-12 flex gap-4 items-center justify-center"}>
                            <div className={"flex flex-col gap-2"}>
                                <Label htmlFor={`passportId`}>
                                    Passport ID
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id={`passportId`}
                                    value={''}
                                    type={'text'}
                                    placeholder="As shown on passport"
                                    className="w-full"
                                    onChange={event =>{
                                        handleInputChange('passportNumber', event.target.value )
                                    }}
                                    
                                />
                            </div>

                            <div className={"flex flex-col gap-2"}>
                                <Label htmlFor={`passportExpiryDate`}>
                                    Passport Expiry Date
                                    <span className="text-red-500">*</span>
                                </Label>
                                <DatePicker 
                                    id={`passportExpiryDate`}
                                    date={passenger.passportExpiryDate}
                                    className={"w-full"}
                                    onSelect={(date) => {
                                        handleInputChange("passportExpiryDate", date?.toString() || "")
                                    }}
                                    placeholder={"As shown on passport"}
                                    mode={"single"}
                                    selected={new Date()}
                                    preset={true}
                                    presets={[
                                        { name: 'Today', value: '0' },
                                        { name: 'Tomorrow', value: '1' },
                                        { name: 'In 3 days', value: '3' },
                                        { name: 'In a week', value: '7' },
                                        { name: 'In 2 weeks', value: '14' },
                                        { name: 'In a month', value: '30' },
                                        { name: 'In 3 months', value: '90' },
                                        { name: 'In 6 months', value: '180' },
                                        { name: 'In a year', value: '365' },
                                    ]}
                                />                  
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default PassengerForm;
