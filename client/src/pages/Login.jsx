import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpFromDot, FileWarningIcon } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from "@/redux/reducers/userReducer";
import { useEffect } from "react";

// Validation schemas
const facultySchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password must not exceed 20 characters"),
});

const adminSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password must not exceed 20 characters"),
});

const parentSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password must not exceed 20 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // React Hook Form setup for each role (faculty, admin, parent)
  const { register: facultyRegister, handleSubmit: handleFacultySubmit, formState: { errors: facultyErrors } } = useForm({ resolver: zodResolver(facultySchema) });
  const { register: adminRegister, handleSubmit: handleAdminSubmit, formState: { errors: adminErrors } } = useForm({ resolver: zodResolver(adminSchema) });
  const { register: parentRegister, handleSubmit: handleParentSubmit, formState: { errors: parentErrors } } = useForm({ resolver: zodResolver(parentSchema) });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])


  // Submit handlers
  const onFacultySubmit = async (data) => {
    const formData = new FormData();
    formData.append("role", "Faculty");
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/login`, { method: 'POST', body: formData, credentials: 'include' });

    if (response.status === 201) {
      const responseData = await response.json();
      localStorage.setItem('jwttoken', responseData.jwttoken);

      toast.success("Faculty has been logged in");
      // const userData = await (await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/getdata`, { method: 'GET', credentials: 'include' })).json();
      // dispatch(setUser({ ...userData, role: "Faculty" }));
      // navigate('/dashboard');

      // Fetch user data with the token from localStorage
      const token = localStorage.getItem('jwttoken'); // Get the token from localStorage

      const userData = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/getdata`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Use the token from localStorage
        },
      }).then((response) => response.json());

      dispatch(setUser({ ...userData, role: "Faculty" }));
      navigate('/dashboard');

    } else {
      const msg = await response.json()
      toast.error(msg.message)
    }
  };

  const onAdminSubmit = async (data) => {
    const formData = new FormData();
    formData.append("role", "Admin");
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/login`, { method: 'POST', body: formData, credentials: 'include' });

    if (response.status === 201) {
      const responseData = await response.json();
      localStorage.setItem('jwttoken', responseData.jwttoken);
      toast.success("Admin has been logged in");
      // const userData = await (await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/getdata`, { method: 'GET', credentials: 'include' })).json();

      const token = localStorage.getItem('jwttoken'); // Get the token from localStorage

      const userData = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/getdata`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Use the token from localStorage
        },
      }).then((response) => response.json());

      dispatch(setUser({ ...userData, role: "Admin" }));
      navigate('/dashboard');



    } else {
      const msg = await response.json()
      toast.error(msg.message)
    }
  };

  const onParentSubmit = async (data) => {
    const formData = new FormData();
    formData.append("role", "Parent");
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/login`, { method: 'POST', body: formData, credentials: 'include' });

    if (response.status === 201) {
      const responseData = await response.json();
      localStorage.setItem('jwttoken', responseData.jwttoken);
      toast.success("Parent has been logged in");
      // const userData = await (await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/getdata`, { method: 'GET', credentials: 'include' })).json();

      const token = localStorage.getItem('jwttoken'); // Get the token from localStorage
      const userData = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/getdata`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Use the token from localStorage
        },
      }).then((response) => response.json());
      dispatch(setUser({ ...userData, role: "Parent" }));
      navigate('/dashboard');
    } else {
      const msg = await response.json()
      toast.error(msg.message)
    }
  };

  return (
    <>
      <Button variant='link' className="text-xs mt-8 -ml-2">
        <FileWarningIcon size={12} className="-mt-0.5" />
        <Link to='/register'>
          Don't have an account? Register <ArrowUpFromDot className="rotate-90 ml-0.5 inline" size={10} />
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold mb-2">Login as a</h1>
      <p className="text-sm max-w-[700px] mb-8">
        To access the portal, you need to log in based on your role. Whether you're an admin, faculty member, or parent,
        this platform offers unique functionalities tailored to your needs. Ensure that your email and password are correct
        before proceeding.
      </p>
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
        <Tabs defaultValue="admin" className="w-full md:w-[40%]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="parent">Parent</TabsTrigger>
          </TabsList>

          {/* Admin Registration */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminSubmit(onAdminSubmit)}>
                  <div className="grid w-full  items-center gap-1.5 mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input {...adminRegister("email")} id="email" placeholder="Email" className={adminErrors?.email ? "border-red-500" : ""} />
                    {adminErrors?.email && <span className="text-xs text-red-500">{adminErrors?.email.message}</span>}
                  </div>

                  <div className="grid w-full  items-center gap-1.5 mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input {...adminRegister("password")} type="password" id="password" placeholder="Password" className={adminErrors?.password ? "border-red-500" : ""} />
                    {adminErrors?.password && <span className="text-xs text-red-500">{adminErrors?.password.message}</span>}
                  </div>

                  <Button type="submit" className="w-full py-2 px-4">
                    Login Admin
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Faculty Registration */}
          <TabsContent value="faculty">
            <Card>
              <CardHeader>
                <CardTitle>Faculty</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFacultySubmit(onFacultySubmit)}>
                  <div className="grid w-full  items-center gap-1.5 mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input {...facultyRegister("email")} id="email" placeholder="Email" className={facultyErrors?.email ? "border-red-500" : ""} />
                    {facultyErrors?.email && <span className="text-xs text-red-500">{facultyErrors?.email.message}</span>}
                  </div>

                  <div className="grid w-full  items-center gap-1.5 mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input {...facultyRegister("password")} type="password" id="password" placeholder="Password" className={facultyErrors?.password ? "border-red-500" : ""} />
                    {facultyErrors?.password && <span className="text-xs text-red-500">{facultyErrors?.password.message}</span>}
                  </div>

                  <Button type="submit" className="w-full py-2 px-4">
                    Login Faculty
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parent Registration */}
          <TabsContent value="parent">
            <Card>
              <CardHeader>
                <CardTitle>Parent</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleParentSubmit(onParentSubmit)}>
                  <div className="grid w-full  items-center gap-1.5 mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input {...parentRegister("email")} id="email" placeholder="Email" className={parentErrors?.email ? "border-red-500" : ""} />
                    {parentErrors?.email && <span className="text-xs text-red-500">{parentErrors?.email.message}</span>}
                  </div>

                  <div className="grid w-full  items-center gap-1.5 mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input {...parentRegister("password")} type="password" id="password" placeholder="Password" className={parentErrors?.password ? "border-red-500" : ""} />
                    {parentErrors?.password && <span className="text-xs text-red-500">{parentErrors?.password.message}</span>}
                  </div>

                  <Button type="submit" className="w-full py-2 px-4">
                    Login Parent
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="w-full md:w-[58%] relative rounded-sm border bg-muted text-muted-foreground inline-flex items-center justify-center ">
          <img src="/undraw_push-notifications_5z1s.svg" className="p-16 max-h-[350px]" />
          <p className="absolute bottom-[5%] p-2  text-xs text-center">Together, we build a better future for education.</p>
        </div>
      </div>
    </>
  );
};

export default Login;
