import { CheckCircle, FileWarning, LucidePercentDiamond, NotebookTextIcon, Percent, Phone, SparklesIcon, Trophy, UserRoundCheckIcon, UserRoundXIcon } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import PieStatsChart from "@/components/PieChart";
import BarChartComponent from "@/components/BarChart";
import { useEffect, useState } from "react";
import { getMonthName, getWeekRange } from "@/lib/helperfn";
import { getAvgPresentLongMessage } from "@/lib/getdashboardmsgs";
import { useSelector } from "react-redux";
import LineStatsChart from "./LineChart";
import { format } from "date-fns";


function calculateMonthlyAttendanceAvg(attendanceData, stdAttendance) {
    const monthlyData = {};

    // Group student attendance by month and calculate StudentAvg for each student
    stdAttendance.forEach(record => {
        const date = new Date(record.date);
        const month = getMonthName(date.getMonth() + 1); // Month starts from 0, so we add 1
        if (!monthlyData[month]) {
            monthlyData[month] = { presentCount: 0, totalCount: 0, totalStudentCount: 0, studentAvgSum: 0 };
        }

        if (record.status === 'present') {
            monthlyData[month].presentCount += 1;
        }
        monthlyData[month].totalCount += 1;
    });

    // Group faculty attendance data by month and calculate ClassAvg
    attendanceData.forEach(data => {
        const date = new Date(data.createdAt);
        const month = getMonthName(date.getMonth() + 1);
        if (!monthlyData[month]) {
            monthlyData[month] = { presentCount: 0, totalCount: 0, totalStudentCount: 0, studentAvgSum: 0 };
        }

        // Assuming attendanceData gives percentage per day
        const classAttendancePercentage = data.presentPercentage; // Percentage per day
        monthlyData[month].studentAvgSum += classAttendancePercentage;
        monthlyData[month].totalStudentCount += 1;
    });

    // Calculate averages for each month
    const result = [];
    Object.keys(monthlyData).forEach(month => {
        const { presentCount, totalCount, totalStudentCount, studentAvgSum } = monthlyData[month];

        // Calculate StudentAvg for each student
        const StudentAvg = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(2) : 0;

        // Calculate ClassAvg (average percentage of student attendance for the month)
        const ClassAvg = totalStudentCount > 0 ? (studentAvgSum / totalStudentCount).toFixed(2) : 0;

        result.push({
            label: month,
            StudentAvg: StudentAvg,  // percentage of student present
            ClassAvg: ClassAvg // average of students' attendance percentages
        });
    });

    return result;
}

const getWeekday = (dateString) => {
    const date = new Date(dateString);

    // Array of weekdays
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Get the day number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const weekday = daysOfWeek[date.getDay()];

    return weekday;
};

const getPresentCount = (data) => {
    let presentCount = 0
    data.forEach(element => {
        if (element.status === "present")
            presentCount++
    });
    return presentCount
}
const countAbsencesByReason = (stdAttendance) => {
    return stdAttendance.reduce((acc, student) => {
        const reason = student.reason || 'Uninformed absence';
        acc[reason] = (acc[reason] || 0) + 1;
        return acc;
    }, {});
};

const generatePieChartData = (stdAttendance) => {
    const totalPresentCount = getPresentCount(stdAttendance);
    const totalPresentPercentage = (totalPresentCount / stdAttendance.length) * 100;
    const absentPercentage = 100 - totalPresentPercentage;

    // Get the absence count from the attendance data
    const absenceCount = countAbsencesByReason(stdAttendance);

    // Calculate total number of absences
    const totalAbsences = Object.values(absenceCount).reduce((acc, count) => acc + count, 0);

    // Generate the pie data (Start with present data)
    const pieData = [
        { name: "Present", value: totalPresentPercentage },
        // Distribute absent percentage only if there are absences
        ...totalAbsences > 0
            ? Object.keys(absenceCount).map((reason) => ({
                name: `Absent: ${reason}`,
                value: (absenceCount[reason] / totalAbsences) * absentPercentage
            }))
            : []
    ];

    return pieData;
};


const AttendanceStats = ({ attendanceData, activePeriod, date, totalStudents, stdAttendance, selectedStudent }) => {
    const user = useSelector((state) => state.user.user);
    const [chartData, setChartData] = useState([])

    const calculatePercentAverages = (data) => {
        let totalPresentPercentage = 0;
        data.forEach(item => {
            totalPresentPercentage += item.presentPercentage;
        });
        const avgPresentPercentage = totalPresentPercentage / data.length;
        return avgPresentPercentage
    };

    const groupAbsencesByReason = (attendanceData) => {
        const absenceCount = {};

        attendanceData.forEach((record) => {

            record.absent.forEach((student) => {
                const reason = student.reason || 'Uninformed absence';
                if (absenceCount[reason]) {
                    absenceCount[reason]++;
                } else {
                    absenceCount[reason] = 1;
                }
            });
        });

        return absenceCount;
    };

    const getTopAbsentStudents = (attendanceData) => {
        // Create an object to store absence count for each student
        const studentAbsenceCount = {};
        let perfectPresentCount = 0;
        let perfectIds = []

        // Iterate over attendance data and count the absences for each student
        attendanceData.forEach((record) => {
            record.absent.forEach((student) => {
                const studentRollNo = student.rollNo; // Using student rollno as unique identifier
                const studentDetails = {
                    age: student.age,
                    imageUrl: student.imageUrl,
                    name: student.name,
                    parentPhone: student.parentPhone,
                    rollNo: student.rollNo,
                    _id: student._id
                };

                if (studentAbsenceCount[studentRollNo]) {
                    studentAbsenceCount[studentRollNo].count++;
                } else {
                    studentAbsenceCount[studentRollNo] = { count: 1, details: studentDetails };
                }
            });
        });
        attendanceData.forEach((record) => {
            record.present.forEach((student) => {
                const studentRollNo = student.rollNo;
                if (!studentAbsenceCount[studentRollNo]) {
                    perfectPresentCount++;
                    perfectIds.push(student._id)
                }
            })
        });



        const sortedAbsences = Object.entries(studentAbsenceCount)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 10) // Sort by absence count in descending order


        const sortedArray = sortedAbsences.map(([name, { count, details }]) => ({
            ...details, // spread the student details
            absenceCount: count, // add the absence count
        }));

        return { perfectPresentCount, sortedArray, perfectIds }
    };


    useEffect(() => {
        if (attendanceData?.length > 0) {
            const chart = []; // Initialize chart array

            attendanceData.forEach(item => {
                let dateLabel = '';

                if (activePeriod !== "Daily") {
                    if (item._id.week) {
                        // Weekly data
                        dateLabel = getWeekRange(item._id.year, item._id.week);
                    } else if (item._id.month) {
                        // Monthly data
                        dateLabel = getMonthName(item._id.month);
                    }
                } else {
                    // Daily data
                    dateLabel = new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric'
                    });
                }

                chart.push({
                    date: dateLabel,
                    absent: item.absent.length,
                    present: item.present.length,
                    presentPercentage: item.presentPercentage,
                });
            });

            // Reverse chart data and update state
            setChartData(chart.reverse());
        }
    }, [attendanceData]); // Depend on attendanceData and activePeriod


    // const totalStudents = 2
    const preparePieData = (attendanceData) => {
        const totalPresentPercentage = calculatePercentAverages(attendanceData);

        // Calculate the absent percentage
        const absentPercentage = 100 - totalPresentPercentage;

        // Get the absence count from the attendance data
        const absenceCount = groupAbsencesByReason(attendanceData);

        // Calculate the total number of absences
        const totalAbsences = Object.values(absenceCount).reduce((acc, count) => acc + count, 0);

        // Calculate the percentage for each absence category
        const pieData = [
            { name: "Present", value: totalPresentPercentage },
        ];

        // If there are absences, we will distribute the absent percentage
        if (totalAbsences > 0) {
            // Calculate the percentage for each absence category based on its count
            Object.keys(absenceCount).forEach((reason) => {
                const reasonPercentage = (absenceCount[reason] / totalAbsences) * absentPercentage;
                pieData.push({ name: `Absent: ${reason}`, value: reasonPercentage });
            });
        }

        return pieData;
    };
    const PresentAvg = calculatePercentAverages(attendanceData).toFixed(2)
    const Perfectionists = getTopAbsentStudents(attendanceData).perfectPresentCount


    return (
        attendanceData?.length > 0 ?
            <>

                <div className="border bg-muted p-5 my-3">
                    <div className="flex gap-2.5 items-center">
                        <NotebookTextIcon size={35} className="rounded-full border p-2 " />
                        <div className="w-[60%]">
                            <p className="text-xs">{getAvgPresentLongMessage(PresentAvg, Perfectionists)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card p-4  my-3 rounded-sm border">
                    <h3 className="text-xs text-muted-foreground pb-2.5">Total Averages</h3>
                    <div className="grid grid-cols-5">
                        <div className="flex gap-2.5 items-center">
                            <UserRoundCheckIcon size={35} color="green" className="rounded-full border p-2 " />
                            <div className="w-[60%]">
                                <p className="text-md">{user.role === "Parent" ? `${getPresentCount(stdAttendance)} / ${stdAttendance?.length}` :
                                    `${((calculatePercentAverages(attendanceData) / 100) * totalStudents).toFixed(2)} / ${totalStudents}`
                                }
                                </p>
                                <p className="text-xs">{user.role !== "Parent" ? "Avg. Absent" : "Total Present"}</p>
                            </div>
                        </div>
                        <div className="flex gap-2.5 items-center">
                            <UserRoundXIcon size={35} color="red" className="rounded-full border p-2 " />
                            <div className="w-[60%]">
                                <p className="text-md">
                                    {user.role === "Parent" ? `${stdAttendance?.length - getPresentCount(stdAttendance)} / ${stdAttendance?.length}` : `${(((100 - calculatePercentAverages(attendanceData)) / 100) * totalStudents).toFixed(2)}/${totalStudents}`
                                    }
                                </p>
                                <p className="text-xs">{user.role !== "Parent" ? "Avg. Absent" : "Total Absent"}</p>
                            </div>
                        </div>
                        <div className="flex gap-2.5 items-center">
                            <Percent size={35} color="green" className="rounded-full border p-2 " />
                            <div className="w-[60%]">
                                <p className="text-md">{PresentAvg}%</p>
                                <p className="text-xs">{user.role !== "Parent" ? "Present Rate" : "Class Present Rate"}</p>
                            </div>
                        </div>
                        <div className="flex gap-2.5 items-center">
                            <LucidePercentDiamond size={35} color={user.role === "Parent" ? 'gray' : "red"} className="rounded-full border p-2 " />
                            <div className="w-[60%]">
                                <p className="text-md">
                                    {user.role === "Parent" ? `${((getPresentCount(stdAttendance) / stdAttendance.length) * 100).toFixed(2)}%` : `${Math.abs(100 - calculatePercentAverages(attendanceData).toFixed(2))}%`}
                                </p>
                                <p className="text-xs"> {user.role !== "Parent" ? "Absent Rate" : "Your Kid's Rate"}</p>
                            </div>
                        </div>
                        <div className="flex gap-2.5 items-center">
                            <Trophy size={35} color={user.role === "Parent" ? (getTopAbsentStudents(attendanceData).perfectIds.some(i => selectedStudent === i) ? "gold" : "red") : "gold"} className="rounded-full border p-2 " />
                            <div className="w-[60%]">
                                <p className="text-md">
                                    {user.role === "Parent" ? (getTopAbsentStudents(attendanceData).perfectIds.some(i => selectedStudent === i) ? "Is A" : "Not In")
                                        : getTopAbsentStudents(attendanceData).perfectPresentCount
                                    }
                                </p>
                                <p className="text-xs">Perfectionists</p>
                            </div>
                        </div>
                    </div>
                </div>
                {user.role !== "Parent" && <div className="bg-card h-[400px] p-4  rounded-sm border">
                    <h3 className="text-xs text-muted-foreground pb-6">Total Present vs Total Absent</h3>
                    {(!date || date.to === undefined || date.from === undefined) || (chartData?.length <= 0) || ((activePeriod === "Monthly" && (date.to - date.from) / (1000 * 60 * 60 * 24) < 90) || (activePeriod === "Weekly" && (date.to - date.from) / (1000 * 60 * 60 * 24) < 15) || (activePeriod === "Daily" && (date.to - date.from) / (1000 * 60 * 60 * 24) > 31)) ?
                        <div className="flex flex-col gap-2 items-center justify-center align-middle h-full">
                            <FileWarning color="grey" />
                            <p className="text-xs text-muted-foreground">
                                {(!date || date.to === undefined || date.from === undefined) || (activePeriod === "Daily" && (date.to - date.from) / (1000 * 60 * 60 * 24) > 31) ? "Please Select Less Than 30 days" : "Not Enough Data To Prepare Chart"
                                }
                            </p>
                        </div>
                        :
                        chartData?.length > 0 && <BarChartComponent data={chartData} barDataKey1={{
                            dataKey: "absent",
                            name: "Absent Students"
                        }} barDataKey2={{
                            dataKey: "present",
                            name: "Present Students"
                        }} XAxisKey={'date'} />}
                </div>}
                {user.role === "Parent" &&
                    <div className="bg-card h-[400px] p-4  rounded-sm border">
                        <h3 className="text-xs text-muted-foreground pb-6">Total Present vs Total Absent</h3>
                        <LineStatsChart data={calculateMonthlyAttendanceAvg(attendanceData, stdAttendance)} XAxisKey='label'
                            lineDataKey1='ClassAvg' lineDataKey2="StudentAvg" />
                    </div>

                }

                <div className="flex gap-4 mt-5 mb-3 relative">
                    <div className="w-[63%]  bg-card p-4 rounded-sm border">
                        <h3 className="text-xs text-muted-foreground pb-2.5">Breakdown</h3>
                        <div>
                            <PieStatsChart data={user.role !== "Parent" ? preparePieData(attendanceData) : generatePieChartData(stdAttendance)} />
                        </div>
                    </div>
                    <div className="w-[37%] h-fit sticky top-[10%]">
                        <div className="bg-card p-4 rounded-sm border">
                            <h3 className="text-xs text-muted-foreground pb-2.5">Common Reasons</h3>
                            {user.role !== "Parent" && (Object.entries(groupAbsencesByReason(attendanceData)).length > 0 ? (Object.entries(groupAbsencesByReason(attendanceData)).sort((a, b) => b[1] - a[1]).map(([reason, count], idx) => (
                                <div key={reason}> {idx !== 0 && <hr />}
                                    <div className="flex p-2 gap-2 items-center py-3">
                                        <p className="border rounded-full text-sm p-2 w-[35px] text-center h-fit">{idx + 1}</p>
                                        <div >
                                            <p className="text-sm">{reason}</p>
                                            <p className="text-xs text-muted-foreground">{count} {count > 1 ? " Students" : " Student Only"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))) : <p className="h-[70px] flex items-center justify-center"><CheckCircle color="green" size={22} className="pr-1" /> No Absent Reasons Found</p>)}

                            {user.role === "Parent" && (Object.entries(countAbsencesByReason(stdAttendance.filter(i => i.status === "absent"))).length > 0 ? (Object.entries(countAbsencesByReason(stdAttendance.filter(i => i.status === "absent"))).sort((a, b) => b[1] - a[1]).map(([reason, count], idx) => (
                                <div key={reason}> {idx !== 0 && <hr />}
                                    <div className="flex p-2 gap-2 items-center py-3">
                                        <p className="border rounded-full text-sm p-2 w-[35px] text-center h-fit">{idx + 1}</p>
                                        <div >
                                            <p className="text-sm">{reason}</p>
                                            <p className="text-xs text-muted-foreground">{count} {count > 1 ? " Times" : " Time Only"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))) : <p className="h-[70px] flex items-center justify-center"><CheckCircle color="green" size={22} className="pr-1" /> No Absent Reasons Found</p>)}
                        </div>
                    </div>
                </div>

                {user.role !== "Parent" && <div className="bg-card mt-4  p-4 rounded-sm border">
                    <h3 className="text-xs text-muted-foreground pb-6">Most Absent Students</h3>
                    {getTopAbsentStudents(attendanceData).sortedArray.length > 0 ? <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Roll No</TableHead>
                                <TableHead>Photo</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead className='text-center'>Absent Count</TableHead>
                                <TableHead className="text-right">Parent Number</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                getTopAbsentStudents(attendanceData).sortedArray.map((student, idx) => {
                                    return <TableRow key={student.rollNo}>
                                        <TableCell className="font-medium">{student.rollNo}</TableCell>
                                        <TableCell><img className="rounded-full h-[40px] object-cover" width={40} src={student.imageUrl} /></TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.age}</TableCell>
                                        <TableCell className='text-center'>{student.absenceCount}</TableCell>
                                        <TableCell onClick={() => window.location.href = `tel:${student.parentPhone}`}
                                            className="text-right cursor-pointer flex justify-end gap-2 items-center h-[60px]"><Phone size={13} /> <span className="hover:border-b border-gray-500">
                                                {student.parentPhone}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
                        : <p className="h-[30vh] flex items-center justify-center">No Absent Students</p>
                    }
                </div>}

                {user.role === "Parent" && <div className="bg-card mt-4  p-4 rounded-sm border">
                    <h3 className="text-xs text-muted-foreground pb-6">Most Absent Students</h3>
                    {stdAttendance.length > 0 ? <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[43.33%]">Date</TableHead>
                                <TableHead className="w-[33.33%]">WeekDay</TableHead>
                                <TableHead className="w-[33.33%]">Status</TableHead>
                                <TableHead className="text-right w-[33.33%]">Reason</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                [...stdAttendance].reverse().map((student, idx) => {
                                    return <TableRow key={student._id}>
                                        <TableCell className="font-medium">{format(new Date(student.date), 'MMMM dd, yyyy')}</TableCell>
                                        <TableCell>{getWeekday(student.date)}</TableCell>
                                        <TableCell className={student.status === "present" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{student.status.charAt(0).toUpperCase() + student.status.slice(1).toLowerCase()}</TableCell>
                                        <TableCell className='text-right'>{student.reason ? student.reason : "--"}</TableCell>
                                    </TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
                        : <p className="h-[30vh] flex items-center justify-center">No Absent Students</p>
                    }
                </div>}

            </>
            :
            <div className="flex flex-col gap-2 items-center justify-center align-middle h-full">
                <FileWarning color="grey" />
                <p className="text-xs text-muted-foreground">
                    Not Enough Data To Prepare Chart
                </p>
            </div>
    )
}

export default AttendanceStats
