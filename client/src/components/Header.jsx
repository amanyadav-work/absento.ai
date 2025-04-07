import { Link, useNavigate } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from "@/redux/reducers/userReducer";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useTheme } from "@/components/theme-provider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { jwtDecode } from "jwt-decode";
import { SidebarTrigger, } from "./ui/sidebar";

const Header = () => {
    const dispatch = useDispatch();
    const { theme } = useTheme()
    const userData = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    const handleSetUser = async () => {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/getdata`, {
            method: 'GET',
            credentials: 'include'
        });
        const user = await response.json()
        const token = Cookies.get('jwttoken');
        const decoded = jwtDecode(token);
        user.role = decoded.role;
        dispatch(setUser(user));

    };

    useEffect(() => {
        const token = Cookies.get('jwttoken');
        if (!userData?.user && token) {
            handleSetUser();
        }
    }, [])

    const handleLogout = () => {
        Cookies.remove('jwttoken'); // Remove the token from cookies
        dispatch(setUser(null));
        navigate('/login')
    };

    return (
        <>
            {/* Navbar */}
            <header className={`${theme == "dark" ? "navbar-dark" : "navbar-light"}  w-full flex justify-between items-center z-40 p-3.5 border-b`}>

                <div className="my-container mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <h1 className="text-[13px] font-semibold">
                        <Link to="/" className="hover:text-gray-200 flex gap-1 items-center">
                            <img src="/Logo.png" alt="" className={`w-[23px] -mt-0.5 ${theme == "dark" ? "brightness-[5000]" : ""}`} />
                            <span className="border-[1.5px] rounded-sm px-2 py-1">
                                Absento
                            </span>
                        </Link>
                    </h1>

                    {/* Desktop and mobile menu toggle */}
                    <div className="flex  lg:gap-5 items-center">
                        {/* Mobile menu button */}
                        <SidebarTrigger className='block lg:hidden' />

                        {/* Navigation links for large screens */}
                        <nav className="hidden lg:flex space-x-5 text-xs">
                            <Link to="/" className="hover:text-gray-200">Home</Link>
                            <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
                            <Link to="statistics" className="hover:text-gray-200">Statistics</Link>
                            <Link to="/students" className="hover:text-gray-200">Students</Link>
                        </nav>
                        |

                        {/* User menu */}
                        <div className="flex gap-2 items-center">
                            {userData?.role ? <>
                                {userData?.imageUrl && (
                                    <DropdownMenu >
                                        <DropdownMenuTrigger><img src={userData?.imageUrl} alt="" width={35} height={35} className="border-blue-700 hover:border-amber-500 p-[2px] rounded-full object-cover aspect-square" /></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {/* <DropdownMenuItem>Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Billing</DropdownMenuItem>
                                            <DropdownMenuItem>Team</DropdownMenuItem> */}
                                            <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>Logout</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )
                                }
                                {userData.role === "Faculty" &&
                                    <Link to="/attendance" className="hover:text-gray-200">
                                        <Button className='hidden lg:block' variant=''>
                                            Take Attendance
                                        </Button>
                                    </Link>
                                }
                                {userData.role === "Admin" &&
                                    <Button onClick={handleLogout} className='hidden lg:block' variant='outline'>
                                        Logout
                                    </Button>

                                }
                            </> : (
                                <>
                                    <Link to="/login" className="hover:text-gray-200">
                                        <Button variant='outline'>
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register" className="hover:text-gray-200"> <Button variant='' size={''}>
                                        Register
                                    </Button>
                                    </Link>
                                </>
                            )}
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </header>

        </>
    )
}

export default Header
