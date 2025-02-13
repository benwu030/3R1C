import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CalendarProps {
    currentDate?: Date;
    onSelectDate?: (date: Date) => void;
}


const Calendar= ({ 
    currentDate = new Date(),
    onSelectDate 
}:CalendarProps) => {
    const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const getDisplayMonth = (date: Date) => {
        
        return date.toLocaleString('default', { month: 'long' });
    }
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
        onSelectDate?.(newDate);
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Add empty spaces for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<View key={`empty-${i}`} className="w-[14.28%] h-[14.28%]" />);
        }

        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === new Date().getDate() && 
                           currentDate.getMonth() === new Date().getMonth() &&
                           currentDate.getFullYear() === new Date().getFullYear();
            
            const isSelected = selectedDate?.getDate() === i && 
                             selectedDate?.getMonth() === currentDate.getMonth() &&
                             selectedDate?.getFullYear() === currentDate.getFullYear();

            days.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handleDateSelect(i)}
                    className={`
                        w-[14.28%]
                        h-[14.28%]
                        items-center justify-center p-1
                         rounded-xl
                        ${isSelected ? 'bg-beige-darker' : ''}

                    `}
                >
                    <Text 
                        className={`
                            text-lg
                            text-center
                            ${isToday ? 'text-sand-deep font-S-Bold border-b' : ''}
                            ${isSelected ? 'text-sand-deep font-S-Bold text-white ' : 'font-S-Regular'}
                        `}
                    >
                        {i}
                    </Text>
                </TouchableOpacity>
            );
        }

        return days;
    };

    return (
        
        <View className="px-5 flex-1">
            <Text className="font-S-Bold text-3xl mb-4">{getDisplayMonth(selectedDate)}</Text>

            <View className="flex-row mb-4">
                {weekDays.map((day) => (
                    <View key={day} className="flex-1 items-center p-1 ">
                        <Text className="font-S-Bold">{day}</Text>
                    </View>
                ))}
            </View>
            <View className="flex-row flex-wrap ">
                {renderCalendarDays()}
            </View>
        </View>
  
    )
}

export default Calendar;
