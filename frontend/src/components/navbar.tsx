"use client"
import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className={`sticky top-0 z-50 flex w-full items-center justify-between px-6 py-6 transition-all duration-300 ${
        scrolled
          ? "bg-white border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] rounded-[32px]"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className="text-lg font-medium text-gray-400">
        arkitect<span className="text-sky-500">*</span>
      </div>

      {/* Center Navigation */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <div className="rounded-full bg-black px-6 py-2.5 shadow-lg">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
                  asChild
                >
                  <Link href="/projects">Projects</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
                  asChild
                >
                  <Link href="/services">Services</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className="text-sm font-medium text-white hover:text-gray-300 transition-colors"
                  asChild
                >
                  <Link href="/about">About</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
                  Pages
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4 bg-white">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/pages/team"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Team</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Meet our talented team members
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/pages/portfolio"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Portfolio</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View our latest work and projects
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/pages/contact"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Contact</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get in touch with our team
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* Right Side - Social Icons */}
      <div className="flex items-center gap-3">
        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-600">
          <Twitter className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-600">
          <Facebook className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-600">
          <Instagram className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
