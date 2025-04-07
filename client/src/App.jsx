
import { ThemeProvider } from "@/components/theme-provider"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Register from "./pages/Register"
import AppLayout from "./components/AppLayout"
import Login from "./pages/Login"
import Home from "./pages/Home"
import './App.css';
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import Onboarding from "./pages/Onboarding"
import Students from "./pages/Students"
import Attendance from "./pages/Attendance"
import { VideoProvider } from "./hooks/VideoContext"
import Video from "./components/Video"
import AddStudents from "./pages/AddStudents"
import Statistics from "./pages/Statistics"
import { useIsMobile } from "./hooks/use-mobile"
import { FlameKindling } from "lucide-react"

function App() {

  const isMobile = useIsMobile()

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/register',
          element: <ProtectedRoute><Register /></ProtectedRoute>
        },
        {
          path: '/login',
          element: <ProtectedRoute><Login /></ProtectedRoute>
        },
        {
          path: '/onboarding',
          element: <ProtectedRoute><Onboarding /></ProtectedRoute>,
        },
        {
          path: '/dashboard',
          element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
        },
        {
          path: '/students',
          element: <ProtectedRoute><Students /></ProtectedRoute>,
        },
        {
          path: '/students/add',
          element: <ProtectedRoute><AddStudents /></ProtectedRoute>,
        },
        {
          path: '/attendance',
          element: <ProtectedRoute><Attendance /></ProtectedRoute>,
        },
        {
          path: '/statistics',
          element: <ProtectedRoute><Statistics /></ProtectedRoute>,
        },
      ]
    }
  ])

  return (
    <>
      {!isMobile ? <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <VideoProvider>
          <Video />
          <RouterProvider router={router} />
        </VideoProvider>
      </ThemeProvider>
        :
        <div className="w-full h-screen flex flex-col gap-2 items-center justify-center align-middle">
          <FlameKindling color="grey" />
          <p className="text-xs text-muted-foreground">
            Oops, we're working on mobile version
          </p>
        </div>
      }
    </>
  )
}

export default App
