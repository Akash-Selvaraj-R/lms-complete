"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layouts/admin-layout"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookCheck, BookPlus, Calendar, Search, User } from "lucide-react"
import { checkAuth } from "@/lib/auth"
import { getAllIssues, returnBook, issueBook } from "@/lib/issues"
import { getAllBooks } from "@/lib/books"
import { getAllUsers } from "@/lib/users"

type Issue = {
  id: string
  bookId: string
  userId: string
  issueDate: string
  returnDate: string | null
  book: {
    title: string
  }
  user: {
    name: string
  }
}

type Book = {
  id: string
  title: string
  isAvailable: boolean
}

type AppUser = {
  id: string
  name: string
  role: string
}

export default function AdminIssues() {
  const router = useRouter()
  const [issues, setIssues] = useState<Issue[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false)
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null)
  const [formData, setFormData] = useState({
    bookId: "",
    userId: "",
  })

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const user = await checkAuth()
        if (!user || user.role !== "admin") {
          router.push("/login?role=admin")
          return
        }

        const [issuesData, booksData, usersData] = await Promise.all([getAllIssues(), getAllBooks(), getAllUsers()])

        setIssues(issuesData)
        setBooks(booksData)
        setUsers(usersData.filter((user) => user.role === "user"))
        setIsLoading(false)
      } catch (error) {
        router.push("/login?role=admin")
      }
    }

    checkUserAuth()
  }, [router])

  const filteredIssues = issues.filter(
    (issue) =>
      issue.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const availableBooks = books.filter((book) => book.isAvailable)

  const handleIssueBook = async () => {
    try {
      const newIssue = await issueBook(formData.bookId, formData.userId)
      setIssues([...issues, newIssue])

      // Update book availability
      setBooks(books.map((book) => (book.id === formData.bookId ? { ...book, isAvailable: false } : book)))

      setIsIssueDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to issue book:", error)
    }
  }

  const handleReturnBook = async () => {
    if (!currentIssue) return

    try {
      const updatedIssue = await returnBook(currentIssue.id)

      setIssues(issues.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue)))

      // Update book availability
      setBooks(books.map((book) => (book.id === currentIssue.bookId ? { ...book, isAvailable: true } : book)))

      setIsReturnDialogOpen(false)
    } catch (error) {
      console.error("Failed to return book:", error)
    }
  }

  const openReturnDialog = (issue: Issue) => {
    setCurrentIssue(issue)
    setIsReturnDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      bookId: "",
      userId: "",
    })
    setCurrentIssue(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-400">Loading issues...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Manage Issues
          </h1>
          <Button
            onClick={() => setIsIssueDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={availableBooks.length === 0}
          >
            <BookPlus className="mr-2 h-4 w-4" />
            Issue New Book
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by book title or user name..."
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
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Issue Date</TableHead>
                <TableHead className="text-gray-300">Return Date</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.length === 0 ? (
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    No issues found. Issue a new book to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredIssues.map((issue) => (
                  <TableRow key={issue.id} className="border-gray-700 hover:bg-gray-800">
                    <TableCell className="font-medium text-gray-200">{issue.book.title}</TableCell>
                    <TableCell className="text-gray-300">{issue.user.name}</TableCell>
                    <TableCell className="text-gray-300">{formatDate(issue.issueDate)}</TableCell>
                    <TableCell className="text-gray-300">
                      {issue.returnDate ? formatDate(issue.returnDate) : "-"}
                    </TableCell>
                    <TableCell>
                      {issue.returnDate ? (
                        <Badge className="bg-green-600 hover:bg-green-700">Returned</Badge>
                      ) : (
                        <Badge className="bg-yellow-600 hover:bg-yellow-700">Issued</Badge>
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

      {/* Issue Book Dialog */}
      <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
        <DialogContent className="bg-gray-900 border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-200">Issue New Book</DialogTitle>
            <DialogDescription className="text-gray-400">Select a book and user to issue a book.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="book" className="text-sm font-medium text-gray-300 flex items-center">
                <BookPlus className="mr-2 h-4 w-4 text-purple-400" />
                Book
              </label>
              <Select value={formData.bookId} onValueChange={(value) => setFormData({ ...formData, bookId: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a book" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {availableBooks.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No books available
                    </SelectItem>
                  ) : (
                    availableBooks.map((book) => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="user" className="text-sm font-medium text-gray-300 flex items-center">
                <User className="mr-2 h-4 w-4 text-purple-400" />
                User
              </label>
              <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-purple-400" />
                Issue Date
              </label>
              <div className="bg-gray-800 border border-gray-700 rounded-md p-2 text-gray-300">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsIssueDialogOpen(false)
                resetForm()
              }}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleIssueBook}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!formData.bookId || !formData.userId}
            >
              Issue Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Book Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent className="bg-gray-900 border-cyan-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-200">Return Book</DialogTitle>
            <DialogDescription className="text-gray-400">Confirm the return of this book.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentIssue && (
              <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                <p className="text-gray-300">
                  <span className="font-medium">Book:</span> {currentIssue.book.title}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">User:</span> {currentIssue.user.name}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Issue Date:</span> {formatDate(currentIssue.issueDate)}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Return Date:</span>{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
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
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
