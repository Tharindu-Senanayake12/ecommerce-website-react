import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from './context/ShopContext';
import SizeChartPopup from './components/SizeChartPopup';

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Tops from './pages/Tops';
import Navbar from './components/Navbar';
import Dresses from './pages/Dresses';
import Shorts from './pages/Shorts';
import Skirts from './pages/Skirts';
import Denim from './pages/Denim';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import Pants from './pages/Pants';
import { ToastContainer } from 'react-toastify';
import Chatbot from './components/Chatbot';

const App = () => {
  const { showSizeChart, setShowSizeChart } = useContext(ShopContext);

  // State to control visibility of scroll-to-top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show button if scrolled down 300px
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll smoothly to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] relative">
      <ToastContainer />
      <Navbar />
      <SearchBar />

      {showSizeChart && <SizeChartPopup onClose={() => setShowSizeChart(false)} />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/tops' element={<Tops />} />
        <Route path='/dresses' element={<Dresses />} />
        <Route path='/shorts' element={<Shorts />} />
        <Route path='/skirts' element={<Skirts />} />
        <Route path='/denim' element={<Denim />} />
        <Route path='/pants' element={<Pants />} />
      </Routes>
      <Footer />
      <Chatbot />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="
            fixed bottom-[100px] right-6 z-50 
            bg-black text-white p-3 rounded-full 
            shadow-lg hover:bg-gray-800 
            transition
            flex items-center justify-center
            w-12 h-12
          "
          title="Scroll to top"
        >
          {/* Simple Up Arrow SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;
