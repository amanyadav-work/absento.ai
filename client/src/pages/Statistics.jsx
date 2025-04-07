import { useEffect, useState } from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon, ChartArea, FileWarning, LucideUsers, SparklesIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSelector } from "react-redux"
import AttendanceStats from "@/components/AttendanceStats"
import { MoonLoader } from "react-spinners"
import { toast } from "sonner"
import GrowthRateStats from "@/components/GrowthRateStats"
import AiPredictions from "@/components/AiPredictions"

const Statistics = () => {
  const user = useSelector((state) => state.user.user);
  const [totalStudents, setTotalStudents] = useState(null)
  const [activeTab, setActiveTab] = useState("Attendance")
  const [activePeriod, setActivePeriod] = useState("Daily")
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [stdAttendance, setStdAttendance] = useState([])
  const [attendanceData, setAttendanceData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const getAttendance = async (stds) => {
    setIsLoading(true);
    let std;
    if (user.role === "Parent") {
      std = stds.find(i => i._id == selectedStudent)
    }

    try {
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/faculty/get-attendance?courseId=${user.course || std?.course?._id}&collegeId=${user.collegeId || std?.college?._id}&start=${date.from.getTime()}&end=${date.to.getTime()}&range=${activePeriod}`;
      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Something Went Wrong');
      }

      const data = await response.json();
      setAttendanceData(data);
      if (activePeriod === "Daily") {
        setTotalStudents(data[0]?.present?.length + data[0]?.absent?.length)
      }

    } catch (error) {
      toast.error('Something went wrong, try later!');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveDate = () => {
    if (date) {
      getAttendance(students)
      if (user.role === "Parent")
        getStdAttendance()
    }
  }


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab])


  const getStudentsData = async () => {
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/parent/get-students?id=${user._id}`;
      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Something Went Wrong');
      }

      const data = await response.json();
      setStudents(data);
      getAttendance(data)

    } catch (error) {
      toast.error('Something went wrong, try later!');
    } finally {
      setIsLoading(false);
    }
  }

  const getStdAttendance = async () => {
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/get-student-attendance?start=${date.from.getTime()}&end=${date.to.getTime()}&stdId=${selectedStudent}`;
      const response = await fetch(url, {
        credentials: 'include',
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
    if (user.role !== "Parent" && ((date && date.to && date.from) && ((activePeriod === "Monthly" && (date.to - date.from) / (1000 * 60 * 60 * 24) > 90) || (activePeriod === "Weekly" && (date.to - date.from) / (1000 * 60 * 60 * 24) > 14) || (activePeriod === "Daily" && (date.to - date.from) / (1000 * 60 * 60 * 24) < 31)))) {
      getAttendance()
    }
    if (user.role === "Parent" && user.students.length > 0 && !selectedStudent) {
      setSelectedStudent(user.students[0]);
    }
    if (user.role === "Parent") {
      if (!students.length > 0) {
        getStudentsData();
      } else {
        getAttendance(students)
      }
      if (selectedStudent) {
        getStdAttendance();
      }
    }
  }, [activePeriod, selectedStudent])

  return (
    (isLoading) ?
      <div className="h-[90vh] flex justify-center items-center w-full">
        <MoonLoader size={20} color="gray" />
      </div>
      :
      <>
        <div className="flex mt-8 relativ">
          <div className="w-[25%] h-fit sticky top-[50px] border-r p-4 pl-0 space-y-3">
            <span className="block text-md font-semibold mb-5 border-b  w-fit">Your Class Stats</span>
            <div onClick={() => setActiveTab("Attendance")} className={`border ${activeTab === "Attendance" ? "bg-foreground text-background" : "bg-muted"}  flex items-center gap-5 p-3.5 rounded-sm cursor-pointer`}>
              <LucideUsers className={`${activeTab === "Attendance" ? "border-2 border-background" : "border"} p-3 rounded-full `} size={45} />
              <div>
                <h2 className={`text-sm ${activeTab === "Attendance" && "font-medium"} `}>Attendances</h2>
                <p className={`text-xs ${activeTab === "Attendance" && "font-medium"} `}>Track engagement over time.
                </p>
              </div>
            </div>
            {user.role !== "Parent" && <div onClick={() => setActiveTab("Growth Rate")} className={`border ${activeTab === "Growth Rate" ? "bg-foreground text-background" : "bg-muted"}  flex items-center gap-5 p-3.5 rounded-sm cursor-pointer`}>
              <ChartArea className={`${activeTab === "Growth Rate" ? "border-2 border-background" : "border"} p-3 rounded-full `} size={45} />
              <div>
                <h2 className={`text-sm ${activeTab === "Growth Rate" && "font-medium"} `}>Growth Chart</h2>
                <p className={`text-xs ${activeTab === "Growth Rate" && "font-medium"} `}>Analyze student growth trends.</p>
              </div>
            </div>}
            <div onClick={() => setActiveTab("Predictions")} className={`border ${activeTab === "Predictions" ? "bg-foreground text-background" : "bg-muted"}  flex items-center gap-5 p-3.5 rounded-sm cursor-pointer`}>
              <SparklesIcon className={`${activeTab === "Predictions" ? "border-2 border-background" : "border"} p-3 rounded-full `} size={45} />
              <div>
                <h2 className={`text-sm ${activeTab === "Predictions" && "font-medium"} `}>Ai Predictions</h2>
                <p className={`text-xs ${activeTab === "Predictions" && "font-medium"} `}>Predictions based on trends.</p>
              </div>
            </div>


          </div>
          <div className="w-[75%] p-4 pl-8 pr-0">
            <div className="flex items-center justify-between">
              <span className="block text-md font-semibold mb-2 border-b  w-fit">{activeTab} Stats</span>
              {activeTab !== "Predictions" && <div className="flex w-fit gap-3 items-center">
                {user.role === "Parent" ?
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
                  : <>
                    <Button onClick={() => setActivePeriod("Daily")} variant={activePeriod === "Daily" ? "destructive" : "outline"}>Daily</Button>
                    <Button onClick={() => setActivePeriod("Weekly")} variant={activePeriod === "Weekly" ? "destructive" : "outline"}>Weekly</Button>
                    <Button onClick={() => setActivePeriod("Monthly")} variant={activePeriod === "Monthly" ? "destructive" : "outline"}>Monthly</Button>
                  </>
                }
                |
                <div className={cn("grid gap-2")}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-[300px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                      <Button className='w-full m-2' onClick={handleSaveDate}>Save Date</Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>}
            </div>
            {(activeTab === "Attendance" && !isLoading) && (((user.role !== "Parent" && attendanceData) || (user.role === "Parent" && attendanceData && stdAttendance.length > 0)) ?
              <AttendanceStats attendanceData={attendanceData} activePeriod={activePeriod} date={date} totalStudents={totalStudents} stdAttendance={stdAttendance} selectedStudent={selectedStudent} />
              : <div className="flex flex-col gap-2 items-center justify-center align-middle h-full">
                    <FileWarning color="grey" />
                    <p className="text-xs text-muted-foreground">
                        Not Enough Data To Prepare Chart
                    </p>
                </div>)
            }
            
            {(activeTab === "Growth Rate" && attendanceData && !isLoading) &&

              <GrowthRateStats attendanceData={attendanceData} date={date} activePeriod={activePeriod} />
            }
            {activeTab === "Predictions" &&
              <AiPredictions attendanceData={attendanceData} />
            }
          </div>

        </div>

      </>
  )
}

export default Statistics
