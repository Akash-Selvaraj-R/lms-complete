import { db } from "./db"

export async function getAdminStats() {
  // In a real app, this would use Prisma to query the database

  // Get all books
  const books = await db.findAllBooks()

  // Get all users
  const users = db.users.filter((user) => user.role === "user")

  // Get all issues
  const issues = await db.findAllIssues()

  // Calculate stats
  const totalBooks = books.length
  const availableBooks = books.filter((book) => book.isAvailable).length
  const issuedBooks = totalBooks - availableBooks
  const totalUsers = users.length

  // Generate mock recent activities
  const recentActivities = [
    {
      id: "1",
      action: "issue",
      user: "Regular User",
      book: "Ready Player One",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    },
    {
      id: "2",
      action: "return",
      user: "Jane Smith",
      book: "Neuromancer",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    },
    {
      id: "3",
      action: "issue",
      user: "Jane Smith",
      book: "Snow Crash",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    },
    {
      id: "4",
      action: "return",
      user: "Regular User",
      book: "Altered Carbon",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    },
  ]

  return {
    totalBooks,
    availableBooks,
    issuedBooks,
    totalUsers,
    recentActivities,
  }
}
