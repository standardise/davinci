"use client";

import GuestGuard from "@/features/auth/components/guest-guard";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <GuestGuard>{children}</GuestGuard>;
};

export default AuthLayout;
