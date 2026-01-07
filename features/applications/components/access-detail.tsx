import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6 rounded-full bg-red-500/10 p-6 ring-1 ring-red-500/20">
        <ShieldAlert className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Access Denied
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        You do not have permission to view this application. It might be
        private, or you may need to ask the owner to add you to the whitelist.
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Home
          </Link>
        </Button>
        <Button asChild>
          <Link href="/projects">Switch Account</Link>
        </Button>
      </div>
    </div>
  );
}
