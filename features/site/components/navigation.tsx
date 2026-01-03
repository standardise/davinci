"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Use Cases", href: "/#use-cases" },
    { name: "Company", href: "/#company" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/50 backdrop-blur-xl border-b border-white/5 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">
                Davinci.
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* CTA Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white hover:bg-white/5"
                asChild
              >
                <Link href={"/signin"}>Sign in</Link>
              </Button>
              <Button className="bg-white text-black hover:bg-zinc-200 rounded-full px-6 font-medium transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-zinc-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-24 px-6 md:hidden animate-in slide-in-from-top-10 duration-200">
          <div className="flex flex-col space-y-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-medium text-zinc-300 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <hr className="border-zinc-800" />
            <div className="flex flex-col gap-4 pt-4">
              <Button
                variant="outline"
                className="w-full border-zinc-800 text-white hover:bg-zinc-800"
              >
                Log in
              </Button>
              <Button className="w-full bg-white text-black hover:bg-zinc-200">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
