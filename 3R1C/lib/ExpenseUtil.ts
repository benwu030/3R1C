import { CLOTHES } from "@/constants/clothes";

function isInCurrentWeek(date: Date, currentDate: Date, range: number): boolean {
    return date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth() && date.getDate() >= currentDate.getDate() - currentDate.getDay() && date.getDate() <= currentDate.getDate() + range - currentDate.getDay();
}
function isInCurrentMonth(date: Date, currentDate: Date): boolean {
    return date.getFullYear() === currentDate.getFullYear();
}
function isInCurrentYear(date: Date, currentDate: Date): boolean {
    return date.getFullYear() === currentDate.getFullYear();
}
export function getExpenses(clothes:CLOTHES, groupBy: 'week' | 'month' | 'year',currenrtDate:Date):number{

    const expenses = clothes.reduce((acc, clothe) => {
        if (!clothe.purchasedate) return acc;
        const date = new Date(clothe.purchasedate);
        if(groupBy === 'week'){
            if(isInCurrentWeek(date,currenrtDate,6)){
                return acc + clothe.price;
            }
        }else if(groupBy === 'month'){
            if(isInCurrentMonth(date,currenrtDate)){
                return acc + clothe.price;
            }
        }else if(groupBy === 'year'){
            if(isInCurrentYear(date,currenrtDate)){
            return acc + clothe.price;
            }
        }
        return acc;
    }, 0);
    return expenses;
}

export function createLineChartData(clothes: CLOTHES, groupBy: 'week' | 'month' | 'year',currenrtDate= new Date ()): { label: string, value: number }[]  {
    // Define day and month labels
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Group clothes by the specified time period
    const groupedClothes = clothes.reduce((acc, clothe) => {
        if (!clothe.purchasedate) return acc;
        const date = new Date(clothe.purchasedate);
        
        let key = '';
        if (groupBy === 'week' && isInCurrentWeek(date,currenrtDate,6)) {
            // Use day of week (0-6) as key
            key = date.getDay().toString();
        } else if (groupBy === 'month' && isInCurrentMonth(date,currenrtDate)) {
            // Use month (0-11) as key
            key = date.getMonth().toString();
        } else if (groupBy === 'year' && isInCurrentYear(date,currenrtDate)) {
            // Use full year as key
            key = date.getFullYear().toString();
        } else{
            //not in valid range
            return acc;
        }
        if (!acc[key]) {
            acc[key] = 0;
        }
        acc[key] += clothe.price;
        return acc;
    }, {} as Record<string, number>);
    // Convert to required format with proper labels
    let result: { label: string, value: number,date:Date }[] = [];
    
    if (groupBy === 'week') {
        // Create entries for all days of the week
        result = dayLabels.map((label, index) => {
            const date = new Date(currenrtDate.getFullYear(), currenrtDate.getMonth(), currenrtDate.getDate() + index - currenrtDate.getDay());
            return {
            label,
            value: groupedClothes[index.toString()] || 0,
            date
            };
        });
    } else if (groupBy === 'month') {
        // Create entries for all months
        result = monthLabels.map((label, index) => ({
            label,
            value: groupedClothes[index.toString()] || 0,
            date: new Date(currenrtDate.getFullYear(), index, 1)
        }));
    } else if (groupBy === 'year') {
        // Sort years and use them directly as labels
        result = Object.entries(groupedClothes)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([year, value]) => ({
                label: year,
                value,
                date: new Date(parseInt(year), 0, 1)
            }));
    }
    return result;
}