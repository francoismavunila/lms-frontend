"use client"

import { useState } from 'react';
import Link from 'next/link';
import { HomeIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';

export default function About() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white text-black font-sans">
      <header className="bg-black text-white py-0 backdrop-blur-lg bg-opacity-90 fixed w-full z-50">
        <nav className="container mx-auto flex flex-wrap justify-between items-center px-4">
          <div className="flex items-center space-x-4">
            <img src="/logo.jpeg" alt="Library Logo" className="h-16 rounded-full py-1 hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="flex-1 px-3">
            <span className="text-xl font-bold tracking-tight">LSU Library</span>
          </div>
          <div className="block lg:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white focus:outline-none hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <div className={`w-full lg:flex lg:items-center lg:w-auto ${isOpen ? 'block' : 'hidden'}`}>
            <div className="flex flex-col lg:flex-row lg:space-x-8">
              {[
                { href: "/", icon: HomeIcon, text: "Home" },
                { href: "/contact", icon: PhoneIcon, text: "Contact" },
                { href: "/login", icon: UserIcon, text: "Login" }
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="hover:text-secondary transition-all flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-white/10 group"
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{item.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <section className="px-4 hero bg-cover bg-center h-screen flex items-center justify-center pt-16 relative" 
        style={{ backgroundImage: 'url(/about/about_bg.jpg)' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        <div className="text-center bg-black/60 p-12 rounded-2xl backdrop-blur-sm relative z-10 border border-white/10 shadow-2xl">
          <h1 className="text-4xl md:text-4xl font-bold text-white">
            <span className="text-white block mb-4">About Lupane State University</span>
            <span className="text-white text-5xl md:text-7xl bg-clip-text animate-fade-in">Library</span>
          </h1>
        </div>
      </section>

      <section className="about-content py-16 px-4 -mt-32 relative z-20">
        <div className="container mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 border-b-2 border-primary pb-2 tracking-tight">About Us</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Lupane State University Library is committed to providing students, faculty, and staff with access to a wide range of resources and services to support their academic and research needs. Our library offers a vast collection of books, journals, and digital resources, as well as study spaces and research assistance.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our mission is to foster a learning environment that encourages intellectual growth and discovery. We strive to provide exceptional service and resources to our community, and we are dedicated to supporting the academic success of our students and faculty.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">Our Resources</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Extensive Digital Library</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Modern Study Spaces</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Research Assistance</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>Online Catalogues</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-3">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow">
                      <div className="text-3xl font-bold text-primary">50K+</div>
                      <div className="text-sm text-gray-600">Books</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow">
                      <div className="text-3xl font-bold text-primary">24/7</div>
                      <div className="text-sm text-gray-600">Online Access</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-6 px-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Lupane State University Library
        </div>
      </footer>
    </div>
  );
}