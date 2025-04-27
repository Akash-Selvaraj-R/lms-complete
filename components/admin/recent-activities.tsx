"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BookOpenCheck, BookX } from "lucide-react"

type Activity = {
  id: string
  action: string
  user: string
  book: string
  date: string
}

interface RecentActivitiesProps {
  activities: Activity[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  if (activities.length === 0) {
    return <div className="text-center py-8 text-gray-400">No recent activities found.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-700 hover:bg-gray-800">
          <TableHead className="text-gray-300">Action</TableHead>
          <TableHead className="text-gray-300">User</TableHead>
          <TableHead className="text-gray-300">Book</TableHead>
          <TableHead className="text-gray-300">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={activity.id} className="border-gray-700 hover:bg-gray-800">
            <TableCell>
              {activity.action === "issue" ? (
                <Badge className="bg-purple-600 hover:bg-purple-700 flex items-center w-fit">
                  <BookX className="mr-1 h-3 w-3" />
                  Issued
                </Badge>
              ) : (
                <Badge className="bg-cyan-600 hover:bg-cyan-700 flex items-center w-fit">
                  <BookOpenCheck className="mr-1 h-3 w-3" />
                  Returned
                </Badge>
              )}
            </TableCell>
            <TableCell className="font-medium text-gray-200">{activity.user}</TableCell>
            <TableCell className="text-gray-300">{activity.book}</TableCell>
            <TableCell className="text-gray-300">{activity.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
