"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookOpenCheck, ChevronDown, Database, LayoutDashboard, LogOut, Menu, Users } from "lucide-react"
import { checkAuth, logout } from "@/lib/auth"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await checkAuth()
        if (!userData || userData.role !== "admin") {
          router.push("/login?role=admin")
          return
        }
        setUser(userData)
      } catch (error) {
        router.push("/login?role=admin")
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Books",
      href: "/admin/books",
      icon: BookOpenCheck,
    },
    {
      name: "Issues",
      href: "/admin/issues",
      icon: Database,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
  ]

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text mr-2">
                NeoLibrary
              </h1>
              <span className="text-xs px-2 py-1 rounded bg-purple-900/50 text-purple-300 font-medium">ADMIN</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`text-sm ${
                    pathname === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  <span className="hidden sm:inline-block mr-2">{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 focus:bg-red-900/50 focus:text-red-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800">
          <nav className="container mx-auto px-4 py-3 flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm ${
                    pathname === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-red-400 hover:bg-red-900/50 hover:text-red-300"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">{children}</main>
    </div>
  )
}
