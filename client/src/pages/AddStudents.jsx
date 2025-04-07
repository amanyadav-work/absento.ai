import { useNavigate } from "react-router-dom";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as faceapi from 'face-api.js';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import FormInputs from "@/components/FormInputs";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setUser } from "@/redux/reducers/userReducer";
import { MoonLoader, SyncLoader } from "react-spinners";

const studentSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    age: z.string().min(1, 'Age is required'),
    rollNo: z.string().min(1, 'Roll number is required').max(100, 'Roll number is too long'),
    picture: z
        .instanceof(FileList)
        .refine((files) => files.length === 0 || files.length === 1, {
            message: 'You must upload exactly one image.',
        })
        .refine((files) => {
            return files.length === 0 || files[0].type.startsWith('image/');
        }, {
            message: 'Please upload a valid image file.',
        })
        .refine((files) => files.length > 0, {
            message: 'Photo is required',
        }),
    collegeID: z.string().min(1, 'College ID is required'),
    course: z.string().min(1, 'Please Select Course Name'),
});


const AddStudents = () => {
    const [courses, setCourses] = useState([])
    const [image, setImage] = useState(null);
    const [faceDescriptor, setFaceDescriptor] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [clgData, setClgData] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const user = useSelector((state) => state.user.user);
    const {
        register: studentRegister,
        handleSubmit: handleStudentSubmit,
        formState: { errors: studentErrors },
        getValues: getStudentValues,
        setValue: setStudentValues,
        control: studentControl,
    } = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            course: courses.length > 0 ? courses[0]._id : '',
        },
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const loadModels = async () => {
            try {
                const modelUrl = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights";
                await faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl);
                await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
                await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
            } catch (err) {
                console.error("Error loading face-api.js models:", err.message);
            }
        };

        loadModels();
    }, [])

    const getCourses = async (clg_id) => {
        setCourses([])

        setIsLoading(true)
        const collegeId = user.collegeId || clg_id;

        try {
            const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/getcourses?collegeId=${encodeURIComponent(collegeId)}`;
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const courseData = await response.json();
            if (user.role !== 'Admin') {
                setClgData(courseData)
                setCourses(courseData.courses)

            } else {
                setCourses(courseData)
            }
        } catch (error) {
            toast.error(error.message);
        }
        setIsLoading(false)
    };

    const handleFileChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const onStudentSubmit = async (data) => {
        if (faceDescriptor) {
            const formData = new FormData();
            formData.append('name', data.name); // College name
            formData.append('age', data.age);
            formData.append('rollNo', data.rollNo);
            formData.append('picture', data.picture[0]);
            formData.append('collegeID', data.collegeID);
            formData.append('course', data.course);
            formData.append('faceDescriptor', JSON.stringify(faceDescriptor));

            try {
                const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/parent/add-student`;
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Unable to add student');
                }
                const data = await response.json();
                dispatch(setUser({
                    ...user,
                    students: [...user.students, data.studentId]
                }));
                toast.success(data.message);
                navigate('/dashboard')
            } catch (error) {
                toast.error(error.message);
            }
        } else {
            toast.error('Please choose a clear picture')
        }
    };

    const getFaceDescriptor = async () => {
        if (!image) {
            toast.error('Please choose a image');
            return;
        }

        setIsProcessing(true);
        try {
            // Load image and detect face descriptor
            const img = await faceapi.fetchImage(image);

            // Resize the image to fit the model's expectations
            const displaySize = { width: 640, height: 480 }; // Set the dimensions you need
            const detections = await faceapi.detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detections) {
                const faceDescriptor = detections.descriptor;

                // Convert faceDescriptor to a plain array before sending it to the backend
                const faceDescriptorArray = Array.from(faceDescriptor);
                setFaceDescriptor(faceDescriptorArray);
                toast.success('Face Detection successful!');
            } else {
                toast.error('No face detected in the image');
                setImage(null)
                setStudentValues("picture", null)
            }
        } catch (error) {
            console.error('Error during detection:', error);
            toast.error('Error during registration');
            setImage(null)
        }
        setIsProcessing(false);
    };

    if (user.role === "Admin") {
        navigate('/dashboard')
    }

    return (<>

        {user?.role === "Parent" &&
            <>
                <h1 className="text-2xl font-semibold mb-2 mt-8">Add a student</h1>
                <p className="text-sm max-w-[700px] mb-8">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus aliquid in qui quis harum maiores earum libero tempore! Commodi distinctio corporis recusandae ab.</p>

                <form onSubmit={user?.role === "Admin" ? handleAdminSubmit(onAdminSubmit) : (user?.role === "Faculty" ? handleFacultySubmit(onFacultySubmit) : handleStudentSubmit(onStudentSubmit))}>
                    <div className="flex gap-4">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Student Details</CardTitle>
                                <CardDescription>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error hic possimus ea!</CardDescription>
                            </CardHeader>
                            <CardContent>

                                {user.role === "Parent" && <>
                                    <FormInputs
                                        fieldName="name"
                                        type="text"
                                        label="Student Name"
                                        placeholder="Eg. Subash Vishwakarma"
                                        register={studentRegister}
                                        error={studentErrors}
                                    />
                                    <div className="flex gap-2">

                                        <FormInputs
                                            fieldName="age"
                                            type="number"
                                            label="Student Age"
                                            placeholder="Eg. 20"
                                            register={studentRegister}
                                            error={studentErrors}
                                        />
                                        <FormInputs
                                            fieldName="rollNo"
                                            type="text"
                                            label="Student Roll No"
                                            placeholder="Eg. SYBCA 116"
                                            register={studentRegister}
                                            error={studentErrors}
                                        />
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <FormInputs
                                            fieldName="picture"
                                            type="file"
                                            label="Upload Face Picture"
                                            placeholder="Clear Photo of Face"
                                            register={studentRegister}
                                            error={studentErrors}
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <Button type="button" className='w-[100px]' disabled={isProcessing} onClick={getFaceDescriptor}>
                                            {isProcessing ? <MoonLoader size={12} /> : "  Detect Image"}
                                        </Button>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <FormInputs
                                            fieldName="collegeID"
                                            type="text"
                                            label="College ID"
                                            placeholder="College ID"
                                            register={studentRegister}
                                            error={studentErrors}
                                        />
                                        <Button type="button" className='w-[100px]' disabled={isLoading} onClick={() => getCourses(getStudentValues('collegeID'))}>
                                            {isLoading ? <MoonLoader size={12} /> : "Verify College"}
                                        </Button>
                                    </div>
                                </>}

                                <Button type="submit">Submit</Button>
                            </CardContent>
                        </Card>

                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Courses</CardTitle>
                                <CardDescription>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas exercitationem veritatis, adipisci doloribus maxime tempora odio autem at soluta iste?</CardDescription>
                            </CardHeader>

                            <CardContent>
                                {(!isLoading && courses && courses?.length > 0) ?
                                    <>
                                        <div className="w-full flex items-center border rounded-xs mb-2 p-3 gap-3">
                                            <img className="w-[30px] object-cover h-[30px] rounded-full" src={clgData.logoUrl} />
                                            <h2 className="w-full text-sm -mt-0.5">
                                                {clgData.name}
                                            </h2>
                                        </div>
                                        <Controller name='course' control={studentControl} render={({ field }) => (
                                            <RadioGroup onValueChange={field.onChange} {...field} className='grid grid-cols-3 gap-4 max-h-[200px] border p-3 rounded-sm overflow-y-scroll'>
                                                {courses?.map(course => {
                                                    return <div key={course._id} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={course._id} id={course._id}
                                                            {...studentRegister("course")}
                                                        />

                                                        <Label htmlFor={course._id}>{course.name}</Label>
                                                    </div>
                                                })}
                                            </RadioGroup>

                                        )} />
                                    </>
                                    :
                                    (courses?.length === 0 && !isLoading) ? <div className="flex justify-center items-center h-[300px] border p-3 rounded-sm">No Courses Found </div> :
                                        <div className="flex justify-center items-center h-[300px] border p-3 rounded-sm">

                                            <SyncLoader
                                                color='red'
                                                aria-label="Loading Spinner"
                                                data-testid="loader"
                                            />

                                        </div>
                                }

                                {studentErrors?.course && (
                                    <span className="text-xs text-red-500">{studentErrors.course.message}</span>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </>}

        {user?.role !== "Parent" && <>
            404 Not Found
        </>}
    </>)
}

export default AddStudents
