import React, { useState, useEffect } from 'react';
import LineStatsChart from './LineChart';
import { getMonthName, getWeekRange } from '@/lib/helperfn';
import { FileWarning, LucideFlameKindling, MessageSquareTextIcon, TrendingUp } from 'lucide-react';
import { getAvgGrowthRateMessage, getAvgPercentMessage } from '@/lib/getdashboardmsgs';

const GrowthRateStats = ({ attendanceData, activePeriod, date }) => {

    const [avgs, setAvgs] = useState({
        growthAvg: 0,
        presentAvg: 0
    });

    const [chartData, setChartData] = useState([]); // To hold the processed chart data

    // Function to calculate the growth rate
    const calculateGrowthRate = (data) => {
        const result = [];
        let totalGrowth = 0;
        let totalPresent = 0;

        result.push({
            label: data[0]?._id?.week ? getWeekRange(data[0]?._id?.year, data[0]?._id?.week) : (data[0]?._id?.month ? getMonthName(data[0]?._id.month) : new Date(data[0].createdAt).toLocaleDateString('en-US')),
            GrowthRate: 0, // Day 1 growth is always 0
            PresentPercentage: data[0].presentPercentage,
            amt: 0,
        });
        

        // Iterate over the data starting from Day 2 (index 1)
        for (let i = 1; i < data.length; i++) {
            const prevData = data[i - 1];
            const currData = data[i];

            let growthRate = 0;

            // Handle case where previous day's present percentage is 0
            if (prevData.presentPercentage !== 0) {
                // Calculate growth rate as percentage change
                growthRate = ((currData.presentPercentage - prevData.presentPercentage) / prevData.presentPercentage) * 100;
            } else {
                // Special case where the previous day's attendance is 0
                growthRate = currData.presentPercentage === 0 ? 0 : 100; // If 0% to non-zero, set it to 100% growth
            }

            // If the result is NaN or Infinity, set it to 0
            if (isNaN(growthRate) || !isFinite(growthRate)) {
                growthRate = 0;
            }

            // Accumulate the totals for the averages
            totalGrowth += growthRate;
            totalPresent += currData.presentPercentage;

            // Push the formatted data for the line chart
            result.push({
                label: data[i]?._id?.week ? getWeekRange(data[i]?._id?.year, data[i]?._id?.week) : data[i]?._id?.month ? getMonthName(data[i]?._id.month) : new Date(data[i].createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric'
                }), // Label as Day 2, Day 3, etc.
                GrowthRate: growthRate.toFixed(2), // Growth rate (percentage change)
                PresentPercentage: currData.presentPercentage.toFixed(2),
                amt: 0, // Placeholder for your chart
            });
        }

        // After the loop, calculate the averages
        const growthAvg = totalGrowth / (data.length - 1); // Exclude Day 1 from the growth average
        const presentAvg = (totalPresent + data[0].presentPercentage) / data.length;

        // Set the average values in the state
        setAvgs({
            presentAvg: presentAvg.toFixed(2),
            growthAvg: growthAvg.toFixed(2),
        });

        return result.reverse();
    };

    // Use useEffect to run the calculation once when attendanceData changes
    useEffect(() => {
        if (attendanceData && attendanceData.length > 0) {
            const calculatedData = calculateGrowthRate(attendanceData);
            setChartData(calculatedData); // Save calculated data to state
        }
    }, [attendanceData]); // Only recalculate if attendanceData changes

    return (

        attendanceData?.length > 0 ?
            <div>
                <div className="border bg-muted p-5 my-3">
                    <div className="flex justify-between gap-2.5 items-center">
                        <div className="w-[60%] flex gap-2.5 items-center">
                            <MessageSquareTextIcon size={35} className=" rounded-full border p-2 " />
                            <p className="text-xs w-[90%]">{getAvgGrowthRateMessage(avgs.growthAvg)} {getAvgPercentMessage(avgs.presentAvg)}</p>
                        </div>
                        <div className="flex gap-2.5 items-center">
                            <TrendingUp size={35} color="green" className="rounded-full border p-2 " />
                            <div className="w-[60%]">
                                <p className="text-md">{avgs.growthAvg}%</p>
                                <p className="text-xs">Avg. Growth</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-card h-[400px] p-4  rounded-sm border">
                    <h3 className="text-xs text-muted-foreground pb-6">Growth Rate vs Present Percentage</h3>
                    {((!date || date.to === undefined || date.from === undefined) || ((activePeriod === "Monthly" && (date.to - date.from) / (1000 * 60 * 60 * 24) < 90) || (activePeriod === "Weekly" && (date.to - date.from) / (1000 * 60 * 60 * 24) < 15) || (activePeriod === "Daily" && (date.to - date.from) / (1000 * 60 * 60 * 24) > 31))) ?
                        <div className="flex flex-col gap-2 items-center justify-center align-middle h-full">
                            <LucideFlameKindling color="grey" />
                            <p className="text-xs text-muted-foreground">
                                {(!date || date.to === undefined || date.from === undefined) || ((activePeriod === "Daily") && (date.to - date.from) / (1000 * 60 * 60 * 24) > 31) ? "Please Select Less Than 30 days" : "Not Enough Data To Prepare Chart"
                                }
                            </p>
                        </div>
                        :
                        <LineStatsChart data={chartData} XAxisKey='label'
                            lineDataKey1='GrowthRate' lineDataKey2="PresentPercentage" />
                    }
                </div>
            </div>
            :
            <div className="flex flex-col gap-2 items-center justify-center align-middle h-full">
                <FileWarning color="grey" />
                <p className="text-xs text-muted-foreground">
                    Not Enough Data To Prepare Chart
                </p>
            </div>
    );
}

export default GrowthRateStats;
