import React, { useContext, useEffect, useRef, useState } from 'react';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';
import { useNavigate, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
    const { search, setSearch } = useContext(ShopContext);
    const navigate = useNavigate();

    // Visibility state for highlight section
    const [isHighlightVisible, setIsHighlightVisible] = useState(false);
    const highlightRef = useRef(null);

    // Clear search when arriving at Home
    useEffect(() => {
        setSearch('');
    }, [setSearch]);

    // Navigate to collection if search is typed from Home
    useEffect(() => {
        if (search.trim() !== '') {
            navigate('/collection');
        }
    }, [search, navigate]);

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    // Show "Today's Highlight" on scroll using IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsHighlightVisible(true);
                    observer.disconnect(); // Only trigger once
                }
            },
            { threshold: 0.2 }
        );

        if (highlightRef.current) {
            observer.observe(highlightRef.current);
        }

        return () => {
            if (highlightRef.current) {
                observer.unobserve(highlightRef.current);
            }
        };
    }, []);

    return (
        <div>
            <Hero />
            <LatestCollection />
            <BestSeller />

            {/* --- Shop the Look Section --- */}
            <div className="my-16 px-4" ref={highlightRef}>
                {isHighlightVisible && (
                    <>
                        <h2 className="text-center text-3xl font-medium mb-6" data-aos="fade-up">
                            ✨ Today's Highlight ✨
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" data-aos="fade-up">
                            {[assets.hero_img, assets.hero_img_2, assets.hero_img, assets.hero_img_2].map((img, i) => (
                                <Link
                                    to="/product/680b4e8e5ed0ad3774d0ba1e"
                                    key={i}
                                    className="relative group overflow-hidden rounded-2xl shadow-lg"
                                    data-aos="zoom-in"
                                    data-aos-delay={i * 150}
                                >
                                    <img
                                        src={img}
                                        alt={`Gallery ${i}`}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500 ease-in-out"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                                        <button className="text-white border border-white px-4 py-2 rounded-full backdrop-blur-md hover:bg-white hover:text-black transition">
                                            Shop Now
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <OurPolicy />
            
        </div>
    );
};

export default Home;
