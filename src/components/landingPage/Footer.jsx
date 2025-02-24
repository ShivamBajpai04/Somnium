import React from 'react';

const Footer = () => {
    const linkClasses = "text-sm hover:text-gray-600 cursor-pointer transition-colors duration-200";
    
    return (
        <footer className="w-full bg-[rgb(227,227,227)] text-black shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold mb-2">Company</h3>
                        <p className={linkClasses}>About Us</p>
                        <p className={linkClasses}>Our Team</p>
                        <p className={linkClasses}>Careers</p>
                        <p className={linkClasses}>Contact</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-bold mb-2">Services</h3>
                        <p className={linkClasses}>Chat Bot</p>
                        <p className={linkClasses}>Development</p>
                        <p className={linkClasses}>Consulting</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-bold mb-2">Legal</h3>
                        <p className={linkClasses}>Privacy Policy</p>
                        <p className={linkClasses}>Terms of Service</p>
                        <p className={linkClasses}>Cookie Policy</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-bold mb-2">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-black hover:text-gray-600 transform hover:scale-110 transition-transform duration-200">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-400 mt-8 pt-8 text-center">
                    <p className="text-sm text-gray-700">
                        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;