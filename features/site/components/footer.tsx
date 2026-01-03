"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="company"
      className="relative border-t border-zinc-900 bg-black pt-20 pb-10 px-4 lg:px-8 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">
                Davinci.
              </span>
            </div>

            <p className="text-zinc-400 leading-relaxed max-w-md text-lg">
              Democratizing institutional-grade forecasting. We give every
              business leader access to the same predictive intelligence as
              Fortune 500 companies.
            </p>

            <div className="pt-6">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
                Incubated by
              </p>
              <a
                href="https://standardise.ltd"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:bg-zinc-900 hover:border-zinc-700 transition-all group"
              >
                <span className="font-semibold text-white">Standardise</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          <div className="bg-zinc-900/20 border border-zinc-800/50 p-8 rounded-2xl backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 text-white">Get in Touch</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Name"
                  className="bg-zinc-950/50 border-zinc-800 focus:border-blue-500/50 focus:ring-blue-500/20 text-white"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-zinc-950/50 border-zinc-800 focus:border-blue-500/50 focus:ring-blue-500/20 text-white"
                />
              </div>
              <Textarea
                placeholder="How can we help?"
                rows={3}
                className="bg-zinc-950/50 border-zinc-800 focus:border-blue-500/50 focus:ring-blue-500/20 text-white resize-none"
              />
              <Button className="bg-white text-black hover:bg-zinc-200 rounded-full w-full font-medium">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-zinc-500 flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span>© 2026 Davinci Inc.</span>
            <span className="hidden md:inline w-1 h-1 bg-zinc-800 rounded-full" />
            <span>A Project of Standardise</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Legal Links */}
            <div className="flex gap-6 text-sm text-zinc-500">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </div>

            {/* Social Icons (Optional but nice for footer) */}
            <div className="flex gap-4 border-l border-zinc-900 pl-6 ml-2">
              <a
                href="#"
                className="text-zinc-600 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-zinc-600 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-zinc-600 hover:text-blue-600 transition-colors"
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
