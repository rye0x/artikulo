"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MenuIcon, PenSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/blog");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleGetStarted = () => {
    router.push("/register");
  };

  // For the UI
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md backdrop-saturate-150 py-4 mt-1 shadow-sm">
      <div className="mx-auto px-0 flex items-center justify-between max-w-[90%]">

        {/* Logo & Brand */}
        <div className="flex items-center">
          <Link href="/" className="font-bold text-lg tracking-tight">
            artikulo™
          </Link>
        </div>

        {/* Center Navigation - Rounded Black Background */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <NavigationMenu>
            <NavigationMenuList className="bg-black/90 text-white rounded-full px-4 py-1.5 flex space-x-1 backdrop-blur-sm shadow-md border border-gray-300">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/blog"
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-gray-800/90",
                      "focus:outline-none focus:bg-gray-800/90",
                      pathname === "/blog" && "bg-gray-800/90"
                    )}
                  >
                    Blogs
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/services"
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-gray-800/90",
                      "focus:outline-none focus:bg-gray-800/90",
                      pathname === "/services" && "bg-gray-800/90"
                    )}
                  >
                    Services
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/about"
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-full transition-colors hover:bg-gray-800/90",
                      "focus:outline-none focus:bg-gray-800/90",
                      pathname === "/about" && "bg-gray-800/90"
                    )}
                  >
                    About Us
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {isAuthenticated && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/blog/create">
                      <Button variant="ghost" size="icon" className="rounded-full h-7 w-7 flex items-center justify-center bg-white/90 text-black hover:bg-gray-200/90 shadow-sm">
                        <span className="text-sm font-bold">+</span>
                      </Button>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link href="/blog/create">
                <Button variant="outline" size="sm" className="rounded-full px-3 h-8 text-sm font-medium border-opacity-50 bg-background/30 backdrop-blur-sm shadow-sm hover:bg-background/50">
                  <PenSquare className="h-4 w-4 mr-1" /> Write
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow">
                    <AvatarImage
                        src={user?.avatar || "/placeholder-user.jpg"}
                        alt={user?.username || "User"}
                    />
                    <AvatarFallback className="bg-gray-300 text-gray-700">
                        {user?.username?.charAt(0) || "U"}
                    </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-2 w-48"
                >
                    <DropdownMenuLabel className="font-semibold text-gray-900 dark:text-gray-100">
                    {user?.username || "My Account"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="border-t border-gray-300 dark:border-gray-600 my-1" />

                    <DropdownMenuItem className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => router.push('/blog/my-posts')}
                    >
                    My Posts
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    Settings
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="border-t border-gray-300 dark:border-gray-600 my-1" />

                    <DropdownMenuItem
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md flex items-center text-red-600 hover:bg-red-50 dark:hover:bg-red-800 cursor-pointer"
                    >
                    <LogOut className="h-4 w-4 mr-2" /> Log Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" onClick={handleLogin} className="rounded-full px-3 h-8 text-sm font-medium border-opacity-50 bg-background/30 backdrop-blur-sm shadow-sm hover:bg-background/50">
                Log In
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleGetStarted}
                className="rounded-full px-3 h-8 text-sm font-medium bg-black hover:bg-gray-800/90 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black shadow-sm"
              >
                Get Started
              </Button>
            </div>
          )}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden p-4 bg-background/95 shadow-lg">
          <nav className="flex flex-col space-y-2">
            <Link href="/blog" className="px-3 py-2 rounded-md hover:bg-muted">Blogs</Link>
            <Link href="/services" className="px-3 py-2 rounded-md hover:bg-muted">Services</Link>
            <Link href="/about" className="px-3 py-2 rounded-md hover:bg-muted">About Us</Link>
            {isAuthenticated && (
              <Link href="/blog/create" className="px-3 py-2 rounded-md hover:bg-muted">Create Post</Link>
            )}
            <Separator className="my-2" />
            {isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout} className="justify-start">
                <LogOut className="h-4 w-4 mr-2" /> Log Out
              </Button>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button variant="outline" onClick={handleLogin} className="w-full">Log In</Button>
                <Button variant="default" onClick={handleGetStarted} className="w-full">Get Started</Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
