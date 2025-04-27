import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Database, Shield, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
            NeoLibrary
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A next-generation library management system with a cyberpunk aesthetic
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-900 border border-purple-500/20 rounded-lg p-8 shadow-lg shadow-purple-500/10">
            <h2 className="text-3xl font-bold mb-4 text-purple-400">Enter the Grid</h2>
            <p className="text-gray-400 mb-6">
              Access thousands of digital and physical books in our cybernetic library network. Manage your reading
              history and discover new content tailored to your preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                <Link href="/login">
                  Login <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-950/50">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
          <div className="bg-gray-900 border border-cyan-500/20 rounded-lg p-8 shadow-lg shadow-cyan-500/10">
            <h2 className="text-3xl font-bold mb-4 text-cyan-400">Admin Access</h2>
            <p className="text-gray-400 mb-6">
              System administrators can manage the entire library database, track user activity, and maintain the
              digital archive with advanced tools and analytics.
            </p>
            <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Link href="/login?role=admin">
                Admin Login <Shield className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-900 border border-pink-500/20 rounded-lg p-6 shadow-lg shadow-pink-500/10">
            <BookOpen className="h-10 w-10 text-pink-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-pink-400">Digital Library</h3>
            <p className="text-gray-400">
              Access thousands of books across multiple genres and formats, all organized in our state-of-the-art
              digital catalog system.
            </p>
          </div>
          <div className="bg-gray-900 border border-blue-500/20 rounded-lg p-6 shadow-lg shadow-blue-500/10">
            <Users className="h-10 w-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-blue-400">User Management</h3>
            <p className="text-gray-400">
              Comprehensive user management with role-based access control and personalized reading recommendations.
            </p>
          </div>
          <div className="bg-gray-900 border border-green-500/20 rounded-lg p-6 shadow-lg shadow-green-500/10">
            <Database className="h-10 w-10 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-green-400">Tracking System</h3>
            <p className="text-gray-400">
              Advanced issue and return tracking with automated notifications and a complete history of all
              transactions.
            </p>
          </div>
        </div>

        <footer className="text-center text-gray-500 mt-20">
          <p>NeoLibrary &copy; {new Date().getFullYear()} | Cyberpunk Library Management System</p>
        </footer>
      </div>
    </div>
  )
}
