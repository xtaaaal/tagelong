"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if this is an OAuth callback
    const accessToken = searchParams.get('access_token');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      router.push('/signin?error=oauth_error');
      return;
    }

    if (accessToken) {
      // Set JWT cookie
      document.cookie = `jwt=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure=${process.env.NODE_ENV === 'production'}`;
      
      // Redirect to dashboard
      router.push('/dashboard');
      return;
    }

    // If no OAuth parameters, redirect to home
    router.push('/');
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
        <p className="text-text-muted">Processing authentication...</p>
      </div>
    </div>
  );
}
