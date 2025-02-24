import React from 'react';
import Spline from '@splinetool/react-spline/next';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Spline
        scene="https://prod.spline.design/xA6vV00qadgqNJeX/scene.splinecode"
      />
      <Footer />
    </div>
  );
};

export default LandingPage;