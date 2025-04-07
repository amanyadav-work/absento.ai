
import Cam from "@/components/Cam"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { useVideo } from "@/hooks/VideoContext"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { MoonLoader } from "react-spinners"
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Phone } from "lucide-react"
import { useNavigate } from "react-router-dom"


const schema = z.object({
    reason: z.string().nonempty('Please select a course'),
    comment: z.string().optional(),
});



const Attendance = () => {

    const { control, register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(schema),
    });

    const { isVideoPlaying, setIsVideoPlaying } = useVideo();
    const [takeAttendance, setTakeAttendance] = useState(false)
    const [students, setStudents] = useState(null)
    const user = useSelector((state) => state.user.user);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false)
    const [stdId, setStdId] = useState(null)
    const [absentReasons, setAbsentReasons] = useState([])
    const [attendanceData, setAttendanceData] = useState({})
    const [dailogIsOpen, setdailogIsOpen] = useState(false)
    const navigate = useNavigate()

    if (user.role !== "Faculty") {
        navigate('/dashboard')
    }


    const getStudents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('jwttoken');
            const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/get-students?courseId=${user.course}&collegeId=${user.collegeId}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Unable to get students');
            }

            const data = await response.json();
            if (data.students) {
                setStudents(data.students);
            } else {
                toast.error('No students found.');
            }
        } catch (error) {
            toast.error('Something went wrong, try later!');
        } finally {
            setLoading(false);
        }
    };

    const getAttendance = async () => {
        try {
            setPageLoading(true);
            const token = localStorage.getItem('jwttoken');
            const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/faculty/get-attendance?courseId=${user.course}&collegeId=${user.collegeId}&start=${new Date().setHours(0, 0, 0, 0)}&end=${new Date().setHours(23, 59, 59, 999)}`;

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
            setAttendanceData({ ...data[0] });



        } catch (error) {
            console.error('Something went wrong, try later!');
        } finally {
            setPageLoading(false);
        }
    }

    const attendanceDone = async () => {
        setTakeAttendance(false)
        setIsVideoPlaying(false)
        await getAttendance()
    }


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [takeAttendance])

    useEffect(() => {
        if (!isVideoPlaying) {
            getAttendance()
        }
    }, [])


    const onSubmit = (data) => {
        setdailogIsOpen(false)
        if (!stdId) return toast.warning("Please select a student")
        const studentObj = students.find(student => student._id === stdId);
        const formData = {
            studentId: stdId,
            reason: data.reason === "Other" ? data.comment : data.reason,
            studentName: studentObj.name,
            studentImgUrl: studentObj.imageUrl,
        }
        let arr = absentReasons.filter(student => student.studentId !== stdId)
        setAbsentReasons([...arr, formData])
        setStdId(null)
    };

    let other = watch('reason')


    return (<>


        {pageLoading ?
            <div className="h-[90vh] flex justify-center items-center w-full">
                <MoonLoader size={20} color="grey" />
            </div>
            : <>

                {(attendanceData && Object.keys(attendanceData)?.length !== 0) &&
                    <>   <h1 className="text-2xl font-semibold mb-2 mt-8">Attendance Taken -  <span className="text-sm border py-2 px-3 rounded-xs"> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></h1>
                        <p className="text-sm max-w-[700px] mb-8">
                            The system will detect students for 15 minutes. Those recognized will be marked as present, while those not detected will be marked absent. Please read the below points carefully.
                        </p>
                        <h2 className="text-md font-semibold py-4">All Present Students</h2>
                        {attendanceData && attendanceData.present?.length > 0 ?
                            <Table key={JSON.stringify(attendanceData)}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[10%]">Sr no.</TableHead>
                                        <TableHead className="w-[15%]">Roll No</TableHead>
                                        <TableHead className="w-[15%]">Photo</TableHead>
                                        <TableHead className="w-[35%]">Name</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead className="text-right">Parent Number</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendanceData && attendanceData.present.map((std, idx) => {
                                        return <TableRow key={std.rollNo}>
                                            <TableCell className="font-medium">{idx + 1}</TableCell>
                                            <TableCell className="font-medium">{std.rollNo}</TableCell>
                                            <TableCell><img className="rounded-full h-[40px] object-cover" width={40} src={std.imageUrl} /></TableCell>
                                            <TableCell>{std.name}</TableCell>
                                            <TableCell>{std.age}</TableCell>
                                            <TableCell onClick={() => window.location.href = `tel:${std.parentPhone}`}
                                                className="text-right cursor-pointer flex justify-end gap-2 items-center h-[60px]"><Phone size={13} /> <span className="hover:border-b border-gray-500">
                                                    {std.parentPhone}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    })}
                                </TableBody>
                            </Table>
                            :
                            <div className="h-[20vh] text-xs border flex items-center justify-center">
                                No Students Were Present Today!
                            </div>}
                        <h2 className="text-md font-semibold pt-8 pb-4">All Absent Students</h2>
                        {attendanceData && attendanceData.absent?.length > 0 ?
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[10%]">Sr no.</TableHead>
                                        <TableHead className="w-[15%]">Roll No</TableHead>
                                        <TableHead className="w-[15%]">Photo</TableHead>
                                        <TableHead className="w-[35%]">Name</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead className="text-right">Parent Number</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendanceData && attendanceData.absent.map((std, idx) => {
                                        return <TableRow key={std.rollNo}>
                                            <TableCell className="font-medium">{idx + 1}</TableCell>
                                            <TableCell className="font-medium">{std.rollNo}</TableCell>
                                            <TableCell><img className="rounded-full h-[40px] object-cover" width={40} src={std.imageUrl} /></TableCell>
                                            <TableCell >{std.name}</TableCell>
                                            <TableCell>{std.age}</TableCell>
                                            <TableCell onClick={() => window.location.href = `tel:${std.parentPhone}`}
                                                className="text-right cursor-pointer flex justify-end gap-2 items-center h-[60px]"><Phone size={13} /> <span className="hover:border-b border-gray-500">
                                                    {std.parentPhone}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    })}
                                </TableBody>
                            </Table>
                            :
                            <div className="h-[20vh] text-xs border flex items-center justify-center">
                                No Students Were Absent Today!
                            </div>}
                    </>
                }

                {(!isVideoPlaying && attendanceData && Object.keys(attendanceData)?.length === 0) && <div className="">
                    <h1 className="text-2xl font-semibold mb-2 mt-8">{takeAttendance ? "Taking" : "Start"} Attendance</h1>
                    {!takeAttendance && <p className="text-sm max-w-[700px] mb-8">
                        The system will detect students for 15 minutes. Those recognized will be marked as present, while those not detected will be marked absent. Please read the below points carefully.
                    </p>}

                    {!takeAttendance && <Card>
                        <CardHeader>
                            <CardTitle>Few points to consider:</CardTitle>
                            <CardDescription></CardDescription>
                        </CardHeader>
                        <CardContent className='text-sm -mt-1 grid grid-cols-3 gap-2'>
                            <div className="border p-5 rounded-sm relative">
                                <span className="absolute rounded-full border w-[30px] h-[30px] flex items-center justify-center top-0 left-0 -translate-y-[40%] bg-accent-foreground text-accent">1</span>
                                <strong>Ensure a clear camera view:</strong> The system requires a clear view of the students' faces to accurately register attendance. Make sure the camera is positioned to capture everyone in the room.
                            </div>
                            <div className="border p-5 rounded-sm relative">
                                <span className="absolute rounded-full border w-[30px] h-[30px] flex items-center justify-center top-0 left-0 -translate-y-[40%] bg-accent-foreground text-accent">2</span>
                                <strong>Lighting conditions:</strong> Adequate lighting is essential for the face detection system to work effectively. Try to avoid overly bright or dim lighting.
                            </div>
                            <div className="border p-5 rounded-sm relative">
                                <span className="absolute rounded-full border w-[30px] h-[30px] flex items-center justify-center top-0 left-0 -translate-y-[40%] bg-accent-foreground text-accent">3</span>
                                <strong>Wait 15 minutes:</strong> After starting the camera, the system will take attendance automatically for entire 15 minutes. After this, the system will automatically mark the attendance.
                            </div>
                            <div className="border p-5 rounded-sm relative">
                                <span className="absolute rounded-full border w-[30px] h-[30px] flex items-center justify-center top-0 left-0 -translate-y-[40%] bg-accent-foreground text-accent">4</span>
                                <strong>Check the system's readiness:</strong> Ensure that the system is functioning properly and the camera is working correctly before initiating the attendance process.
                            </div>
                            <div className="border p-5 rounded-sm relative">
                                <span className="absolute rounded-full border w-[30px] h-[30px] flex items-center justify-center top-0 left-0 -translate-y-[40%] bg-accent-foreground text-accent">5</span>
                                <strong>Privacy concerns:</strong> This system uses facial recognition, so it's important to ensure that all students are aware and have consented to the use of this technology for attendance tracking.
                            </div>
                            <div className="border p-5 rounded-sm relative">
                                <span className="absolute rounded-full border w-[30px] h-[30px] flex items-center justify-center top-0 left-0 -translate-y-[40%] bg-accent-foreground text-accent">6</span>
                                <strong>System Maintenance:</strong> Ensure that the system is updated and properly maintained to prevent any issues during the attendance process. Regular checks will keep the system running smoothly.
                            </div>

                        </CardContent>

                        <CardFooter>
                            <Button className='w-full' onClick={() => setTakeAttendance(true)}>Start Attendance</Button>
                        </CardFooter>
                    </Card>}

                    {!takeAttendance && <>
                        <div className="flex justify-between items-center mb-3 mt-14">
                            <h2 className="text-md font-semibold ">{absentReasons?.length > 0 ? "Students with" : "Specify"} Absent Reasons</h2>

                            <Dialog open={dailogIsOpen} onOpenChange={setdailogIsOpen}>
                                <DialogTrigger asChild>
                                    <Button variant='outline' onClick={() => { !students && getStudents() }}>Add reasons</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        {loading ? <div className="min-h-[50vh] flex justify-center items-center w-full">
                                            <DialogTitle></DialogTitle>
                                            <DialogDescription></DialogDescription>
                                            <MoonLoader size={20} color='gray' />
                                        </div>
                                            : students?.length > 0 ? <>
                                                <DialogTitle></DialogTitle>
                                                <DialogDescription asChild>
                                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0.5 ">
                                                        {/* Select Student */}
                                                        <div className="flex flex-col space-y-2">
                                                            <Label htmlFor="student">Select Student</Label>

                                                            <Select value={stdId}
                                                                onValueChange={(value) => setStdId(value)} >
                                                                <SelectTrigger className="w-full" >
                                                                    {!stdId && "Select Student"}
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="max-h-[400px] overflow-y-scroll">
                                                                    <SelectGroup placeholder="Select Student">
                                                                        {students.map((student) => (
                                                                            <SelectItem key={student._id} value={student._id} className='cursor-pointer'>
                                                                                <img src={student.imageUrl} alt="" className="w-[20px] h-[20px] object-cover rounded-full" />
                                                                                {student.name} - {student.rollNo}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>



                                                        </div>

                                                        {/* Reason Type */}
                                                        <div className="flex flex-col space-y-1.5">
                                                            <p className="text-foreground py-1">Select Reason Type</p>
                                                            <Controller
                                                                name="reason"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <RadioGroup
                                                                        onValueChange={field.onChange}
                                                                        {...field}
                                                                        className="pb-2 flex gap-2"
                                                                    >
                                                                        <div className="flex items-center space-x-2">
                                                                            <RadioGroupItem value="Sick Leave" id="Sick Leave" />
                                                                            <Label htmlFor="Sick Leave">Sick Leave</Label>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <RadioGroupItem value="Family Emergency" id="Family Emergency" />
                                                                            <Label htmlFor="Family Emergency">Family Emergency</Label>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <RadioGroupItem value="Medical Appointment" id="Medical Appointment" />
                                                                            <Label htmlFor="Medical Appointment">Medical Appointment</Label>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <RadioGroupItem value="Other" id="Other" />
                                                                            <Label htmlFor="Other">Other</Label>
                                                                        </div>
                                                                    </RadioGroup>
                                                                )}
                                                            />
                                                            {errors.reason && <p className="text-red-500">{errors.reason.message}</p>}
                                                        </div>

                                                        {/* Textarea for Comment (only visible if 'Other' is selected) */}
                                                        {other === "Other" && (
                                                            <div className="flex flex-col space-y-1.5 py-2">
                                                                <Label htmlFor="comment">Add a Comment</Label>
                                                                <Textarea {...register('comment')} placeholder="Add a comment..." />
                                                                {errors.comment && <p className="text-red-500">{errors.comment.message}</p>}
                                                            </div>
                                                        )}

                                                        {/* <DialogClose asChild> */}
                                                        <Button data-slot="dialog-close" type="submit" className="w-full mt-2">
                                                            Save Reason
                                                        </Button>
                                                        {/* </DialogClose> */}
                                                    </form>
                                                </DialogDescription>
                                            </>
                                                : <p>No Students Found In Class</p>
                                        }
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </div>
                        {absentReasons?.length > 0 ?
                            <div className="grid grid-cols-4">
                                {absentReasons.map((reason, idx) => {
                                    return <div key={idx} className="border p-5">
                                        <div className="flex gap-2 items-center pb-2">
                                            <img className="w-[20px] h-[20px] object-cover rounded-full" src={reason.studentImgUrl} alt={reason.studentName} />
                                            <p>{reason.studentName}</p>
                                        </div>
                                        <hr />
                                        <p className="text-xs pt-2">Reason: {reason.reason}</p>
                                    </div>
                                })

                                }
                            </div>
                            :
                            <div className="h-[20vh] text-xs border flex items-center justify-center">
                                No Reasons Added Yet
                            </div>
                        }
                    </>}


                    {(takeAttendance && !isVideoPlaying) &&
                        <Cam absentReasons={absentReasons} attendanceDone={attendanceDone} />
                    }

                </div >}


                {
                    isVideoPlaying &&
                    <>
                        <h1 className="text-2xl font-semibold mb-2 mt-8">Taking Attendance</h1>
                        <div className="min-h-[70vh] gap-4 flex justify-center items-center w-full">
                            <MoonLoader size={20} color='gray' />
                            <p>Attendance Ongoing...</p>
                        </div>

                    </>
                }
            </>}


    </>
    )
}

export default Attendance
