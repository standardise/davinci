"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, CreditCard, Zap } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
        <p className="text-muted-foreground mt-1">
          Manage your plan and monitor resource consumption.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> Current Plan
              </CardTitle>
              <CardDescription>
                You are currently on the <strong>Starter</strong> plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold">Starter Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      Free forever
                    </p>
                  </div>
                </div>
                <Badge>Active</Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Training Hours</span>
                    <span className="text-muted-foreground">
                      2.5 / 10 Hours
                    </span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Storage Used</span>
                    <span className="text-muted-foreground">450 MB / 5 GB</span>
                  </div>
                  <Progress value={9} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button variant="outline" className="w-full sm:w-auto">
                Upgrade Plan
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Manage your payment details and billing address.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8 text-muted-foreground border border-dashed rounded-xl bg-muted/5">
                <div className="text-center space-y-2">
                  <CreditCard className="w-8 h-8 mx-auto opacity-50" />
                  <p>No payment method added</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button variant="outline">Add Payment Method</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-linear-to-br from-gray-900 to-gray-800 text-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Pro Plan</CardTitle>
              <CardDescription className="text-gray-300">
                For growing teams and serious data scientists.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">
                $29{" "}
                <span className="text-lg font-normal text-gray-400">/mo</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Unlimited Training Hours",
                  "50 GB Storage",
                  "Priority Support",
                  "Advanced Model Metrics",
                  "API Access",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-white text-black hover:bg-gray-100">
                Upgrade to Pro
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
