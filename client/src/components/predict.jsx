import React, { useEffect, useState } from 'react';
import { Calendar } from "@/components/ui/calendar"
import { MoonLoader } from 'react-spinners';
import { toast } from 'sonner';
import { addDays } from 'date-fns';
import { WandSparkles } from 'lucide-react';


const AttendancePrediction = ({ selectedStudent, stdAttendance: attendanceData }) => {
  const [predictions, setPredictions] = useState({});
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const [date, setDate] = useState([])

  useEffect(() => {
    // Append the styles to the head
    const style = document.createElement('style');
    style.innerHTML = `
      .flex.flex-col.sm\\:flex-row.gap-2, .flex.flex-col.gap-4.rdp-caption_start.rdp-caption_end {
        width: 100%;
      }

      tr.flex {
        justify-content: space-around;
      }

      button.rdp-button_reset.rdp-button.inline-flex.items-center.justify-center.whitespace-nowrap.text-xs.transition-all.disabled\\:pointer-events-none.disabled\\:opacity-50.\\[\\&_svg\\]\\:pointer-events-none.\\[\\&_svg\\:not\\(\\[class\\*\\='size-\\'\\]\\)\\]\\:size-4.shrink-0.\\[\\&_svg\\]\\:shrink-0.outline-none.focus-visible\\:border-ring.focus-visible\\:ring-ring\\/50.focus-visible\\:ring-\\[3px\\].aria-invalid\\:ring-destructive\\/20.dark\\:aria-invalid\\:ring-destructive\\/40.aria-invalid\\:border-destructive.hover\\:bg-accent.hover\\:text-accent-foreground.dark\\:hover\\:bg-accent\\/50.rounded-md.gap-1\\.5.has-\\[\\>svg\\]\\:px-2\\.5.size-8.p-0.font-normal.aria-selected\\:opacity-100 {
        font-size: 100%;
        padding: 70%;
      }
        .flex.flex-col.sm\:flex-row.gap-2, .flex.flex-col.gap-4.rdp-caption_start.rdp-caption_end {
    width: 100%;
  }
  
  tr.flex {
    justify-content: space-around;
  }
  
  button.rdp-button_reset.rdp-button.inline-flex.items-center.justify-center.whitespace-nowrap.text-xs.transition-all.disabled\:pointer-events-none.disabled\:opacity-50.\[\&_svg\]\:pointer-events-none.\[\&_svg\:not\(\[class\*\=\'size-\'\]\)\]\:size-4.shrink-0.\[\&_svg\]\:shrink-0.outline-none.focus-visible\:border-ring.focus-visible\:ring-ring\/50.focus-visible\:ring-\[3px\].aria-invalid\:ring-destructive\/20.dark\:aria-invalid\:ring-destructive\/40.aria-invalid\:border-destructive.hover\:bg-accent.hover\:text-accent-foreground.dark\:hover\:bg-accent\/50.rounded-md.gap-1\.5.has-\[\>svg\]\:px-2\.5.size-8.p-0.font-normal.aria-selected\:opacity-100 {
    font-size: 100%;
    padding: 70%;
  }
    `;
    document.head.appendChild(style);

    // Cleanup the styles on component unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getPredictions = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('jwttoken');
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/get-prediction?stdId=${selectedStudent}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Something Went Wrong');
      }

      const data = await response.json();

      if (data?.prediction) {
        setPredictions(data.prediction)
        const presentDays = data.prediction.attendance.filter(item => item.status === 'present');
        const formattedDates = presentDays.map(item => new Date(item.date));
        setDate(formattedDates);
      } else {
        await generatePredictions()
      }

    } catch (error) {
      toast.error('Something went wrong, try later!');
    } finally {
      setIsLoading(false);
    }
  }

  const generatePredictions = async () => {
    setIsLoading(true)

    const prompt = `This is the historical attendance data of a student:
    ${JSON.stringify(attendanceData)}
    
    Predict the student's attendance (absent or present) for each day next month, excluding Sundays and holidays. Consider factors like historical attendance, weekend absences, and any relevant trends or patterns. Provide the data in the following format:
    
    {
      attendance: [
        { "date": "Sat Mar 15 2025 00:00:00 GMT+0530 (India Standard Time)", "status": "absent" },
        { "date": "Mon Mar 17 2025 00:00:00 GMT+0530 (India Standard Time)", "status": "present" }
      ],
      reasons: "Provide a paragraph describing why you expect absence on specific days, including any relevant factors."
    }
    
    Note: Don't include any notes or comments. Just give the JSON structure and the paragraph for reasons.`


    try {
      const token = localStorage.getItem('jwttoken');
      const url = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/groq-chat`;
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ prompt: prompt }),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Something Went Wrong');
      }

      const data = await response.json();

      const predictionUrl = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/save-prediction?stdId=${selectedStudent}`;
      const saveResponse = await fetch(predictionUrl, {
        method: 'POST',
        body: JSON.stringify({ prediction: data }),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!saveResponse.ok) {
        throw new Error('Something Went Wrong');
      }

      setPredictions(data)
      const presentDays = data.attendance.filter(item => item.status === 'present');
      const formattedDates = presentDays.map(item => new Date(item.date));
      setDate(formattedDates);

    } catch (error) {
      toast.error('Something went wrong, try later!');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (selectedStudent)
      getPredictions();
  }, [attendanceData]);



  return (
    (isLoading) ?
      <div className="h-[200px] flex justify-center items-center w-full">
        <MoonLoader size={20} color="gray" />
      </div>
      :
      <div className='w-full flex flex-col gap-2.5 items-center justify-between'>

        <Calendar type="multiple"
          mode="multiple"
          selected={date}
          month={date[0]}
          className="rounded-md border w-full justify-center flex items-center"
          classNames={{
            nav_button: "hidden",
            day_selected: "bg-[#00a900] text-white",
          }}
        />

        <div className='border p-4.5 rounded-xs space-y-2'>
          <h2 className='text-sm'><WandSparkles className='rounded-full border p-2 inline mr-2' size={30} /> Ai Given Reasonings</h2>
          <hr />
          <p className="text-xs">
            {predictions.reasons}
          </p>
        </div>
        <style jsx>{`
        .flex.flex-col.sm\:flex-row.gap-2, .flex.flex-col.gap-4.rdp-caption_start.rdp-caption_end {
    width: 100%;
}
         

        `}</style>

      </div>



  );
};

export default AttendancePrediction;
