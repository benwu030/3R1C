import { CLOTHES } from "@/constants/clothes";

export function getExpenses(clothes:CLOTHES):number{

    const expenses = clothes.reduce((acc, clothe) => {
        return acc + clothe.price;
    }, 0);

    return expenses;
}

export function createLineChartData(clothes: CLOTHES, groupBy: 'week' | 'month' | 'year'): { label: string, value: number }[]  {
    // Define day and month labels
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Group clothes by the specified time period
    const groupedClothes = clothes.reduce((acc, clothe) => {
        if (!clothe.purchasedate) return acc;
        const date = new Date(clothe.purchasedate);
        
        let key = '';
        if (groupBy === 'week') {
            // Use day of week (0-6) as key
            key = date.getDay().toString();
        } else if (groupBy === 'month') {
            // Use month (0-11) as key
            key = date.getMonth().toString();
        } else if (groupBy === 'year') {
            // Use full year as key
            key = date.getFullYear().toString();
        }
        
        if (!acc[key]) {
            acc[key] = 0;
        }
        acc[key] += clothe.price;
        return acc;
    }, {} as Record<string, number>);

    // Convert to required format with proper labels
    let result: { label: string, value: number }[] = [];
    
    if (groupBy === 'week') {
        // Create entries for all days of the week
        result = dayLabels.map((label, index) => ({
            label,
            value: groupedClothes[index.toString()] || 0
        }));
    } else if (groupBy === 'month') {
        // Create entries for all months
        result = monthLabels.map((label, index) => ({
            label,
            value: groupedClothes[index.toString()] || 0
        }));
    } else if (groupBy === 'year') {
        // Sort years and use them directly as labels
        result = Object.entries(groupedClothes)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([year, value]) => ({
                label: year,
                value
            }));
    }
    console.log(result);
    return result;
}