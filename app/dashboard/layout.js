'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { 
  Home,
  BookOpen,
  Bookmark,
  ClipboardList,
  Settings,
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Book,
  Clock,
  History
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('lms_authToken');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const response = await fetch(`${backend_url}/api/v1/users/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error('Failed to fetch user data');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      }
    };

    fetchUser();
  }, [router, backend_url]);

  const handleLogout = () => {
    localStorage.removeItem('lms_authToken');
    router.push('/login');
  };

  // Role-based menu items
  const getMenuItems = (role) => {
    const adminMenuItems = [
      { href: '/dashboard', icon: Home, label: 'Overview' },
      { href: '/dashboard/catalog', icon: BookOpen, label: 'Book Catalog' },
      { href: '/dashboard/borrow', icon: Bookmark, label: 'Borrow/Return' },
      { href: '/dashboard/inventory', icon: ClipboardList, label: 'Inventory' },
      { href: '/dashboard/reservations', icon: Bookmark, label: 'Reservations' },
    ];

    const studentFacultyMenuItems = [
      { href: '/dashboard', icon: Home, label: 'Overview' },
      { href: '/dashboard/catalog', icon: Book, label: 'Browse Books' },
      { href: '/dashboard/my-books', icon: BookOpen, label: 'My Books' },
      { href: '/dashboard/reservations', icon: Clock, label: 'My Reservations' },
      { href: '/dashboard/history', icon: History, label: 'Borrow History' },
    ];

    switch (role) {
      case 'admin':
        return adminMenuItems;
      case 'librarian':
        return adminMenuItems;
      case 'student':
        return studentFacultyMenuItems;
      case 'faculty':
        return studentFacultyMenuItems;
      default:
        return studentFacultyMenuItems;
    }
  };

  // Close sidebar when clicking outside on mobile
  const handleContentClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={handleContentClick}
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-black/90 text-white w-64 fixed h-full z-20 transition-transform duration-200 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center gap-2 px-4 py-6 border-b border-white/10">
          <img src="/logo.jpeg" alt="Library Logo" className="h-10 w-10 rounded-full" />
          <span className="text-xl font-bold">LSU Library</span>
        </div>
        
        {/* User info in sidebar */}
        <div className="px-4 py-4 border-b border-white/10">
          {user ? (
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full bg-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23fff"><circle cx="12" cy="12" r="12" fill="%23374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%23fff">U</text></svg>';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-300 truncate">{user.email}</p>
                <p className="text-xs text-gray-400 truncate capitalize">{user.role}</p>
              </div>
            </div>
          ) : (
            <div>Loading user info...</div>
          )}
        </div>
        
        {/* Role-based navigation */}
        <nav className="mt-6 px-2 flex-1">
          {user && getMenuItems(user.role).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors hover:bg-white/20 hover:text-white text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className="px-2 py-4 border-t border-white/10">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors hover:bg-white/20 hover:text-white text-gray-200"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors hover:bg-white/20 hover:text-white text-gray-200 w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64" onClick={handleContentClick}>
        {/* Rest of the code remains the same... */}
        <header className="bg-black/80 backdrop-blur-sm text-white h-16 fixed w-full lg:w-[calc(100%-16rem)] z-10">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <Search className="w-4 h-4 text-gray-300" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="bg-transparent border-none text-sm text-white placeholder:text-gray-300 focus:outline-none w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(!isProfileOpen);
                  }}
                  className="flex items-center gap-2 p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {user ? (
                    <>
                      <img 
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full bg-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23fff"><circle cx="12" cy="12" r="12" fill="%23374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%23fff">U</text></svg>';
                        }}
                      />
                      <ChevronDown className="w-4 h-4" />
                    </>
                  ) : (
                    <div>Loading...</div>
                  )}
                </button>
                
                {isProfileOpen && user && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-1 z-30">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Help</a>
                    <div className="border-t">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="pt-16 min-h-screen bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}