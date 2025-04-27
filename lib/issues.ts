import { db } from "./db"

export async function getAllIssues() {
  // In a real app, this would use Prisma to query the database
  const issues = await db.findAllIssues()

  // Enrich with book and user data
  return issues.map((issue) => {
    return {
      ...issue,
      book: issue.book || { title: "Unknown Book" },
      user: issue.user || { name: "Unknown User" },
    }
  })
}

export async function getUserIssues() {
  // Get the current user (in a real app, this would come from the session)
  const currentUser = {
    id: "2", // Regular User
  }

  // In a real app, this would use Prisma to query the database
  const issues = await db.findIssuesByUserId(currentUser.id)

  // Enrich with book data
  return issues.map((issue) => {
    return {
      ...issue,
      book: issue.book || { title: "Unknown Book", author: "Unknown Author" },
    }
  })
}

export async function getIssueById(id: string) {
  // In a real app, this would use Prisma to query the database
  return db.findIssueById(id)
}

export async function issueBook(bookId: string, userId: string) {
  // Check if book exists and is available
  const book = await db.findBookById(bookId)

  if (!book) {
    throw new Error("Book not found")
  }

  if (!book.isAvailable) {
    throw new Error("Book is not available")
  }

  // Check if user exists
  const user = await db.findUserById(userId)

  if (!user) {
    throw new Error("User not found")
  }

  // Update book availability
  await db.updateBook(bookId, {
    isAvailable: false,
  })

  // Create issue record
  const issue = await db.createIssue({
    bookId,
    userId,
    book: {
      title: book.title,
      author: book.author,
    },
    user: {
      name: user.name,
    },
  })

  return issue
}

export async function returnBook(issueId: string) {
  // Find the issue
  const issue = await db.findIssueById(issueId)

  if (!issue) {
    throw new Error("Issue not found")
  }

  if (issue.returnDate) {
    throw new Error("Book already returned")
  }

  // Update issue with return date
  const updatedIssue = await db.updateIssue(issueId, {
    returnDate: new Date().toISOString(),
  })

  // Update book availability
  await db.updateBook(issue.bookId, {
    isAvailable: true,
  })

  return updatedIssue
}
