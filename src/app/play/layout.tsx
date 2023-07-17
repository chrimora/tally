"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { name: "game", href: "/play/game" },
  { name: "history", href: "/play/history" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <div className="bg-accent-light dark:bg-accent-dark">
        <div className="max-w-screen-sm mx-auto flex py-3">
          <div className="w-20 flex shrink-0 justify-center items-center">
            <Link href="/" className="block">
              <Image
                src="/tally/logo.png"
                alt="tally logo"
                height="40"
                width="40"
              />
            </Link>
          </div>
          <div className="grow flex gap-2 justify-center">
            {navigation.map((link) => {
              return (
                <Link
                  className={`p-3 text-lg ${
                    pathname.endsWith(link.href) // Active link
                      ? "border-b-2"
                      : "hover:border-b-2"
                  }`}
                  href={link.href}
                  key={link.name}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="flex-none w-20"></div>
        </div>
      </div>
      <div className="max-w-screen-sm mx-auto text-center p-8">{children}</div>
    </>
  );
}
