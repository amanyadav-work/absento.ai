import StarRating from '@/components/ui/Rating';
import testimonials from '../sample-data/testinomials';
import features from '../sample-data/features';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from "@/components/theme-provider"

const Home = () => {
    const { theme } = useTheme()
    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, [])

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <section className="pb-0 pt-24 bg-linear-210">
                <div className="container mx-auto text-center flex flex-col items-center justify-center">
                    <h2 className="text-4xl font-bold mb-4">Take the hassle out of attendance with absento.ai</h2>
                    <p className="text-lg mb-8">Revolutionizing attendance management with face recognition and AI-powered trend prediction.</p>
                    <img src="https://www.jibble.io/wp-content/uploads/2022/04/Automated-Timesheet-e1656049174185.png" alt="" className={`${theme === "dark" ? "invert-100" : "border rounded-sm shadow-sm"} w-[65%] my-5`} />
                    {/* <button className="py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition">Get Started</button> */}
                </div>
            </section>

            {/* Features Section */}
            {/* <section id="features" className="py-24">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">Our Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold mb-4">Face Recognition</h3>
                            <p>Effortlessly track attendance with advanced face recognition technology.</p>
                        </div>
                        <div className="p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold mb-4">AI-Powered Trend Prediction</h3>
                            <p>Leverage AI to predict attendance patterns and trends, optimizing scheduling.</p>
                        </div>
                        <div className="p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold mb-4">Real-Time Analytics</h3>
                            <p>Access real-time attendance data and reports to make informed decisions.</p>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* About Section */}
            <section id="about" className="py-14">
                {features.map((ft, idx) => {
                    return <div key={idx} className={`flex ${idx % 2 === 0 && "flex-row-reverse"} min-h-[450px] gap-16 items-center justify-between container mx-auto text-center`}>
                        <div className="w-full min-w-[50%] text-left space-y-3">
                            <span className='font-bold mb-3 block text-md text-muted-foreground'>{ft.subheading}</span>
                            <h2 className="text-3xl font-bold">{ft.heading}</h2>
                            <p className='text-sm'>{ft.description}</p>
                            <Link to={ft.cta_link}>
                                {ft.cta} <ArrowRight size={18} className='inline' /></Link>
                        </div>
                        <img src={ft.image} className={`w-full max-w-[600px]  p-5 rounded-sm ${theme === "dark" ? "invert-100" : "border"} bg-transparent`} />
                    </div>
                })}
            </section >

            {/* Contact Section */}
            < section id="contact" className="py-16" >
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-13">Tens of thousands of users love Absento's attendance software...</h2>
                    <div className="grid grid-cols-4 gap-3 text-left">
                        {testimonials.map((testimonial, idx) => (
                            <div key={idx} className="p-4 bg-muted rounded-sm border shadow-xs space-y-4">
                                <h3 className="text-sm font-semibold">{testimonial.title}</h3>
                                <StarRating rating={Math.round(Math.random() * (5 - 3) + 3)} />
                                <p className="text-xs">{testimonial.review}</p>
                                <div className="w-[40px] border-t border-muted-foreground"></div>
                                <p className="text-xs">
                                    <span className="font-semibold">{testimonial.author}</span>
                                    <i className="text-gray-500">{testimonial.position}</i>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </ section>
        </div >
    );
}

export default Home;
