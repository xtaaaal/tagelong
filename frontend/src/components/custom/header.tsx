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
      <span className="text-sm text-gray-700 dark:text-gray-300">
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
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800">
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
  );
}
