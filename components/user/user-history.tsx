"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Issue = {
  id: string
  bookId: string
  issueDate: string
  returnDate: string | null
  book: {
    title: string
    author: string
  }
}

interface UserHistoryProps {
  issues: Issue[]
}

export function UserHistory({ issues }: UserHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculateDueDate = (issueDate: string) => {
    const date = new Date(issueDate)
    date.setDate(date.getDate() + 14) // 14 days loan period
    return date
  }

  const isOverdue = (issueDate: string) => {
    const dueDate = calculateDueDate(issueDate)
    return dueDate < new Date() ? true : false
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">No borrowing history found. Borrow a book to get started.</div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-700 hover:bg-gray-800">
          <TableHead className="text-gray-300">Book</TableHead>
          <TableHead className="text-gray-300">Author</TableHead>
          <TableHead className="text-gray-300">Issue Date</TableHead>
          <TableHead className="text-gray-300">Due Date</TableHead>
          <TableHead className="text-gray-300">Return Date</TableHead>
          <TableHead className="text-gray-300">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id} className="border-gray-700 hover:bg-gray-800">
            <TableCell className="font-medium text-gray-200">{issue.book.title}</TableCell>
            <TableCell className="text-gray-300">{issue.book.author}</TableCell>
            <TableCell className="text-gray-300">{formatDate(issue.issueDate)}</TableCell>
            <TableCell className="text-gray-300">
              {formatDate(calculateDueDate(issue.issueDate).toISOString())}
            </TableCell>
            <TableCell className="text-gray-300">{issue.returnDate ? formatDate(issue.returnDate) : "-"}</TableCell>
            <TableCell>
              {issue.returnDate ? (
                <Badge className="bg-green-600 hover:bg-green-700">Returned</Badge>
              ) : isOverdue(issue.issueDate) ? (
                <Badge className="bg-red-600 hover:bg-red-700">Overdue</Badge>
              ) : (
                <Badge className="bg-yellow-600 hover:bg-yellow-700">Borrowed</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
