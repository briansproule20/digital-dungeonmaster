'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useEcho, signIn } from '../echo';

export default function Navigation() {
  const pathname = usePathname();
  const echoClient = useEcho();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Campaigns', href: '/campaigns' },
    { name: 'Heroes', href: '/heroes' },
    { name: 'Docs', href: '/docs' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await echoClient.users.getUserInfo();
        setUser(userInfo);
        
        const balanceInfo = await echoClient.balance.getBalance();
        setBalance(balanceInfo);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUser(null);
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [echoClient]);

  const signOut = () => {
    // Clear user data and redirect
    setUser(null);
    setBalance(null);
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name, email) => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/dungeonmaster-favicon.png" 
              alt="Digital Dungeonmaster Logo" 
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Digital Dungeonmaster
              </h1>
              <p className="text-xs text-gray-500">
                AI-powered RPG companion
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-8">
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-gray-900 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Section */}
            {!isLoading && (
              <div className="hidden md:flex items-center">
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    {/* Avatar Button */}
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      {getInitials(user.name, user.email)}
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'User'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>

                        {/* Balance */}
                        {balance && (
                          <div className="px-4 py-2">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                              Echo Balance
                            </div>
                            <div className="text-lg font-semibold text-green-600">
                              ${balance.balance?.toFixed(2) || '0.00'}
                            </div>
                            <div className="text-xs text-gray-400">
                              Total Spent: ${balance.totalSpent?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                        )}

                        {/* Divider */}
                        <hr className="my-1" />

                        {/* Sign Out */}
                        <button
                          onClick={signOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}