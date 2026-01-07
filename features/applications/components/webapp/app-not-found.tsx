import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX, ArrowLeft } from "lucide-react";

export function AppNotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6 rounded-full bg-muted p-6 ring-1 ring-border">
        <SearchX className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        App Not Found
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The application you are looking for does not exist or has been deleted.
        Please check the URL or contact the owner.
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
