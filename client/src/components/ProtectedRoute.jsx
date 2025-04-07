// ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { MoonLoader } from 'react-spinners';
const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const user = useSelector((state) => state.user.user);
    const token = Cookies.get('jwttoken');


    let decoded;
    if (token) {
        decoded = jwtDecode(token)
    }

    // Ensure user data is available before applying redirect logic
    if (token && (!user || Object.keys(user).length === 0 || !decoded) && !['/', '/login', '/register'].includes(location.pathname)) {
        return <div className='h-[90vh] w-full flex items-center justify-center'>
            <MoonLoader size={20} color='gray'/>
        </div>
    }


    // Admin-related redirection logic
    if (token && decoded.role === 'Admin') {
        if (location.pathname === '/onboarding' && user.collegeId) {
            return <Navigate to="/dashboard" state={{ from: location }} replace />;
        }
        if ((user.collegeId === undefined || user.collegeId === null) && location.pathname !== '/onboarding') {
            return <Navigate to="/onboarding" state={{ from: location }} replace />;
        }
    }

    // Faculty-related redirection logic
    if (token && decoded.role === 'Faculty') {
        if (location.pathname === '/onboarding' && user?.course) {
            return <Navigate to="/dashboard" state={{ from: location }} replace />;
        }
        if (!user?.course && location.pathname !== '/onboarding') {
            return <Navigate to="/onboarding" state={{ from: location }} replace />;
        }
    }

    // Parent-related redirection logic
    if (token && decoded.role === 'Parent') {
        if (location.pathname === '/onboarding' && user.students && user.students.length > 0) {
            return <Navigate to="/dashboard" state={{ from: location }} replace />;
        }
        if ((user.students === undefined || user.students === null || user.students.length == 0) && location.pathname !== '/onboarding') {
            return <Navigate to="/onboarding" state={{ from: location }} replace />;
        }
    }

    if (!token && !['/', '/login', '/register'].includes(location.pathname)) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }


    if (token && ['/login', '/register'].includes(location.pathname)) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return children; // If there's a token, show the protected content
};

export default ProtectedRoute;
