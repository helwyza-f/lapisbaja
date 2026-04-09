// components/public/layout/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Trainings", href: "/trainings" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex flex-col group">
          <span className="text-xl md:text-2xl font-black text-slate-950 leading-none tracking-tighter uppercase italic">
            Lapis Baja<span className="text-primary">.</span>
          </span>
          <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
            Inspektindo Batam
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-[13px] font-black uppercase tracking-[0.15em] transition-all duration-300 hover:text-primary py-2 group",
                pathname === link.href ? "text-primary" : "text-slate-600",
              )}
            >
              {link.name}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-[2px] bg-primary rounded-full transition-all duration-300",
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full",
                )}
              />
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link
            href="/login"
            className="hidden lg:block text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            Admin
          </Link>

          <Button
            size="lg"
            className="bg-primary hover:bg-orange-600 text-white font-black uppercase text-[10px] md:text-xs tracking-widest rounded-full px-5 md:px-8 h-10 md:h-12 shadow-lg shadow-orange-500/10"
            asChild
          >
            <Link href="/contact">Contact</Link>
          </Button>

          {/* Mobile Menu Toggle - Clean Circle */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-900 bg-slate-50 rounded-full border border-slate-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Full Width & Clean */}
      <div
        className={cn(
          "lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 transition-all duration-300 ease-in-out origin-top",
          isOpen
            ? "scale-y-100 opacity-100 visible"
            : "scale-y-0 opacity-0 invisible",
        )}
      >
        <nav className="p-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between px-4 py-4 text-sm font-black uppercase tracking-[0.15em] rounded-xl transition-colors",
                pathname === link.href
                  ? "bg-orange-50 text-primary"
                  : "text-slate-600 active:bg-slate-50",
              )}
            >
              {link.name}
              {pathname === link.href && (
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}

          <div className="pt-6 pb-2 grid grid-cols-2 gap-4 px-4">
            <Button
              variant="outline"
              className="rounded-full font-black uppercase tracking-widest text-[9px] border-slate-200"
              asChild
            >
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Admin
              </Link>
            </Button>
            <Button
              className="rounded-full font-black uppercase tracking-widest text-[9px] bg-slate-900"
              asChild
            >
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                Help Center
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
