"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/features/auth/context/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navigation() {
  const { user, isLoading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Use Cases", href: "/#use-cases" },
    { name: "Company", href: "/#company" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? "backdrop-blur-xl border-b border-border bg-background/80"
            : "bg-transparent py-6"
        } ${scrolled ? "py-4" : "py-6"}`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between relative z-110">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
                <Link href={"/"} onClick={() => setMobileMenuOpen(false)}>
                  Davinci.
                </Link>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <ModeToggle />

              <Button
                className="rounded-full px-6 font-medium shadow-lg shadow-primary/20"
                asChild
              >
                <Link href={"/dashboard"}>Get Started</Link>
              </Button>

              {!isLoading && (
                <>
                  {user ? (
                    <Link href={"/dashboard/account"}>
                      <Avatar>
                        <AvatarImage src={user.avatar_url} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-primary"
                        asChild
                      >
                        <Link href={"/signin"}>Sign in</Link>
                      </Button>
                      <Button
                        className="rounded-full px-6 font-medium shadow-lg shadow-primary/20"
                        asChild
                      >
                        <Link href={"/dashboard"}>Get Started</Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="flex md:hidden items-center gap-2">
              <ModeToggle />
              <button
                className="p-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-90 bg-background md:hidden animate-in fade-in duration-300">
          <div className="flex flex-col h-full pt-32 pb-10 px-6 overflow-y-auto">
            {user && (
              <div className="mb-8 flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
                <div className="h-12 w-12 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center border border-border shrink-0">
                  {user.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold uppercase text-primary">
                      {user.name?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-lg">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-4xl font-bold text-foreground hover:text-primary transition-colors active:scale-95"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="mt-auto space-y-4 pt-10">
              {user ? (
                <Button
                  className="w-full h-14 rounded-2xl text-lg font-bold"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href={"/dasboard/account"}>
                    <UserIcon className="mr-2 h-5 w-5" /> Manage Account
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-2xl text-lg border-border"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href={"/signin"}>Sign in</Link>
                  </Button>
                  <Button
                    className="w-full h-14 rounded-2xl text-lg font-bold"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href={"/dashboard"}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
