"use client"

import { useState } from 'react';
import Link from 'next/link';
import { HomeIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signupUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/register`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log(signupUrl)
    try {
      const response = await fetch(signupUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const dataError = response.json()
        throw new Error(dataError.detail || 'Something went wrong');
      }

      console.log(data)
      // Store the token in localStorage
      localStorage.setItem('lms_authToken', data.token);
      
      // Redirect to dashboard or home page
      router.push('/login');
      toast.success('Account created successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black font-sans min-h-screen">
      <ToastContainer />
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
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="pt-24 px-4 min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <h2 className="text-3xl font-bold mb-8 text-center">Create Account</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                  required
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-secondary text-black font-semibold py-3 px-6 rounded-lg transition-colors
                  ${loading ? 'bg-opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              <p className="text-center text-gray-600 mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-800 hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <footer className="bg-black text-white py-6 px-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Lupane State University Library
        </div>
      </footer>
    </div>
  );
}