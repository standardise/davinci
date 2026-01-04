"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="company"
      className="relative bg-background pt-20 pb-10 px-4 lg:px-8 overflow-hidden transition-colors duration-300"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground tracking-tight">
                Davinci.
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-md text-lg">
              Democratizing institutional-grade forecasting. We give every
              business leader access to the same predictive intelligence as
              Fortune 500 companies.
            </p>

            <div className="pt-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">
                Incubated by
              </p>
              <a
                href="https://standardise.ltd"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-lg hover:bg-secondary hover:border-primary/30 transition-all group backdrop-blur-sm"
              >
                <span className="font-semibold text-foreground">
                  Standardise
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          <div className="bg-card/40 border border-white/10 dark:border-white/5 p-8 rounded-2xl backdrop-blur-md shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
            <h3 className="text-xl font-bold mb-6 text-card-foreground relative z-10">
              Get in Touch
            </h3>
            <form className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Name"
                  className="bg-background/50 border-border focus:border-primary/50 focus:ring-primary/20 text-foreground"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-background/50 border-border focus:border-primary/50 focus:ring-primary/20 text-foreground"
                />
              </div>
              <Textarea
                placeholder="How can we help?"
                rows={3}
                className="bg-background/50 border-border focus:border-primary/50 focus:ring-primary/20 text-foreground resize-none"
              />
              <Button className="bg-primary text-primary-foreground hover:opacity-90 rounded-full w-full font-bold shadow-lg shadow-primary/10 transition-all">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground flex flex-col md:flex-row items-center gap-2 md:gap-6 font-medium">
            <span>© 2026 Davinci Inc.</span>
            <span className="hidden md:inline w-1 h-1 bg-border rounded-full" />
            <span>A Project of Standardise</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Legal Links */}
            <div className="flex gap-6 text-sm text-muted-foreground font-medium">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 border-l border-border pl-6 ml-2">
              <a
                href="#"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-foreground transition-colors transform hover:scale-110"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-blue-400 transition-colors transform hover:scale-110"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-blue-600 transition-colors transform hover:scale-110"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
