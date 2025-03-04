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

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background py-3">
      <div className="container flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center">
          <Link href="/" className="font-bold text-lg tracking-tight">
            arkitect™
          </Link>
        </div>

        {/* Center Navigation - Rounded Black Background */}
        <div className="hidden md:block">
          <NavigationMenu className="mx-auto">
            <NavigationMenuList className="bg-black text-white rounded-full px-4 py-2 flex space-x-1">
              <NavigationMenuItem>
                <Link href="/projects" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-gray-800",
                    "focus:outline-none focus:bg-gray-800"
                  )}>
                    Projects
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/services" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-gray-800",
                    "focus:outline-none focus:bg-gray-800"
                  )}>
                    Services
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-gray-800",
                    "focus:outline-none focus:bg-gray-800"
                  )}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/pages" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-gray-800",
                    "focus:outline-none focus:bg-gray-800"
                  )}>
                    Pages
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 flex items-center justify-center bg-white text-black hover:bg-gray-200">
                  <span className="text-sm font-bold">+</span>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Social Icons */}
          <Link href="/twitter" className="text-gray-700 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </Link>
          <Link href="/facebook" className="text-gray-700 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </Link>
          <Link href="/instagram" className="text-gray-700 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="rounded-full px-4">
              Log In
            </Button>
            <Button variant="default" size="sm" className="rounded-full px-4 bg-black hover:bg-gray-800">
              Get Started
            </Button>
          </div>

          {/* User Avatar */}
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle mobile menu</span>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="container py-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link href="/projects"
              className="px-2 py-1 text-lg hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Separator />
            <Link href="/services"
              className="px-2 py-1 text-lg hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link href="/about"
              className="px-2 py-1 text-lg hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link href="/pages"
              className="px-2 py-1 text-lg hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pages
            </Link>
            <Separator />

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" className="justify-center rounded-full">
                Log In
              </Button>
              <Button variant="default" className="justify-center rounded-full bg-black hover:bg-gray-800">
                Get Started
              </Button>
            </div>

            <Separator />

            {/* Mobile Social Icons */}
            <div className="flex space-x-4 pt-2">
              <Link href="/twitter" className="text-gray-700 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              <Link href="/facebook" className="text-gray-700 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link href="/instagram" className="text-gray-700 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
