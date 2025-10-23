"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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
        </div>
      )}
    </div>
  );
}
