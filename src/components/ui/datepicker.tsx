import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent,  PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface DatePickerProps {
    id?: string
    className?: string
    placeholder?: string
    date: string
    onSelect?: ((date?: Date) => void)
    mode?: "single" | "multiple" | "range"
    selected: Date
    preset?: boolean
    presets?: {name: string, value: string}[]
}

const DatePicker: React.FC<DatePickerProps> = (props) => {

    const onPresetValueSelect = (value: string) => {
        const days = parseInt(value)
        const newDate = addDays(new Date(), days)

        props.date = format(props.selected, "PPP")
        if (props.onSelect) {
            props.onSelect(newDate)
        }
    }


    return (
        <Popover modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "cursor-pointer w-[240px] justify-start text-left font-normal", !props.date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    {props.placeholder? <span>{props.placeholder}</span> : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="pointer-events-auto flex w-auto flex-col space-y-2 p-2"
            >
                {props.preset && (
                    <Select onValueChange={(value) => onPresetValueSelect(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            {props.presets ? 
                                props.presets.map((preset) => <SelectItem value={preset.value}>{preset.name}</SelectItem>) : 
                                (<>
                                    <SelectItem value="0">Today</SelectItem>
                                    <SelectItem value="1">Tomorrow</SelectItem>
                                    <SelectItem value="3">In 3 days</SelectItem>
                                    <SelectItem value="7">In a week</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                )}
                <div className="rounded-md border">
                    <Calendar 
                        id={props.id}
                        className={props.className} 
                        
                        mode={"single"} 
                        selected={props.selected} 
                        onSelect={props.onSelect} 
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker