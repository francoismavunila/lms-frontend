"use client"

import { useState } from 'react';
import Link from 'next/link';
import { HomeIcon, PhoneIcon, UserIcon, MapPinIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Contact() {
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
                { href: "/about", icon: PhoneIcon, text: "About" },
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
        style={{ backgroundImage: 'url(/contact/contact_bg.jpg)' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        <div className="text-center bg-black/60 p-12 rounded-2xl backdrop-blur-sm relative z-10 border border-white/10 shadow-2xl">
          <h1 className="text-4xl md:text-4xl font-bold text-white">
            <span className="text-white block mb-4">Contact</span>
            <span className="text-white text-5xl md:text-7xl bg-clip-text animate-fade-in">Get in Touch</span>
          </h1>
        </div>
      </section>

      <section className="contact-content py-16 px-4 -mt-32 relative z-20">
        <div className="container mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-8 border-b-2 border-primary pb-2 tracking-tight">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors">
                      <MapPinIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-gray-600">Lupane State University, Main Campus</p>
                      <p className="text-gray-600">Lupane, Zimbabwe</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors">
                      <EnvelopeIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">library@lsu.ac.zw</p>
                      <p className="text-gray-600">support@lsu.ac.zw</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="bg-gray-50 p-3 rounded-lg group-hover:bg-gray-100 transition-colors">
                      <ClockIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Working Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 8:00 AM - 8:00 PM</p>
                      <p className="text-gray-600">Saturday: 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8 border-b-2 border-primary pb-2 tracking-tight">Send us a Message</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow h-32"
                      placeholder="Your message..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
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