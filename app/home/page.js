"use client"

import { useState } from 'react';
import Link from 'next/link';
import { HomeIcon, InformationCircleIcon, PhoneIcon, UserIcon, BookOpenIcon, BookmarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white text-black font-sans">
      <header className="bg-black text-white py-0 backdrop-blur-lg bg-opacity-90 fixed w-full z-50">
        <nav className="container mx-auto flex flex-wrap justify-between items-center px-4">
          <div className="flex items-center space-x-4">
            <img src="/logo.jpeg" alt="Library Logo" className="h-16 rounded-full py-1 hover:scale-105 transition-transform" />
          </div>
          <div className="flex-1 px-3">
            <span className="text-xl font-bold tracking-tight">LSU Library</span>
          </div>
          <div className="block lg:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none hover:bg-white/10 p-2 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <div className={`w-full lg:flex lg:items-center lg:w-auto ${isOpen ? 'block' : 'hidden'}`}>
            <div className="flex flex-col lg:flex-row lg:space-x-8">
              {[
                { href: "/", icon: HomeIcon, text: "Home" },
                { href: "/about", icon: InformationCircleIcon, text: "About Us" },
                { href: "/contact", icon: PhoneIcon, text: "Contact" },
                { href: "/login", icon: UserIcon, text: "Login" }
              ].map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="hover:text-secondary transition-all flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-white/10"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <section className="px-4 hero bg-cover bg-center h-screen flex items-center justify-center pt-16" style={{ backgroundImage: 'url(/carousel.jpg)' }}>
        <div className="text-center bg-black bg-opacity-50 p-8 rounded-2xl backdrop-blur-sm">
          <h1 className="text-4xl md:text-4xl font-bold text-white">
            <span className="text-white">Welcome to Lupane State University</span><br />
            <span className="text-white text-5xl md:text-7xl bg-clip-text">Library</span>
          </h1>
          <button className="mt-6 px-12 py-4 bg-secondary text-black font-semibold rounded-full border-2 border-primary hover:bg-secondary-dark transition-all duration-300 hover:scale-105 shadow-lg">
            Enter
          </button>
        </div>
      </section>

      <section className="news py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 border-b-2 border-primary pb-2 tracking-tight">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: "/ai.jpg", title: "New Books about AI", desc: "Discover the latest books on Artificial Intelligence available in our library." },
              { img: "/research.jpg", title: "Get Free Research Papers", desc: "Access a wide range of research papers for free through our library resources." },
              { img: "/reserve.jpg", title: "Reserve Your Books", desc: "You can now reserve your favorite books online and pick them up at your convenience." }
            ].map((item, index) => (
              <div key={index} className="news-item bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <div className="overflow-hidden rounded-lg">
                  <img src={item.img} alt={item.title} className="w-full h-48 object-cover rounded mb-4 group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features py-16 bg-cover bg-center px-4 relative" style={{ backgroundImage: 'url(/features_bg.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-12 border-b-2 border-primary pb-2 text-white tracking-tight">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { Icon: BookOpenIcon, title: "Easily Borrow Books", desc: "Borrow books with just a few clicks and enjoy seamless access to our vast collection." },
              { Icon: BookmarkIcon, title: "Reserve Online", desc: "Reserve your favorite books online and pick them up at your convenience." },
              { Icon: MagnifyingGlassIcon, title: "Easily Check Book Catalogues", desc: "Browse and search our extensive catalogues to find the books you need quickly and easily." }
            ].map((item, index) => (
              <div key={index} className="feature-item bg-white shadow-xl rounded-xl p-6 flex flex-col items-center hover:transform hover:scale-105 transition-all duration-300">
                <item.Icon className="w-16 h-16 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-700 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="events py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 border-b-2 border-primary pb-2 tracking-tight">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: "/new_section.jpg", title: "Opening of New Book Section", desc: "Join us for the grand opening of our new book section featuring the latest collections." },
              { img: "/portal.jpg", title: "LSU Online Portal Introduction", desc: "Learn about the new LSU online portal and how it can help you access resources more efficiently." },
              { img: "/read_share.jpg", title: "Read and Share Event", desc: "Participate in our read and share event to discuss your favorite books with fellow readers." }
            ].map((item, index) => (
              <div key={index} className="event-item bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="overflow-hidden rounded-lg">
                  <img src={item.img} alt={item.title} className="w-full h-48 object-cover rounded mb-4 group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
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