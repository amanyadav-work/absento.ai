import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";  // Removed Controller import
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowUpFromDot, UserCircle2Icon } from "lucide-react";
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from "@/redux/reducers/userReducer";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";


const facultySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
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
  collegeId: z.string().min(1, "College ID is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
});

const adminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
});

const parentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
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
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
});

const Register = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate()


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const {
    register: facultyRegister,
    handleSubmit: handleFacultySubmit,
    formState: { errors: facultyErrors },
  } = useForm({
    resolver: zodResolver(facultySchema),
  });

  const {
    register: adminRegister,
    handleSubmit: handleAdminSubmit,
    formState: { errors: adminErrors },
  } = useForm({
    resolver: zodResolver(adminSchema),
  });

  const {
    register: parentRegister,
    handleSubmit: handleParentSubmit,
    formState: { errors: parentErrors }, // Renaming errors to parentErrors
  } = useForm({
    resolver: zodResolver(parentSchema), // Using Zod for validation
  });


  // Submit handler
  const onFacultySubmit = async (data) => {
    setIsLoading(true)

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("role", "Faculty");
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("collegeId", data.collegeId);
    formData.append("phone", data.phone);

    if (data.picture[0]) {
      formData.append("picture", data.picture[0]);
    }
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/register`, {
      method: 'POST',
      body: formData,
    });

    if (response.status === 201) {
      const responseData = await response.json();
      localStorage.setItem('jwttoken', responseData.jwttoken);
      toast.success("Faculty has been created successfully.");
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/getdata`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Use the token from localStorage
        },
      });
      const userData = await response.json()
      dispatch(setUser({ ...userData, role: "Faculty" }));
      navigate('/onboarding')
    } else if (response.status === 409) {
      toast.error("User Already Exists. Please Login"); // Error toast
    } else {
      toast.error("Failed to register faculty. Please try again.");
    }
    setIsLoading(false)
  };

  const onAdminSubmit = async (data) => {
    setIsLoading(true)
    // Prepare FormData for sending the data
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("role", "Admin");
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);

    if (data.picture && data.picture[0]) {
      formData.append("picture", data.picture[0]); // Append picture if exists
    }

    // Send the data to your server or API
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/register`, {
      method: 'POST',
      body: formData,
    });

    if (response.status === 201) {
      const responseData = await response.json();
      localStorage.setItem('jwttoken', responseData.jwttoken);
      toast.success("Admin has been created successfully.");
      const token = localStorage.getItem('jwttoken'); // Get the token from localStorage
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/getdata`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Use the token from localStorage
        },
      });
      const userData = await response.json()
      dispatch(setUser({ ...userData, role: "Admin" }));
      navigate('/onboarding')
    } else if (response.status === 409) {
      toast.error("User Already Exists. Please Login"); // Error toast
    } else {
      toast.error("Failed to register admin. Please try again."); // Error toast
    }
    setIsLoading(false)

  };


  const onParentSubmit = async (data) => {
    setIsLoading(true)

    // Prepare FormData for sending the data
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("role", "Parent");
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);

    if (data.picture[0]) {
      formData.append("picture", data.picture[0]); // Append picture if exists
    }

    // Send the data to your server or API
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/register`, {
      method: 'POST',
      body: formData,
    });


    if (response.status === 201) {
      const responseData = await response.json();
      localStorage.setItem('jwttoken', responseData.jwttoken);
      toast.success("Parent has been created successfully.");
      const token = localStorage.getItem('jwttoken'); // Get the token from localStorage

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/getdata`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Use the token from localStorage
        },
      });
      const userData = await response.json()
      dispatch(setUser({ ...userData, role: "Parent" }));
      navigate('/onboarding')
    } else if (response.status === 409) {
      toast.error("User Already Exists. Please Login"); // Error toast
    }
    else {
      toast.error("Failed to register parent. Please try again."); // Error toast
    }
    setIsLoading(false)

  }

  return (
    <div className="container mx-auto ">
      <Button variant='link' className="text-xs mt-8 -ml-2">
        <UserCircle2Icon size={18} className="-mt-0" />
        <Link to='/login'>
          Already Have an account? Login <ArrowUpFromDot className="rotate-90 ml-0.5 inline" size={10} />
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold mb-2">Register as a</h1>
      <p className="text-sm max-w-[700px] mb-8">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores perferendis eveniet, perspiciatis est iusto totam blanditiis? Eius incidunt facilis recusandae, odit explicabo voluptatem?</p>
      <div className="flex flex-col lg:flex-row justify-between lg:items-start">
        <Tabs defaultValue="admin" className="w-full lg:w-[40%]">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="parent">Parent</TabsTrigger>
          </TabsList>

          {/* Admin Form */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin</CardTitle>
                <CardDescription>
                  Make changes to your admin here. Click save when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleAdminSubmit(onAdminSubmit)} className="space-y-4">
                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="name">Name</Label>
                    <Input {...adminRegister("name")} id="name" placeholder="Your full name" className={adminErrors?.name ? "border-red-500" : ""} />
                    {adminErrors?.name && <span className="text-xs text-red-500">{adminErrors?.name.message}</span>}
                  </div>

                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input {...adminRegister("email")} type="email" id="email" placeholder="Email" className={adminErrors?.email ? "border-red-500" : ""} />
                    {adminErrors?.email && <span className="text-xs text-red-500">{adminErrors?.email.message}</span>}
                  </div>

                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input {...adminRegister("password")} type="password" id="password" placeholder="Password" className={adminErrors?.password ? "border-red-500" : ""} />
                    {adminErrors?.password && <span className="text-xs text-red-500">{adminErrors?.password.message}</span>}
                  </div>

                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input {...adminRegister("phone")} type="tel" id="phone" placeholder="Phone number" className={adminErrors?.phone ? "border-red-500" : ""} />
                    {adminErrors?.phone && <span className="text-xs text-red-500">{adminErrors?.phone.message}</span>}
                  </div>

                  <Button type="submit" className="w-full py-2 px-4" disabled={isLoading}>
                    {isLoading ? <MoonLoader size={12} /> : "Register Admin"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Faculty Form */}
          <TabsContent value="faculty">
            <Card>
              <CardHeader>
                <CardTitle>Faculty</CardTitle>
                <CardDescription>
                  Change your faculty here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleFacultySubmit(onFacultySubmit)} className="space-y-4">
                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="name">Name</Label>
                    <Input {...facultyRegister("name")} id="name" placeholder="Your full name" className={facultyErrors?.name ? "border-red-500" : ""} />
                    {facultyErrors?.name && <span className="text-xs text-red-500">{facultyErrors?.name.message}</span>}
                  </div>

                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input {...facultyRegister("email")} type="email" id="email" placeholder="Email" className={facultyErrors?.email ? "border-red-500" : ""} />
                    {facultyErrors?.email && <span className="text-xs text-red-500">{facultyErrors?.email.message}</span>}
                  </div>

                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input {...facultyRegister("password")} type="password" id="password" placeholder="Password" className={facultyErrors?.password ? "border-red-500" : ""} />
                    {facultyErrors?.password && <span className="text-xs text-red-500">{facultyErrors?.password.message}</span>}
                  </div>

                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="college-id">College ID</Label>
                    <Input {...facultyRegister("collegeId")} id="college-id" placeholder="College ID" className={facultyErrors?.collegeId ? "border-red-500" : ""} />
                    {facultyErrors?.collegeId && <span className="text-xs text-red-500">{facultyErrors?.collegeId.message}</span>}
                  </div>

                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input {...facultyRegister("phone")} type="tel" id="phone" placeholder="Phone number" className={facultyErrors?.phone ? "border-red-500" : ""} />
                    {facultyErrors?.phone && <span className="text-xs text-red-500">{facultyErrors?.phone.message}</span>}
                  </div>


                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="picture">Profile Picture</Label>
                    <Input {...facultyRegister("picture")} type="file" id="picture" className={facultyErrors?.picture ? "border-red-500" : ""} />
                    {facultyErrors?.picture && <span className="text-xs text-red-500">{facultyErrors?.picture.message}</span>}
                  </div>

                  <Button type="submit" className="w-full py-2 px-4" disabled={isLoading}>
                    {isLoading ? <MoonLoader size={12} /> : "Register Faculty"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parent Form */}
          <TabsContent value="parent">
            <Card>
              <CardHeader>
                <CardTitle>Parent</CardTitle>
                <CardDescription>
                  Change your parent profile here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleParentSubmit(onParentSubmit)} className="space-y-4">
                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="name">Name</Label>
                    <Input {...parentRegister("name")} id="name" placeholder="Your full name" className={parentErrors?.name ? "border-red-500" : ""} />
                    {parentErrors?.name && <span className="text-xs text-red-500">{parentErrors?.name.message}</span>}
                  </div>

                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input {...parentRegister("email")} type="email" id="email" placeholder="Email" className={parentErrors?.email ? "border-red-500" : ""} />
                    {parentErrors?.email && <span className="text-xs text-red-500">{parentErrors?.email.message}</span>}
                  </div>

                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input {...parentRegister("password")} type="password" id="password" placeholder="Password" className={parentErrors?.password ? "border-red-500" : ""} />
                    {parentErrors?.password && <span className="text-xs text-red-500">{parentErrors?.password.message}</span>}
                  </div>

                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input {...parentRegister("phone")} type="tel" id="phone" placeholder="Phone number" className={parentErrors?.phone ? "border-red-500" : ""} />
                    {parentErrors?.phone && <span className="text-xs text-red-500">{parentErrors?.phone.message}</span>}
                  </div>

                  <div className="grid w-full items-center gap-1.5 mb-4">
                    <Label htmlFor="picture">Profile Picture</Label>
                    <Input {...parentRegister("picture")} type="file" id="picture" className={parentErrors?.picture ? "border-red-500" : ""} />
                    {parentErrors?.picture && <span className="text-xs text-red-500">{parentErrors?.picture.message}</span>}
                  </div>

                  <Button type="submit" className="w-full py-2 px-4" disabled={isLoading}>
                    {isLoading ? <MoonLoader size={12} /> : "Register Parent"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="lg:w-[58%] min-h-[500px] relative rounded-sm border bg-muted text-muted-foreground flex items-center justify-center mt-8 lg:mt-0">
          <img src="/undraw_projections_fhch.svg" className="p-8 max-h-[350px] w-full object-contain" />
          <p className="absolute bottom-[5%] p-2  text-xs text-center">Take Discipline In Control</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
