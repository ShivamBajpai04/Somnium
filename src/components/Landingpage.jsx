import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const LandingPage = () => {
    return (
        <div className="bg-[#E3E3E3] font-sans flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-10 overflow-auto">
                <spline-viewer url="https://prod.spline.design/xA6vV00qadgqNJeX/scene.splinecode"></spline-viewer>
            </div>
            <Footer />
        </div>
    );
};

export default LandingPage;
