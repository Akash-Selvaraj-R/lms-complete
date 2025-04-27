"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserLayout } from "@/components/layouts/user-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BookOpenCheck, Search } from "lucide-react"
import { checkAuth } from "@/lib/auth"
import { getAllAvailableBooks, borrowBook } from "@/lib/books"

type Book = {
  id: string
  title: string
  author: string
  isbn: string
  isAvailable: boolean
}

export default function UserBooks() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false)
  const [currentBook, setCurrentBook] = useState<Book | null>(null)
  const [borrowSuccess, setBorrowSuccess] = useState(false)

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const user = await checkAuth()
        if (!user || user.role !== "user") {
          router.push("/login")
          return
        }

        const booksData = await getAllAvailableBooks()
        setBooks(booksData)
        setIsLoading(false)
      } catch (error) {
        router.push("/login")
      }
    }

    checkUserAuth()
  }, [router])

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const openBorrowDialog = (book: Book) => {
    setCurrentBook(book)
    setBorrowSuccess(false)
    setIsBorrowDialogOpen(true)
  }

  const handleBorrowBook = async () => {
    if (!currentBook) return

    try {
      await borrowBook(currentBook.id)
      setBorrowSuccess(true)

      // Update local state
      setBooks(books.filter((book) => book.id !== currentBook.id))

      // Don't close dialog yet, show success message
    } catch (error) {
      console.error("Failed to borrow book:", error)
    }
  }

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-400">Loading books...</p>
          </div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Browse Books
        </h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by title, author or ISBN..."
            className="pl-10 bg-gray-800 border-gray-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredBooks.length === 0 ? (
          <div className="bg-gray-900 border border-purple-500/20 rounded-lg p-8 text-center shadow-lg shadow-purple-500/10">
            <p className="text-gray-400">No books found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                className="bg-gray-900 border-purple-500/20 shadow-lg shadow-purple-500/10 flex flex-col"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-gray-200">{book.title}</CardTitle>
                    <Badge className="bg-green-600 hover:bg-green-700">Available</Badge>
                  </div>
                  <CardDescription className="text-gray-400">by {book.author}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">ISBN:</span> {book.isbn}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => openBorrowDialog(book)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <BookOpenCheck className="mr-2 h-4 w-4" />
                    Borrow Book
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Borrow Book Dialog */}
      <Dialog open={isBorrowDialogOpen} onOpenChange={setIsBorrowDialogOpen}>
        <DialogContent className="bg-gray-900 border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-200">
              {borrowSuccess ? "Book Borrowed Successfully" : "Borrow Book"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {borrowSuccess
                ? "You have successfully borrowed this book."
                : "Confirm that you want to borrow this book."}
            </DialogDescription>
          </DialogHeader>

          {!borrowSuccess ? (
            <>
              <div className="py-4">
                {currentBook && (
                  <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                    <p className="text-gray-300">
                      <span className="font-medium">Title:</span> {currentBook.title}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Author:</span> {currentBook.author}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">ISBN:</span> {currentBook.isbn}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Issue Date:</span>{" "}
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
                  onClick={() => setIsBorrowDialogOpen(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button onClick={handleBorrowBook} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Confirm Borrow
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="py-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mb-4">
                  <BookOpenCheck className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-gray-300 text-center">
                  You have successfully borrowed <span className="font-medium text-white">{currentBook?.title}</span>.
                  Please return it within 14 days.
                </p>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setIsBorrowDialogOpen(false)
                    setCurrentBook(null)
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
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
