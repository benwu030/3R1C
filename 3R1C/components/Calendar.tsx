import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import OutfitPreview from './OutfitPreview';
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
    const getDisplayYear = (date: Date) => {
        
        return date.getFullYear()
    }
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handleDateSelect = (date: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
        setSelectedDate(newDate);
        onSelectDate?.(newDate);
    };


   

   
    const renderCalendarDays = (date:Date) => {
        const daysInMonth = getDaysInMonth(date);
        const firstDay = getFirstDayOfMonth(date);
        const days = [];

        // Add empty spaces for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            
            days.push(i);
        }

        return days;
    };
    const [calendarDays, setCalendarDays] = useState<(number | null)[]>(renderCalendarDays(selectedDate));
    const[currentDisplayDate,setCurrentDisplayDate] = useState(currentDate);
    const loadMoreMonths = (direction: 'next' | 'prev') => {
       if(direction === 'next'){
           const nextMonth = new Date(Date.UTC(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth() + 1))
           console.log(nextMonth);
           setCalendarDays(renderCalendarDays(nextMonth));
           setCurrentDisplayDate(nextMonth);
    }
    else{
        const prevMonth = new Date(Date.UTC(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth() - 1))
        setCalendarDays(renderCalendarDays(prevMonth))
        setCurrentDisplayDate(prevMonth)
    }
}

//when scrolling end, isScrolling will be set to false via onMomentumScrollEnd
//thus handleScroll will be update the calendar days once the user stops scrolling
const [isScrolling, setIsScrolling] = useState(true); 
const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    console.log(offsetY);
    if(offsetY < 0 && !isScrolling){
        loadMoreMonths('prev')
        setIsScrolling(true)
    }
    else if(offsetY > 0 && !isScrolling){
        loadMoreMonths('next')
        setIsScrolling(true)

    }
}
    return (
        
        <View className='px-5 h-full'>
            <Text className="font-S-Bold text-3xl mb-4">{getDisplayYear(currentDisplayDate)} {getDisplayMonth(currentDisplayDate)}</Text>

         
            {/* Calendar Days  onMomentumScrollEnd will be called when the scroll stops*/}
            <FlatList
                className="border-b border-grey-darker flex-1"
                data={calendarDays}
                showsVerticalScrollIndicator={false}
                contentContainerClassName=''
                columnWrapperClassName=''
                horizontal={false}
                onScroll={handleScroll}
                onMomentumScrollEnd={() => setIsScrolling(false)}
                renderItem={({ item }) => {
                    if(item === null) {
                        return <View key={`empty-${item}`} className="w-[14.28%] items-center p-1" />
                    }
                    const isToday = item === new Date().getDate() && 
                    selectedDate.getMonth() === new Date().getMonth() &&
                    selectedDate.getFullYear() === new Date().getFullYear();
                
                    const isSelected = selectedDate?.getDate() === item && 
                                 selectedDate?.getMonth() === selectedDate.getMonth() &&
                                 selectedDate?.getFullYear() === selectedDate.getFullYear();
                    return(
                                 <TouchableOpacity
                                 key={item}
                                 onPress={() => handleDateSelect(item)}
                                 className={`
                                    w-[14.28%]
                                     items-center p-1
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
                                     {item}
                                 </Text>
                             </TouchableOpacity>)}}
                numColumns={7}
                keyExtractor={(_, index) => index.toString()}
                ListHeaderComponent={
                    <View className="bg-sand-dark flex-row mb-4 border-b border-grey-darker">

                        {weekDays.map((day) => (
                            <View key={day} className="flex-1 items-center p-1">
                                <Text className="font-S-Bold">{day}</Text>
                            </View>
                        ))}
               </View>
                }
                stickyHeaderIndices={[0]}
            />

            <ScrollView>
                <OutfitPreview date={selectedDate} />
            </ScrollView>
        </View>
        
    )
}

export default Calendar;
