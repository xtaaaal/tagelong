"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

// Custom User Icon Component
function UserIcon({ className }: { className?: string }) {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <mask id="mask0_2009_1188" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="#D9D9D9"/>
      </mask>
      <g mask="url(#mask0_2009_1188)">
        <path d="M6.023 17.2923C6.873 16.6616 7.799 16.1635 8.801 15.798C9.80283 15.4327 10.8692 15.25 12 15.25C13.1308 15.25 14.1972 15.4327 15.199 15.798C16.201 16.1635 17.127 16.6616 17.977 17.2923C18.5987 16.6089 19.0912 15.8179 19.4548 14.9192C19.8183 14.0206 20 13.0475 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 13.0475 4.18175 14.0206 4.54525 14.9192C4.90875 15.8179 5.40133 16.6089 6.023 17.2923ZM12 12.75C11.0872 12.75 10.3173 12.4365 9.6905 11.8095C9.0635 11.1827 8.75 10.4128 8.75 9.5C8.75 8.58717 9.0635 7.81733 9.6905 7.1905C10.3173 6.5635 11.0872 6.25 12 6.25C12.9128 6.25 13.6827 6.5635 14.3095 7.1905C14.9365 7.81733 15.25 8.58717 15.25 9.5C15.25 10.4128 14.9365 11.1827 14.3095 11.8095C13.6827 12.4365 12.9128 12.75 12 12.75ZM12 21.5C10.6808 21.5 9.44333 21.2519 8.2875 20.7558C7.13167 20.2596 6.12625 19.5839 5.27125 18.7288C4.41608 17.8738 3.74042 16.8683 3.24425 15.7125C2.74808 14.5567 2.5 13.3192 2.5 12C2.5 10.6808 2.74808 9.44333 3.24425 8.2875C3.74042 7.13167 4.41608 6.12625 5.27125 5.27125C6.12625 4.41608 7.13167 3.74042 8.2875 3.24425C9.44333 2.74808 10.6808 2.5 12 2.5C13.3192 2.5 14.5567 2.74808 15.7125 3.24425C16.8683 3.74042 17.8738 4.41608 18.7288 5.27125C19.5839 6.12625 20.2596 7.13167 20.7558 8.2875C21.2519 9.44333 21.5 10.6808 21.5 12C21.5 13.3192 21.2519 14.5567 20.7558 15.7125C20.2596 16.8683 19.5839 17.8738 18.7288 18.7288C17.8738 19.5839 16.8683 20.2596 15.7125 20.7558C14.5567 21.2519 13.3192 21.5 12 21.5Z" fill="#666666"/>
      </g>
    </svg>
  );
}

export function SignInDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isClient) return;
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isClient]);

  // Handle Google OAuth login with NextAuth.js
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-text-primary border border-[#E4E4E4] rounded-full px-3 py-0"
      >
        <Menu className="w-4 h-4" />
        <UserIcon className="w-4 h-4" />
      </Button>
      
      {isClient && isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
          {session ? (
            // Logged in user menu
            <>
              <div className="px-4 py-2 border-b border-gray-200">
                <div className="text-sm">
                  <p className="font-medium text-text-primary">
                    {session.user?.name || 'User'}
                  </p>
                  <p className="text-gray-500 text-xs">{session.user?.email}</p>
                </div>
              </div>
              
              {/* User Menu Options */}
              <div className="py-2">
                <Link 
                  href="/saved" 
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Saved
                </Link>
                <Link 
                  href="/purchase-history" 
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Purchase History
                </Link>
                <Link 
                  href="/account" 
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Account
                </Link>
                <Link 
                  href="/planner-dashboard" 
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Planner Dashboard
                </Link>
                <Link 
                  href="/help-centre" 
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Help Centre
                </Link>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* Sign Out Button */}
              <div className="px-4 py-2">
                <Button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Log out
                </Button>
              </div>
            </>
          ) : (
            // Not logged in menu
            <>
              {/* Traditional Login Options */}
              <Link 
                href="/signin" 
                className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Log In
              </Link>
              <Link 
                href="/signup" 
                className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign up
              </Link>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* Google OAuth */}
              <div className="px-4 py-2">
                <div className="text-xs text-gray-500 text-center mb-2">Or continue with</div>
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
