import { db } from "./db"

export async function getUserStats() {
  // Get the current user (in a real app, this would come from the session)
  const currentUser = {
    id: "2", // Regular User
  }

  // Get user's issues
  const issues = await db.findIssuesByUserId(currentUser.id)

  // Get all available books
  const availableBooks = await db.findAvailableBooks()

  // Calculate stats
  const currentlyBorrowed = issues.filter((issue) => !issue.returnDate).length
  const totalBorrowed = issues.length

  // Calculate books returning soon (due in the next 7 days)
  const now = new Date()
  const returningSoon = issues.filter((issue) => {
    if (issue.returnDate) return false // Already returned

    const issueDate = new Date(issue.issueDate)
    const dueDate = new Date(issueDate)
    dueDate.setDate(dueDate.getDate() + 14) // 14 days loan period

    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return daysUntilDue <= 7 && daysUntilDue > 0
  }).length

  // Enrich issues with book data
  const borrowedBooks = issues.map((issue) => {
    const book = db.books.find((b) => b.id === issue.bookId) || { title: "Unknown Book", author: "Unknown Author" }

    return {
      id: issue.id,
      bookId: issue.bookId,
      issueDate: issue.issueDate,
      returnDate: issue.returnDate,
      book: {
        title: book.title,
        author: book.author,
      },
    }
  })

  return {
    currentlyBorrowed,
    totalBorrowed,
    returningSoon,
    availableBooks: availableBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
    })),
    borrowedBooks,
  }
}
