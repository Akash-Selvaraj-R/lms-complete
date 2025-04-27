"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserLayout } from "@/components/layouts/user-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpenCheck, BookX, Clock } from "lucide-react"
import { BookGrid } from "@/components/user/book-grid"
import { UserHistory } from "@/components/user/user-history"
import { getUserStats } from "@/lib/user"
import { checkAuth } from "@/lib/auth"

type StatsType = {
  currentlyBorrowed: number
  totalBorrowed: number
  returningSoon: number
  availableBooks: Array<{
    id: string
    title: string
    author: string
    isbn: string
  }>
  borrowedBooks: Array<{
    id: string
    bookId: string
    issueDate: string
    returnDate: string | null
    book: {
      title: string
      author: string
    }
  }>
}

export default function UserDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<StatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const user = await checkAuth()
        if (!user || user.role !== "user") {
          router.push("/login")
          return
        }

        const userStats = await getUserStats()
        setStats(userStats)
        setIsLoading(false)
      } catch (error) {
        router.push("/login")
      }
    }

    checkUserAuth()
  }, [router])

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-400">Loading dashboard data...</p>
          </div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Your Library Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-purple-500/20 shadow-lg shadow-purple-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-200 flex items-center">
                <BookOpenCheck className="mr-2 h-5 w-5 text-purple-400" />
                Currently Borrowed
              </CardTitle>
              <CardDescription className="text-gray-400">Books you have checked out</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{stats?.currentlyBorrowed}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-200 flex items-center">
                <BookX className="mr-2 h-5 w-5 text-cyan-400" />
                Total Borrowed
              </CardTitle>
              <CardDescription className="text-gray-400">All-time borrowed books</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">{stats?.totalBorrowed}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-pink-500/20 shadow-lg shadow-pink-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-200 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-pink-400" />
                Returning Soon
              </CardTitle>
              <CardDescription className="text-gray-400">Books due in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-400">{stats?.returningSoon}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="available" className="data-[state=active]:bg-gray-700">
              Available Books
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gray-700">
              Your History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <Card className="bg-gray-900 border-purple-500/20 shadow-lg shadow-purple-500/10">
              <CardHeader>
                <CardTitle className="text-xl text-gray-200">Available Books</CardTitle>
                <CardDescription className="text-gray-400">Browse and borrow from our collection</CardDescription>
              </CardHeader>
              <CardContent>
                <BookGrid books={stats?.availableBooks || []} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-gray-900 border-purple-500/20 shadow-lg shadow-purple-500/10">
              <CardHeader>
                <CardTitle className="text-xl text-gray-200">Your Borrowing History</CardTitle>
                <CardDescription className="text-gray-400">Track your current and past borrowings</CardDescription>
              </CardHeader>
              <CardContent>
                <UserHistory issues={stats?.borrowedBooks || []} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  )
}
