"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { link: "/", label: "Home" },
  { link: "/puzzle/create", label: "Create" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4">
      {links.map(({ link, label }) => (
        <Link
          key={label}
          href={link}
          className={`${
            pathname === link ? "text-black-500" : "text-blue-500"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
