import Link from "next/link";

import { getUserMeLoader } from "@/data/services/get-user-me-loader";

import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";

interface HeaderProps {
  data?: {
    logoText?: {
      id?: number;
      text?: string;
      url?: string;
    };
    ctaButton?: {
      id?: number;
      text?: string;
      url?: string;
    };
  };
}

function LoggedInUser({ userData }: { readonly userData: any }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-text-secondary dark:text-text-inverse">
        {userData.username}
      </span>
      <LogoutButton />
    </div>
  );
}

export async function Header({ data = {} }: Readonly<HeaderProps>) {
  const { logoText = {}, ctaButton = {} } = data;
  const user = await getUserMeLoader();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md dark:bg-navy-800 border-b border-navy-200 dark:border-navy-700">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <Logo text={logoText?.text || 'Tagelong'} />
        <div className="flex items-center gap-4">
          {user.ok ? (
            <LoggedInUser userData={user.data} />
          ) : (
            <Link href={ctaButton?.url || '/signin'}>
              <Button>{ctaButton?.text || 'Sign In'}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
