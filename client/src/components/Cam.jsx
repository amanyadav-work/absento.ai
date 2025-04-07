import * as faceapi from 'face-api.js';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
import { toast } from 'sonner';
import { useVideo } from '../hooks/VideoContext.jsx';

const Cam = ({ absentReasons, attendanceDone }) => {
    const [students, setStudents] = useState([]);
    const user = useSelector((state) => state.user.user);
    const { videoRef, setIsVideoPlaying } = useVideo();
    const [loading, setLoading] = useState(false);
    const [marked, setMarked] = useState(false)

    if (marked) {
        return;
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
            console.log("ERR", error);
            toast.error('Something went wrong, try later!');

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadModels = async () => {
            try {
                const modelUrl = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights";
                await faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl);
                await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
                await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
                console.log("Models loaded successfully");
            } catch (err) {
                console.error("Error loading face-api.js models:", err.message);
            }
        };

        loadModels();
        if (students.length === 0) {
            getStudents();
        }
    }, []);



    // Setup webcam and process each frame
    useEffect(() => {
        if (students.length > 0) {
            setLoading(true);
            const startWebcam = async () => {
                const video = videoRef.current;
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
                    video.srcObject = stream;
                    setIsVideoPlaying(true)

                    video.onplay = async () => {
                        const displaySize = { width: video.width, height: video.height };
                        faceapi.matchDimensions(video, displaySize);

                        // Use _id for matching instead of name
                        const labeledDescriptors = students.map(user => {
                            return new faceapi.LabeledFaceDescriptors(user._id, [new Float32Array(user.faceDescriptor)]);
                        });

                        const detectedUsersSet = new Set();

                        const interval = setInterval(async () => {
                            if (video.paused || video.ended) {
                                clearInterval(interval);
                                return;
                            }

                            const detections = await faceapi.detectSingleFace(video)
                                .withFaceLandmarks()
                                .withFaceDescriptor();

                            if (detections) {
                                const detectedFaceDescriptor = detections.descriptor;
                                let matchFound = false;
                                const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
                                const bestMatch = faceMatcher.findBestMatch(detectedFaceDescriptor);
                                console.log('Detected Face bestMatch:', bestMatch);

                                if (bestMatch && bestMatch.label !== 'unknown') {
                                    console.log(`User detected: ${bestMatch.label}`);
                                    matchFound = true;
                                    detectedUsersSet.add(bestMatch.label);
                                }

                                if (!matchFound) {
                                    console.log("No user detected in the frame.");
                                }
                            } else {
                                console.log("No face detected in the frame.");
                            }
                        }, 500); // Check every 500ms for better performance



                        const timeout = setTimeout(async () => {
                            clearInterval(interval);
                            stream.getTracks().forEach(track => track.stop());
                          

                            const detectedUsersArray = Array.from(detectedUsersSet);
                            const detectedFullUsersArray = students.filter(user =>
                                detectedUsersArray.includes(user._id) // Use _id for matching
                            );
                            const nonDetectedUsersArray = students.filter(user =>
                                !detectedUsersArray.includes(user._id) // Use _id for matching
                            );

                            console.log("Detected Users:", detectedUsersArray, "Non Detected Users:", nonDetectedUsersArray);
                            try {
                                const token = localStorage.getItem('jwttoken');
                                const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/faculty/mark-attendance?collegeId=${user.collegeId}&courseId=${user.course}`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({
                                        detectedStudents: detectedFullUsersArray,
                                        nonDetectedStudents: nonDetectedUsersArray,
                                        absentReasons,
                                    }),
                                });

                                if (response.ok) {
                                    console.log('Data sent successfully');
                                    setMarked(true)
                                    attendanceDone();
                                    toast.success('Attendance marked successully');
                                    return;
                                } else {
                                    console.error('Error occurred:', response.statusText);
                                }
                            } catch (error) {
                                console.error('Error occurred:', error);
                                toast.error('Something went bad');
                                   
                            }

                            setLoading(false);

                        }, 120000); // 20 sec timeout

                    };
                } catch (err) {
                    console.error("Error accessing webcam:", err.message);
                    toast.success("Something Went Wrong");
                }
            };
            if (!marked) {
                startWebcam();
            }
        } else {
            console.log("This is without student", 22222);
        }

    }, [students]);

    return (
        <>
            <div className="min-h-[50vh] flex justify-center items-center w-full">
                {loading ?
                    <MoonLoader size={20} color="gray" />
                    :
                    students.length === 0 && (<p className='text-xs'>
                        No Students Found
                    </p>)
                }
            </div>

        </>
    );
};

export default Cam;
