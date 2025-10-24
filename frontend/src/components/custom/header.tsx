import Link from "next/link";

import { Logo } from "@/components/custom/logo";
import { SignInDropdown } from "./signin-dropdown";

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

export async function Header({ data = {} }: Readonly<HeaderProps>) {
  const { logoText = {}, ctaButton = {} } = data;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md dark:bg-navy-800 border-b border-navy-200 dark:border-navy-700">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <Logo text={logoText?.text || 'Tagelong'} />
        <div className="flex items-center gap-4">
          <SignInDropdown />
        </div>
      </div>
    </header>
  );
}
