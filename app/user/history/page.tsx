"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserLayout } from "@/components/layouts/user-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { BookCheck, Search } from "lucide-react"
import { checkAuth } from "@/lib/auth"
import { getUserIssues, returnBook } from "@/lib/issues"

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

export default function UserHistory() {
  const router = useRouter()
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null)
  const [returnSuccess, setReturnSuccess] = useState(false)

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const user = await checkAuth()
        if (!user || user.role !== "user") {
          router.push("/login")
          return
        }

        const issuesData = await getUserIssues()
        setIssues(issuesData)
        setIsLoading(false)
      } catch (error) {
        router.push("/login")
      }
    }

    checkUserAuth()
  }, [router])

  const filteredIssues = issues.filter(
    (issue) =>
      issue.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const openReturnDialog = (issue: Issue) => {
    setCurrentIssue(issue)
    setReturnSuccess(false)
    setIsReturnDialogOpen(true)
  }

  const handleReturnBook = async () => {
    if (!currentIssue) return

    try {
      const updatedIssue = await returnBook(currentIssue.id)
      setReturnSuccess(true)

      // Update local state
      setIssues(issues.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue)))

      // Don't close dialog yet, show success message
    } catch (error) {
      console.error("Failed to return book:", error)
    }
  }

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

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-400">Loading history...</p>
          </div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Your Borrowing History
        </h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by book title or author..."
            className="pl-10 bg-gray-800 border-gray-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-gray-900 border border-purple-500/20 rounded-lg shadow-lg shadow-purple-500/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800">
                <TableHead className="text-gray-300">Book</TableHead>
                <TableHead className="text-gray-300">Author</TableHead>
                <TableHead className="text-gray-300">Issue Date</TableHead>
                <TableHead className="text-gray-300">Due Date</TableHead>
                <TableHead className="text-gray-300">Return Date</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.length === 0 ? (
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                    No borrowing history found. Borrow a book to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredIssues.map((issue) => (
                  <TableRow key={issue.id} className="border-gray-700 hover:bg-gray-800">
                    <TableCell className="font-medium text-gray-200">{issue.book.title}</TableCell>
                    <TableCell className="text-gray-300">{issue.book.author}</TableCell>
                    <TableCell className="text-gray-300">{formatDate(issue.issueDate)}</TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(calculateDueDate(issue.issueDate).toISOString())}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {issue.returnDate ? formatDate(issue.returnDate) : "-"}
                    </TableCell>
                    <TableCell>
                      {issue.returnDate ? (
                        <Badge className="bg-green-600 hover:bg-green-700">Returned</Badge>
                      ) : isOverdue(issue.issueDate) ? (
                        <Badge className="bg-red-600 hover:bg-red-700">Overdue</Badge>
                      ) : (
                        <Badge className="bg-yellow-600 hover:bg-yellow-700">Borrowed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!issue.returnDate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReturnDialog(issue)}
                          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-300"
                        >
                          <BookCheck className="mr-2 h-4 w-4" />
                          Return
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Return Book Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent className="bg-gray-900 border-cyan-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-200">
              {returnSuccess ? "Book Returned Successfully" : "Return Book"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {returnSuccess
                ? "You have successfully returned this book."
                : "Confirm that you want to return this book."}
            </DialogDescription>
          </DialogHeader>

          {!returnSuccess ? (
            <>
              <div className="py-4">
                {currentIssue && (
                  <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                    <p className="text-gray-300">
                      <span className="font-medium">Title:</span> {currentIssue.book.title}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Author:</span> {currentIssue.book.author}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Issue Date:</span> {formatDate(currentIssue.issueDate)}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Due Date:</span>{" "}
                      {formatDate(calculateDueDate(currentIssue.issueDate).toISOString())}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Return Date:</span>{" "}
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>

                    {isOverdue(currentIssue.issueDate) && (
                      <p className="text-red-400 mt-2">
                        <span className="font-medium">Note:</span> This book is overdue. Late fees may apply.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsReturnDialogOpen(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button onClick={handleReturnBook} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  Confirm Return
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="py-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mb-4">
                  <BookCheck className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-gray-300 text-center">
                  You have successfully returned{" "}
                  <span className="font-medium text-white">{currentIssue?.book.title}</span>. Thank you for using our
                  library!
                </p>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setIsReturnDialogOpen(false)
                    setCurrentIssue(null)
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </UserLayout>
  )
}
