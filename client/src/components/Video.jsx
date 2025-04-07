import React, { useEffect, useState } from 'react';
import { useVideo } from '../hooks/VideoContext';
import { Button } from './ui/button';
import { Expand, Minus, Plus } from 'lucide-react';
import { MoonLoader } from 'react-spinners';

const Video = () => {
    const { videoRef, isVideoPlaying } = useVideo();
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (videoRef.current && isVideoPlaying) {
            const video = videoRef.current;
            video.play();
        }
    }, [isVideoPlaying, videoRef]);

    const triggerFullScreen = () => {
        const video = videoRef.current;

        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { // Firefox
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { // Chrome, Safari and Opera
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { // IE/Edge
            video.msRequestFullscreen();
        }
    };

    return (
        <div className={`${isVideoPlaying ? "block" : "hidden"} fixed w-[300px] bottom-5 right-5 border z-50 bg-background`}>
            <div className="w-full rounded-t-xs text-xs pl-4 flex justify-between items-center">
                <div className='flex gap-2 items-center'><MoonLoader color='gray' size={7}/> Taking Attendance...</div>
                <div>
                    <Button  variant='none' onClick={() => setShow(!show)}>{show ? <Minus /> : <Plus />}</Button>
                    {show && (
                        <Button  variant='none' onClick={triggerFullScreen}>
                            <Expand size={1}/>
                        </Button>
                    )}
                </div>
            </div>
            <div className={`${show ? "visible h-fit p-2" : "invisible h-[0px]"} rounded-b-xs border border-t-0 pt-0`}>
            <video
               className={`${show ? "visible h-fit" : "invisible h-[0px]"} rounded-xs`}
                ref={videoRef}
                autoPlay
                muted
                onLoadedMetadata={(e) => {
                    const video = e.target;
                    video.width = video.videoWidth;
                    video.height = video.videoHeight;
                }}
                />
                </div>
        </div>
    );
};

export default Video;
