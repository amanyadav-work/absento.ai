import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MoonLoader } from "react-spinners";


const Students = () => {

    const user = useSelector((state) => state.user.user);

    const [students, setStudents] = useState(null)
    const [loading, setLoading] = useState(false);

    const getAllStudents = async () => {
        setLoading(true)
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

        setLoading(false)
    }


    const getStudents = async (id) => {
        try {
            setLoading(true);
            const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/get-students?courseId=${user.course}&collegeId=${user.collegeId}`;
            const response = await fetch(url, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Unable to get students');
            }

            const data = await response.json();
            // Check if students data is returned
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
    useEffect(() => {
        window.scrollTo(0, 0);
        if (user.role === "Admin") {
            getStudents(user.collegeId)
        } else if (user.role === "Faculty") {
            getStudents(user.course)
        } else {
            getAllStudents()
        }
    }, [])

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold mb-2 mt-8">{user.role === "Parent" ? "All Your Kids Here " : `All Students In Your ${user.role === "Admin" ? " College" : " Class"}`}</h1>
                    <p className="text-sm max-w-[700px] mb-8">Here is a list of all the students enrolled in your class or college, depending on your role. You can view details about each student and contact their parents if needed.</p>
                </div>
                {user.role === "Parent" && <Link to="/students/add"><Button><User /> Add a student</Button></Link>}
            </div>
            {loading ? <div className="min-h-[50vh] flex justify-center items-center w-full">
                <MoonLoader size={20} color='gray' />
            </div> :
                students?.length > 0 ?
                    <Table className='mt-6'>
                        <TableCaption className='text-xs'>A list of all your students.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Sr no.</TableHead>
                                <TableHead className={user.role !== "Parent" && "w-[100px]"}>Roll No</TableHead>
                                <TableHead>Photo</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Age</TableHead>
                                {user.role !== "Parent" && <>
                                    <TableHead>Parent Name</TableHead>
                                    <TableHead className="text-right">Parent Number</TableHead>
                                </>}
                                {user.role === "Parent" && <>
                                    <TableHead className='max-w-[100px]'>Course</TableHead>
                                    <TableHead className="text-right">College Name</TableHead>
                                </>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                students.map((student, idx) => {
                                    return <TableRow key={student._id}>
                                        <TableCell className="font-medium">{idx + 1}</TableCell>
                                        <TableCell className="font-medium">{student.rollNo}</TableCell>
                                        <TableCell><img className="rounded-full h-[40px] object-cover" width={40} src={student.imageUrl} /></TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.age}</TableCell>
                                        {user.role !== "Parent" &&
                                            <>
                                                <TableCell>{student.parent.name}</TableCell>
                                                <TableCell onClick={() => window.location.href = `tel:${student.parent.phone}`}
                                                    className="text-right cursor-pointer flex justify-end gap-2 items-center h-[60px]"><Phone size={13} /> <span className="hover:border-b border-gray-500">
                                                        {student.parent.phone}
                                                    </span>
                                                </TableCell>
                                            </>
                                        }
                                        {user.role === "Parent" && <>
                                            <TableCell className='max-w-[100px]'>{student.course.name}</TableCell>
                                            <TableCell className='text-right flex justify-end items-center'><img className="rounded-full h-[40px] object-cover pr-2" width={40} src={student.college.logoUrl} /> {student.college.name}</TableCell>
                                        </>
                                        }
                                    </TableRow>
                                })}
                        </TableBody>
                    </Table>
                    : <div className="min-h-[50vh] flex justify-center items-center w-full">
                        <p>No Students Found Yet.</p>
                    </div>
            }

        </>
    )
}

export default Students
