import { FileWarning, NotepadTextDashedIcon, User } from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { Label } from "recharts"
import { Button } from "./ui/button"
import { addDays } from "date-fns"
import { MoonLoader } from "react-spinners"
import { toast } from "sonner"
import AttendancePrediction from "./predict"
import { useSelector } from "react-redux"


const AiPredictions = ({ attendanceData }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [students, setStudents] = useState([])
    const [search, setSearch] = useState([])
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [stdAttendance, setStdAttendance] = useState([])
    const user = useSelector((state) => state.user.user);

    const getStdAttendance = async () => {
        setIsLoading(true);
        try {
            const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/get-student-attendance?start=${addDays(new Date(), -90).getTime()}&end=${new Date().getTime()}&stdId=${selectedStudent}`;
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

    const getAllStudents = async (data) => {
        setIsLoading(true)
        if (user.role === "Parent") {
            try {
                const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/parent/get-students?id=${user._id}`;
                const response = await fetch(url, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Something Went Wrong');
                }

                const data = await response.json();
                setStudents(data)

            } catch (error) {
                toast.error('Something went wrong, try later!');
            }
        } else {
            // Get the absent and present arrays from the provided object
            const absentStudents = data[0].absent;
            const presentStudents = data[0].present;

            // Combine the two arrays into one
            const allStudents = [...absentStudents, ...presentStudents];

            // Use a Map to remove duplicates based on rollNo
            const uniqueStudentsMap = new Map();

            allStudents.forEach(student => {
                // If the rollNo doesn't exist in the Map, add the student to the Map
                if (!uniqueStudentsMap.has(student.rollNo)) {
                    uniqueStudentsMap.set(student.rollNo, student);
                }
            });
            // Convert the Map back to an array
            const uniqueStudents = Array.from(uniqueStudentsMap.values());
            setStudents(uniqueStudents)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        getAllStudents(attendanceData)
    }, [])





    return (
        (isLoading) ?
            <div className="h-[90vh] flex justify-center items-center w-full">
                <MoonLoader size={20} color="gray" />
            </div>
            : (students?.length>0) ?
                <>
                    <div className="border bg-muted p-5 my-3">
                        <div className="flex gap-2.5 items-center">
                            <NotepadTextDashedIcon size={35} className="rounded-full border p-2 " />
                            <div className="w-[60%]">
                                <p className="text-xs">Here you can analyze student-specific data and see potential outcomes based on their past attendance patterns.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-5 mb-3 relative">
                        <div className="w-[63%] bg-card p-4 rounded-sm border">
                            <h3 className="text-xs text-muted-foreground pb-2.5">Predictions</h3>
                            {(stdAttendance?.length === 0) ?
                                <div className="flex flex-col gap-2 items-center justify-center align-middle h-full">
                                    <User color="grey" />
                                    <p className="text-xs text-muted-foreground">
                                        Please Select a Student
                                    </p>
                                </div>
                                : (stdAttendance?.length < 60) ?
                                    <div className="flex flex-col gap-2 items-center justify-center align-middle h-full">
                                        <FileWarning color="grey" />
                                        <p className="text-xs text-muted-foreground">
                                            Not Enough Data To Prepare Chart
                                        </p>
                                    </div>
                                    :
                                    <div>
                                        <AttendancePrediction stdAttendance={stdAttendance} selectedStudent={selectedStudent} />
                                    </div>
                            }
                        </div>
                        <div className="w-[37%] h-fit sticky top-[10%]">
                            <div className="bg-card p-4 rounded-sm border">
                                <h3 className="text-xs text-muted-foreground pb-2.5">Select a student</h3>
                                <div className="grid w-full items-center gap-1.5 mb-4">
                                    <Label htmlFor='search'>Search Student</Label>
                                    <Input type="text" id='search' placeholder='🔍︎  Search Student' value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                                <div className="h-[200px] overflow-y-scroll space-y-2.5">
                                    {students.length > 0 && students.filter(std => {
                                        if (search && typeof search === 'string' && search !== '') {
                                            const name = std.name.toLowerCase();
                                            const rollNo = std.rollNo.toLowerCase();
                                            return name.includes(search.toLowerCase()) || rollNo.includes(search.toLowerCase());
                                        }
                                        return true; // Return true to not filter out anything if no search term is provided
                                    }).map(std => {
                                        return <div onClick={() => setSelectedStudent(std._id)} key={std._id} className={`${selectedStudent === std._id && "bg-accent-foreground text-accent"} cursor-pointer flex items-center gap-2.5 text-xs border p-2 rounded-sm`}>
                                            <img src={std.imageUrl} alt={`Profile Pic of${std.name}`} className="w-[20px] h-[20px] object-cover rounded-full" />
                                            {std.name} - {std.rollNo}
                                        </div>
                                    })
                                    }
                                </div>
                                <Button disabled={!selectedStudent} onClick={getStdAttendance}>Get Predictions</Button>
                            </div>
                        </div>
                    </div>
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

export default AiPredictions
