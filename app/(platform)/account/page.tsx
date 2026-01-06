"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Lock,
  CreditCard,
  Bell,
  LogOut,
  Camera,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/features/auth/components/auth-guard";
import { useAuth } from "@/features/auth/context/auth-provider";

const TABS = [
  { id: "general", label: "General", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert("Profile updated successfully! (Mock)");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Account Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your profile details and account preferences.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:w-64 shrink-0 space-y-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 space-y-6">
              {/* --- TAB: GENERAL --- */}
              {activeTab === "general" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Profile Card */}
                  <div className="p-6 rounded-3xl border border-border bg-card/50 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-muted border-2 border-border overflow-hidden flex items-center justify-center">
                          {user?.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.avatar_url}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl font-bold text-muted-foreground/50">
                              {user?.name?.charAt(0) || "U"}
                            </span>
                          )}
                        </div>
                        {/* Overlay Edit Icon */}
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="text-center sm:text-left">
                        <h2 className="text-xl font-bold">{user?.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 rounded-full h-8 text-xs"
                        >
                          Change Avatar
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Edit Form */}
                  <form
                    onSubmit={handleSave}
                    className="p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          defaultValue={user?.name}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={user?.email}
                          disabled
                          className="bg-muted/50 cursor-not-allowed opacity-70"
                        />
                        <p className="text-[10px] text-muted-foreground">
                          Email cannot be changed.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="min-w-30"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm space-y-6">
                    <h3 className="text-lg font-semibold">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="current-pass">Current Password</Label>
                        <Input
                          id="current-pass"
                          type="password"
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-pass">New Password</Label>
                        <Input
                          id="new-pass"
                          type="password"
                          className="bg-background/50"
                        />
                      </div>
                      <Button variant="outline">Update Password</Button>
                    </div>
                  </div>

                  <div className="p-8 rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-red-500/10 text-red-500">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                          Delete Account
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Permanently remove your Personal Account and all of
                          its contents from the Davinci platform. This action is
                          not reversible.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="flex flex-col items-center justify-center h-64 rounded-3xl border border-border bg-card/50 border-dashed animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CreditCard className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    No active plan
                  </h3>
                  <p className="text-sm text-muted-foreground/70">
                    You are currently on the free tier.
                  </p>
                  <Button variant="outline" className="mt-4">
                    Upgrade Plan
                  </Button>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="flex flex-col items-center justify-center h-64 rounded-3xl border border-border bg-card/50 border-dashed animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    All caught up
                  </h3>
                  <p className="text-sm text-muted-foreground/70">
                    You have no new notifications.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
