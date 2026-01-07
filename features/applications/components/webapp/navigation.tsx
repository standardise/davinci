"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/features/auth/context/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Share2, Command, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { GetApp } from "../../api";

interface WebAppNavbarProps {
  appId: string;
}

export function Navbar({ appId }: WebAppNavbarProps) {
  const { user, logout } = useAuth();
  const [appName, setAppName] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch ชื่อ App มาแสดงเป็น Logo
  useEffect(() => {
    if (appId) {
      GetApp(appId)
        .then(({ data }) => {
          setAppName(data.name);
        })
        .finally(() => setLoading(false));
    }
  }, [appId]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* --- 1. App Brand (Product Logo) --- */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {/* ใช้ Icon Generic หรือ Logo ของ App ถ้ามี */}
              <Command className="w-4 h-4" />
            </div>
            {loading ? (
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            ) : (
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                {appName}
              </h1>
            )}
          </div>
          {/* Optional: Version Badge */}
          {!loading && (
            <Badge
              variant="secondary"
              className="text-[10px] h-5 px-1.5 font-normal"
            >
              v1.0
            </Badge>
          )}
        </div>

        {/* --- 2. Right Actions --- */}
        <div className="flex items-center gap-2">
          {/* Share Button (Feature ยอดฮิตของ Product) */}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex gap-2 rounded-full h-9"
            onClick={handleShare}
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span className="text-xs">{isCopied ? "Copied" : "Share"}</span>
          </Button>

          <div className="h-4 w-px bg-border mx-2 hidden sm:block" />

          <ModeToggle />

          {/* User Profile */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-muted/50 transition-colors ml-1 outline-none">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                    {user.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar_url}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">
                        {user.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <UserIcon className="mr-2 h-4 w-4" /> Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
                {/* Powered by footer */}
                <div className="px-2 py-2 mt-1 border-t text-[10px] text-muted-foreground text-center">
                  Powered by Davinci
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild className="rounded-full">
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
