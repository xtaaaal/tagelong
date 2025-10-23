"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { User, Menu } from "lucide-react";

export function SignInDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-text-primary border-0 rounded-lg px-3 py-2"
      >
        <Menu className="w-4 h-4" />
        <User className="w-4 h-4" />
      </Button>
      
      {isOpen && (
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
