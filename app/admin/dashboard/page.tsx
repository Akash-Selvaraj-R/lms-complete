"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpenCheck, BookX, Library, Users } from "lucide-react"
import { DashboardChart } from "@/components/admin/dashboard-chart"
import { RecentActivities } from "@/components/admin/recent-activities"
import { getAdminStats } from "@/lib/admin"
import { checkAuth } from "@/lib/auth"

type StatsType = {
  totalBooks: number
  availableBooks: number
  issuedBooks: number
  totalUsers: number
  recentActivities: Array<{
    id: string
    action: string
    user: string
    book: string
    date: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<StatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const user = await checkAuth()
        if (!user || user.role !== "admin") {
          router.push("/login?role=admin")
          return
        }

        const adminStats = await getAdminStats()
        setStats(adminStats)
        setIsLoading(false)
      } catch (error) {
        router.push("/login?role=admin")
      }
    }

    checkUserAuth()
  }, [router])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-400">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-purple-500/20 shadow-lg shadow-purple-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-200 flex items-center">
                <Library className="mr-2 h-5 w-5 text-purple-400" />
                Total Books
              </CardTitle>
              <CardDescription className="text-gray-400">Books in the library</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{stats?.totalBooks}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-200 flex items-center">
                <BookOpenCheck className="mr-2 h-5 w-5 text-cyan-400" />
                Available Books
              </CardTitle>
              <CardDescription className="text-gray-400">Books ready to be issued</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">{stats?.availableBooks}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-pink-500/20 shadow-lg shadow-pink-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-200 flex items-center">
                <BookX className="mr-2 h-5 w-5 text-pink-400" />
                Issued Books
              </CardTitle>
              <CardDescription className="text-gray-400">Books currently issued</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-400">{stats?.issuedBooks}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-500/20 shadow-lg shadow-green-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-200 flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-400" />
                Total Users
              </CardTitle>
              <CardDescription className="text-gray-400">Registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{stats?.totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-gray-700">
              Recent Activities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-900 border-purple-500/20 shadow-lg shadow-purple-500/10">
              <CardHeader>
                <CardTitle className="text-xl text-gray-200">Library Statistics</CardTitle>
                <CardDescription className="text-gray-400">
                  Book issue and return trends over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card className="bg-gray-900 border-purple-500/20 shadow-lg shadow-purple-500/10">
              <CardHeader>
                <CardTitle className="text-xl text-gray-200">Recent Activities</CardTitle>
                <CardDescription className="text-gray-400">Latest actions in the library system</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivities activities={stats?.recentActivities || []} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
