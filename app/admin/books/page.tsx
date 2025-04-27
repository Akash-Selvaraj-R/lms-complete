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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { BookPlus, Edit, MoreVertical, Search, Trash2 } from "lucide-react"
import { checkAuth } from "@/lib/auth"
import { getAllBooks, addBook, updateBook, deleteBook } from "@/lib/books"

type Book = {
  id: string
  title: string
  author: string
  isbn: string
  isAvailable: boolean
}

export default function AdminBooks() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentBook, setCurrentBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
  })

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const user = await checkAuth()
        if (!user || user.role !== "admin") {
          router.push("/login?role=admin")
          return
        }

        const booksData = await getAllBooks()
        setBooks(booksData)
        setIsLoading(false)
      } catch (error) {
        router.push("/login?role=admin")
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

  const handleAddBook = async () => {
    try {
      const newBook = await addBook(formData.title, formData.author, formData.isbn)
      setBooks([...books, newBook])
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to add book:", error)
    }
  }

  const handleEditBook = async () => {
    if (!currentBook) return

    try {
      const updatedBook = await updateBook(currentBook.id, formData.title, formData.author, formData.isbn)

      setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)))

      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to update book:", error)
    }
  }

  const handleDeleteBook = async () => {
    if (!currentBook) return

    try {
      await deleteBook(currentBook.id)
      setBooks(books.filter((book) => book.id !== currentBook.id))
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete book:", error)
    }
  }

  const openEditDialog = (book: Book) => {
    setCurrentBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (book: Book) => {
    setCurrentBook(book)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
    })
    setCurrentBook(null)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-400">Loading books...</p>
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
            Manage Books
          </h1>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
            <BookPlus className="mr-2 h-4 w-4" />
            Add New Book
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by title, author or ISBN..."
            className="pl-10 bg-gray-800 border-gray-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-gray-900 border border-purple-500/20 rounded-lg shadow-lg shadow-purple-500/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800">
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Author</TableHead>
                <TableHead className="text-gray-300">ISBN</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.length === 0 ? (
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No books found. Add a new book to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBooks.map((book) => (
                  <TableRow key={book.id} className="border-gray-700 hover:bg-gray-800">
                    <TableCell className="font-medium text-gray-200">{book.title}</TableCell>
                    <TableCell className="text-gray-300">{book.author}</TableCell>
                    <TableCell className="text-gray-300">{book.isbn}</TableCell>
                    <TableCell>
                      {book.isAvailable ? (
                        <Badge className="bg-green-600 hover:bg-green-700">Available</Badge>
                      ) : (
                        <Badge className="bg-red-600 hover:bg-red-700">Issued</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(book)}
                            className="text-gray-200 focus:bg-gray-700 focus:text-white"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(book)}
                            className="text-red-400 focus:bg-red-900/50 focus:text-red-300"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Book Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-900 border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-200">Add New Book</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details of the new book to add to the library.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-300">
                Title
              </label>
              <Input
                id="title"
                placeholder="Book title"
                className="bg-gray-800 border-gray-700 text-white"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-medium text-gray-300">
                Author
              </label>
              <Input
                id="author"
                placeholder="Author name"
                className="bg-gray-800 border-gray-700 text-white"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="isbn" className="text-sm font-medium text-gray-300">
                ISBN
              </label>
              <Input
                id="isbn"
                placeholder="ISBN number"
                className="bg-gray-800 border-gray-700 text-white"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                resetForm()
              }}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBook}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!formData.title || !formData.author || !formData.isbn}
            >
              Add Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-200">Edit Book</DialogTitle>
            <DialogDescription className="text-gray-400">Update the details of the selected book.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium text-gray-300">
                Title
              </label>
              <Input
                id="edit-title"
                placeholder="Book title"
                className="bg-gray-800 border-gray-700 text-white"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-author" className="text-sm font-medium text-gray-300">
                Author
              </label>
              <Input
                id="edit-author"
                placeholder="Author name"
                className="bg-gray-800 border-gray-700 text-white"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-isbn" className="text-sm font-medium text-gray-300">
                ISBN
              </label>
              <Input
                id="edit-isbn"
                placeholder="ISBN number"
                className="bg-gray-800 border-gray-700 text-white"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                resetForm()
              }}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditBook}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!formData.title || !formData.author || !formData.isbn}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Book Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-red-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-200">Delete Book</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this book? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
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
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteBook} className="bg-red-600 hover:bg-red-700 text-white">
              Delete Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
