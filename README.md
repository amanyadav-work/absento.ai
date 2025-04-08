# Absento.ai - Automated Attendance System

Absento.ai is an AI-powered attendance system that uses facial recognition to automatically mark student attendance via webcam. It provides real-time attendance updates, detailed charts and stats, and AI predictions based on historical data. 


Visit the live deployment at: [Absento.ai](https://absento-ai.vercel.app/)

See all projects at: [amanwebdev.site](https://amanwebdev.site/)

![Absento.ai Thumbnail](https://amanyadav-work.github.io/portfolio/public/assets/Abesento-ai-face-recognition-system.webp)

It also has role-based access: Admins, Faculty, and Parents. Admins can manage colleges and faculty, while Faculty can take attendance and view course-specific statistics. Parents can track their children's attendance and view predictions.

## Features

### Attendance
- **Face Detection**: Using Face API models, Absento.ai detects students' faces through the webcam every 500ms and compares it with stored face descriptors to mark attendance.
- **Real-time Attendance**: As students' faces are detected, attendance is marked automatically.
- **Instant Notifications**: If a student is absent, parents receive an instant WhatsApp message with the reason (if provided by the Faculty).
  
### User Roles
1. **Admin**:
   - Can add and manage colleges.
   - Provides college IDs to Faculty and Parents.
   - Views overall college stats.
   - Can predict student attendance for the entire college using AI predictions.
   
2. **Faculty**:
   - Takes attendance with a single button click.
   - Views attendance stats for their course.
   - Can add reasons for student absences.
   - Quick stats of the day's attendance displayed in the dashboard.
   
3. **Parents**:
   - Can add children to the system and associate them with specific colleges and courses.
   - Views attendance and prediction stats for their children.
   - Can add multiple children across different colleges or courses.
   
### AI Predictions
- Absento.ai uses historical data from the past 3 months to predict future attendance for each student, including reasons why the AI expects attendance on certain dates.

### Stats & Reports
- Detailed charts and stats are available showing:
  - Attendance trends.
  - Growth rates.
  - Comparisons across daily, weekly, and monthly timelines.
  - Absentee reasons analysis.

## Tech Stack

This project is built using the following technologies:

- **Frontend**: React.js, Tailwind CSS, Shadcn UI, React Hook Form, Zod, Face API, and JWT Authentication.
- **Backend**: Node.js, Express, MongoDB, bcrypt, JWT, Twilio for SMS, Cloudinary for image storage, and Face API for facial recognition.
- **Libraries**: 
  - **Frontend**: `@hookform/resolvers`, `@radix-ui/react-*`, `react-redux`, `react-router-dom`, `recharts`, `tailwind-merge`, `zod`, and more.
  - **Backend**: `bcrypt`, `body-parser`, `cloudinary`, `cookie-parser`, `cors`, `dotenv`, `express-fileupload`, `groq-sdk`, `jsonwebtoken`, `mongoose`, `twilio`, and more.

## How It Works

### Attendance Process
1. **Parent Adds a Child**:
   - The parent uploads an image of their child.
   - The system detects the face and stores the **face descriptor** in the database.
   
2. **Faculty Takes Attendance**:
   - Faculty clicks a button to start taking attendance.
   - The system uses the webcam to capture faces every 500ms and compares them with the stored face descriptors.
   - Attendance is marked automatically when a match is found.
   - If a student is absent, the system sends an SMS to the parent via Twilio.

3. **Face Matching**:
   - The system maintains a Set to avoid duplicate attendance marks. Each student's face descriptor is stored in the Set when matched.

4. **Attendance Reporting**:
   - The system offers a detailed dashboard to view today's attendance stats and detailed reports by role.
   - Admins can see stats for the entire college, while Faculty and Parents can view their respective statistics.

### AI-Powered Attendance Prediction
- Based on the past 3 months' attendance data, Absento.ai predicts attendance for the upcoming month using the **Grok API**.
- The system provides reasoning for why the AI expects attendance on certain dates.


