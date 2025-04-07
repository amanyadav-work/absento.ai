import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { AlertOctagonIcon, FileWarning, LucideChartNoAxesColumn, LucidePercentDiamond, TrendingDown, TrendingUp, UserCircle, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoonLoader } from "react-spinners";
import { getAttendanceMessage, getAvgGrowthRateMessage, getAvgPercentMessage, getStudentRecentAttendanceMessage } from "@/lib/getdashboardmsgs";
import { Progress } from "@/components/ui/progress"
import { addDays } from "date-fns";
import PieStatsChart from "@/components/PieChart";


const getLast7Days = () => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date();
  const last7Days = [];

  // Loop through the last 7 days and collect day names
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    last7Days.push({
      day: daysOfWeek[date.getDay()],
      date: date.toISOString().split('T')[0], // Just the date (YYYY-MM-DD) for comparison
    });
  }

  return last7Days;
};



const Dashboard = () => {
  const last7Days = getLast7Days();
  const user = useSelector((state) => state.user.user);
  const [attendanceData, setAttendanceData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [stdAttendance, setStdAttendance] = useState([])
  const [students, setStudents] = useState([])

  const getAttendanceStatus = (day) => {
    const attendanceForDay = stdAttendance.find(
      (record) => record.date.split('T')[0] === day.date
    );

    return attendanceForDay ? attendanceForDay.status.charAt(0).toUpperCase() + attendanceForDay.status.slice(1) : 'No Attendance';
  };

  const getAttendance = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwttoken'); 
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/faculty/get-attendance?courseId=${user.course}&collegeId=${user.collegeId}&start=${new Date().setDate(new Date().getDate() - 7)}&end=${new Date().setHours(23, 59, 59, 999)}&range=Daily`;
      const response = await fetch(url, {
         headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json', 
                },
      });

      if (!response.ok) {
        throw new Error('Something Went Wrong');
      }

      const data = await response.json();
      setAttendanceData(data);

      let chart = [];
      data.map(item => {
        chart.push({
          date: new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'long', // Full month name
            day: 'numeric' // Day of the month
          }),
          absent: item.absent.length,
          present: item.present.length,
          presentPercentage: item.presentPercentage,
        })
      })
      setChartData(chart.reverse())

    } catch (error) {
      toast.error('Something went wrong, try later!');
    } finally {
      setIsLoading(false);
    }
  }

  const getStudentsData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwttoken'); 
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/parent/get-students?id=${user._id}`;
      const response = await fetch(url, {
         headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json', 
                },
      });

      if (!response.ok) {
        throw new Error('Something Went Wrong');
      }

      const data = await response.json();
      setStudents(data);

    } catch (error) {
      toast.error('Something went wrong, try later!');
    } finally {
      setIsLoading(false);
    }
  }
  const getStdAttendance = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwttoken'); 
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/get-student-attendance?start=${addDays(new Date(), -6).getTime()}&end=${new Date().getTime()}&stdId=${selectedStudent}`;
      const response = await fetch(url, {
         headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json', 
                },
      });

      if (!response.ok) {
        throw new Error('Something Went Wrong');
      }

      const data = await response.json();

      setStdAttendance(data);

    } catch (error) {
      toast.error('Something went wrong, try later!');
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    window.scrollTo(0, 0);
    if (user.role === "Parent" && user.students.length > 0 && !selectedStudent) {
      setSelectedStudent(user.students[0]);  // Setting the first student's ID as default
    }
    if (user.role !== "Parent") {
      getAttendance();
    } else {
      if (!students.length > 0) {
        getStudentsData();
      }
      if (selectedStudent) {
        getStdAttendance();
      }
    }
  }, [selectedStudent]);
  

  const renderPresentToday = () => {
    if (!attendanceData || attendanceData.length === 0) {
      return "No Data To Show";
    }

    const presentCount = attendanceData[0]?.present?.length || 0;
    return (
      <>
        {presentCount} /
        <span className="text-md">
          {attendanceData[0]?.present?.length + attendanceData[0]?.absent?.length}
        </span>
      </>
    );
  };

  const getGrowthRate = () => {
    if (!attendanceData || attendanceData.length < 2) {
      return "0";
    }

    let totalGrowth = 0;
    for (let i = 1; i < attendanceData.length; i++) {
      const previousPercentage = attendanceData[i - 1].presentPercentage;
      const currentPercentage = attendanceData[i].presentPercentage;
      totalGrowth += previousPercentage - currentPercentage;
    }

    // Calculate the average growth rate
    const averageGrowthRate = totalGrowth / (attendanceData.length - 1);
    return averageGrowthRate.toFixed(2);
  }

  const getPresentAvg = () => {
    if (!attendanceData || attendanceData.length === 0) {
      return "0";
    }
    const sum = attendanceData.reduce((acc, state) => { return acc + state.presentPercentage }, 0)
    const avg = sum / (attendanceData.length)
    return avg.toFixed(2)
  }

  const getPresentCount = (data) => {
    let presentCount = 0
    data.forEach(element => {
      if (element.status === "present")
        presentCount++
    });
    return presentCount
  }


  const groupAbsencesByReason = (stdAttendance) => {
    const absenceCount = {};

    stdAttendance.forEach((student) => {
      const reason = student.reason || 'Uninformed absence';
      if (absenceCount[reason]) {
        absenceCount[reason]++;
      } else {
        absenceCount[reason] = 1;
      }
    });

    return absenceCount;
  };


  const preparePieData = (stdAttendance) => {
    const totalPresentPercentage = (getPresentCount(stdAttendance) / stdAttendance.length) * 100;

    // Calculate the absent percentage
    const absentPercentage = 100 - totalPresentPercentage;

    // Get the absence count from the attendance data
    const absenceCount = groupAbsencesByReason(stdAttendance);

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

  return (
    (isLoading) ?
      <div className="h-[90vh] flex justify-center items-center w-full">
        <MoonLoader size={20} color="gray" />
      </div>
      :
      <>
        <h1 className="text-2xl font-semibold mb-2 mt-8">{user.name}'s Dashboard</h1>
        <p className="text-sm max-w-[700px] mb-8">Here you can track and monitor student attendance, growth trends, and performance across the last few days. This dashboard provides an overview of key metrics and insights to help you optimize your teaching strategies.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                {`Total ${user.role === "Parent" ? `Days Present` : `Present Students`}`}
              </CardTitle>
              <Users2 className='h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold -mt-2.5 pb-1.5"> {user.role === "Parent" ? `${getPresentCount(stdAttendance)} / ${stdAttendance?.length}` : renderPresentToday()}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.role !== "Parent" ?
                  attendanceData?.length > 0 ? getAttendanceMessage(attendanceData[0].presentPercentage) : "Not enough data"
                  :
                  "You kid's attendance"
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Present Percentage
              </CardTitle>
              <LucidePercentDiamond className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            {user.role !== "Parent" && <CardContent>
              <div className="text-2xl font-bold -mt-2.5 pb-1.5">
                {attendanceData?.length > 0 ? attendanceData[0].presentPercentage : "0"} %
              </div>
              <p className="text-xs text-muted-foreground">
                {attendanceData?.length > 0 ? getAvgPercentMessage(attendanceData[0].presentPercentage) : "Not enough data"}
              </p>
            </CardContent>}

            {user.role === "Parent" && <CardContent>
              <div className="text-2xl font-bold -mt-2.5 pb-1.5">
                {((getPresentCount(stdAttendance) / stdAttendance.length) * 100).toFixed(2)} %
              </div>
              <Progress value={(getPresentCount(stdAttendance) / stdAttendance.length) * 100} className='h-2.5' />
            </CardContent>}

          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">{user.role !== "Parent" ? `Avg. Percent (last ${attendanceData?.length} days)` : `Recommendation`}</CardTitle>
              <LucideChartNoAxesColumn className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {user.role !== "Parent" && <div className="text-2xl font-bold -mt-2.5 pb-1.5">
                {getPresentAvg()} %
              </div>}
              <p className={`text-xs ${user.role === "Parent" && "-mt-3"} text-muted-foreground`}>
                {user.role !== "Parent" ? getAvgPercentMessage(getPresentAvg()) : getStudentRecentAttendanceMessage((getPresentCount(stdAttendance) / stdAttendance.length) * 100)}</p>
            </CardContent>
          </Card>

          <Card className={user.role === "Parent" ? "gap-4":"gap-3"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">{user.role !== "Parent" ? "Avg. Growth Rate" : "Your Children"}</CardTitle>
              {user.role !== "Parent" && (getGrowthRate() > 0 ?
                (<TrendingUp color="green" className="h-4 w-4 text-muted-foreground" />)
                : (getGrowthRate() == 0 ?
                  <AlertOctagonIcon className="h-4 w-4 text-muted-foreground" /> :
                  <TrendingDown color="red" className="h-4 w-4 text-muted-foreground" />))
              }
              {user.role === "Parent" &&
                <UserCircle className="h-4 w-4 text-muted-foreground" />
              }
            </CardHeader>
            {user.role !== "Parent" && <CardContent>
              <div className="text-2xl font-bold pb-1.5"> {getGrowthRate()} %</div>
              <p className="text-xs text-muted-foreground">
                {attendanceData?.length > 0 ? getAvgGrowthRateMessage(getGrowthRate()) : "Not enough data"}
              </p>
            </CardContent>}
            {user.role === "Parent" && <CardContent>
              <Select defaultValue={selectedStudent} value={selectedStudent}
                onValueChange={(value) => setSelectedStudent(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {students?.length > 0 && students.map(student => {
                    return <SelectItem key={student._id} value={student._id} className='cursor-pointer'>
                      <img src={student.imageUrl} alt="" className="w-[20px] h-[20px] object-cover rounded-full" />
                      <span className="text-xs"> {student.name} - {student.rollNo}</span>
                    </SelectItem>
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1.5">
                Select your child here to see stats
              </p>
            </CardContent>}
          </Card>
        </div>
        {user.role !== "Parent" && <Card>
          <CardHeader>
            <CardTitle>Attendance Ranges Since Last {attendanceData?.length} Days</CardTitle>
            <CardDescription>
              Displaying the attendance ranges across the last few days. This provides insight into attendance variability over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              {chartData?.length > 0 ?
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-md">
                              <p className="font-medium">{label}</p>
                              {payload.map((item) => (
                                <p key={item.name} className="text-sm">
                                  {item.name}: {item.value}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }} />

                    <Bar dataKey="absent" fill="#64748b" name="Absent Students" />
                    <Bar dataKey="present" fill="#475569" name="Present Students" />
                  </BarChart>
                </ResponsiveContainer>
                :
                <div className="flex flex-col gap-2 items-center justify-center align-middle h-full">
                  <FileWarning color="grey" />
                  <p className="text-xs text-muted-foreground">
                    Not Enough Data To Prepare Chart
                  </p>
                </div>
              }
            </div>
          </CardContent>
        </Card>}
        {user.role === "Parent" &&
          <div className="flex gap-4 mt-5 mb-3 relative">
            <div className="w-[63%]  bg-card p-4 rounded-sm border">
              <h3 className="text-sm font-medium">Breakdown</h3>
              <div>
                <PieStatsChart data={preparePieData(stdAttendance)} />
              </div>
            </div>
            <div className="w-[37%]  p-4 rounded-sm border space-y-1.5">
              <div className="bg-card p-4 rounded-sm border space-y-1.5">
                <h3 className="text-sm font-medium">WeekDay Analysis</h3>
                <p className="text-xs text-muted-foreground my-1.5 pb-3.5">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum sed mollitia repellat expedita quisquam veritatis?
                </p>
                {last7Days.map((day, index) => {
                  const status = getAttendanceStatus(day)
                  return <div key={index}>
                    {index !== 0 &&
                      < hr />
                    }
                    <div className={`flex justify-between items-center py-1 px-2 ${status === "No Attendance" && "opacity-50"}`}>
                      <span className="text-xs">{day.day}</span>
                      <span className={`text-xs ${status !== "No Attendance" && (status === "Present" ? "text-green-600 font-semibold" : "text-red-600  font-semibold")}`}>{status}</span>
                    </div>
                  </div>
                }
                )}
              </div>
            </div>
          </div>
        }
        {/* <div>
          <h2>Current User Data:</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div> */}
      </>



  )
}

export default Dashboard
