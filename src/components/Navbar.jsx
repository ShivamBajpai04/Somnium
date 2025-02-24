import React from 'react';

const Navbar = () => {
    return (
        <nav className="w-[calc(100%-5rem)] mx-10 mt-4 bg-black/60 backdrop-blur-lg border border-white/20 text-white py-3 rounded-xl shadow-lg">
            <div className="container mx-auto flex items-center justify-between px-6">
                {/* Logo */}
                <div className="text-xl font-bold tracking-wide">
                    CHO-2.AI
                </div>

                {/* Navigation Links */}
                <ul className="flex text-white space-x-6 absolute left-1/2 transform -translate-x-1/2">
                    <li><a href="#home" className="hover:text-gray-400 transition">Home</a></li>
                    <li><a href="#chat" className="hover:text-gray-400 transition">Chat</a></li>
                    <li><a href="#settings" className="hover:text-gray-400 transition">Settings</a></li>
                </ul>

                {/* Login/Signup Button */}
                <button className="bg-black/60 text-white px-4 py-2 rounded-lg border border-white/20 hover:bg-gray-700 transition">
                    Login/Signup
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
