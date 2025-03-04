"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md backdrop-saturate-150 py-4 mt-1 shadow-sm">
      <div className="mx-auto px-0 flex items-center justify-between max-w-[98%]">

        {/* Logo & Brand */}
        <div className="flex items-center">
          <Link href="/" className="font-bold text-lg tracking-tight">
            artikulo™
          </Link>
        </div>


        {/* Center Navigation - Rounded Black Background */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <NavigationMenu>
            <NavigationMenuList className="bg-black/90 text-white rounded-full px-4 py-1.5 flex space-x-1 backdrop-blur-sm shadow-md">
              <NavigationMenuItem>
                <Link href="/projects" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-gray-800/90",
                    "focus:outline-none focus:bg-gray-800/90"
                  )}>
                    Blogs
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/services" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-gray-800/90",
                    "focus:outline-none focus:bg-gray-800/90"
                  )}>
                    Services
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-gray-800/90",
                    "focus:outline-none focus:bg-gray-800/90"
                  )}>
                    About Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button variant="ghost" size="icon" className="rounded-full h-7 w-7 flex items-center justify-center bg-white/90 text-black hover:bg-gray-200/90 shadow-sm">
                  <span className="text-sm font-bold">+</span>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>


        {/* Right Side Actions */}
        {/* Login Section */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Auth Buttons */}
          <div className="flex items-center space-x-1">
            <Link href="/login">
              <Button variant="outline" size="sm" className="rounded-full px-3 h-8 text-sm font-medium border-opacity-50 bg-background/30 backdrop-blur-sm shadow-sm hover:bg-background/50">
                Log In
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="default" size="sm" className="rounded-full px-3 h-8 text-sm font-medium bg-black/90 hover:bg-gray-800/90 text-white shadow-sm">
                Get Started
              </Button>
            </Link>
          </div>


          {/* User Avatar */}
          <Avatar className="h-8 w-8 cursor-pointer border-2 border-muted/50 shadow-sm">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>


          {/* Theme Toggle */}
          <ModeToggle />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-3 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden bg-background/30 backdrop-blur-sm hover:bg-background/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle mobile menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="mx-auto px-3 py-3 md:hidden bg-background/95 backdrop-blur-md backdrop-saturate-150 mt-1 rounded-lg shadow-lg max-w-[98%]">
          <nav className="flex flex-col space-y-3">
            <Link href="/projects"
              className="px-2 py-1.5 text-base hover:bg-accent/50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Separator className="opacity-30" />
            <Link href="/services"
              className="px-2 py-1.5 text-base hover:bg-accent/50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link href="/about"
              className="px-2 py-1.5 text-base hover:bg-accent/50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link href="/pages"
              className="px-2 py-1.5 text-base hover:bg-accent/50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pages
            </Link>
            <Separator className="opacity-30" />

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 pt-1">
              <Button variant="outline" className="justify-center rounded-full py-1.5 bg-background/30 backdrop-blur-sm hover:bg-background/50">
                Log In
              </Button>
              <Button variant="default" className="justify-center rounded-full py-1.5 bg-black/90 hover:bg-gray-800/90 shadow-sm">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
