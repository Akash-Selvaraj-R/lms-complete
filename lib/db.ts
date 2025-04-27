// This is a mock database implementation for development
// In a real app, this would use Prisma with SQLite

// Mock database tables
export const db = {
  users: [],
  books: [],
  issues: [],

  // Mock query methods
  async findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email)
  },

  async findUserById(id: string) {
    return this.users.find((user) => user.id === id)
  },

  async createUser(data: any) {
    const newUser = {
      id: String(this.users.length + 1),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(newUser)
    return newUser
  },

  async findBookById(id: string) {
    return this.books.find((book) => book.id === id)
  },

  async findAllBooks() {
    return this.books
  },

  async findAvailableBooks() {
    return this.books.filter((book) => book.isAvailable)
  },

  async createBook(data: any) {
    const newBook = {
      id: String(this.books.length + 1),
      ...data,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.books.push(newBook)
    return newBook
  },

  async updateBook(id: string, data: any) {
    const bookIndex = this.books.findIndex((book) => book.id === id)
    if (bookIndex === -1) return null

    this.books[bookIndex] = {
      ...this.books[bookIndex],
      ...data,
      updatedAt: new Date(),
    }

    return this.books[bookIndex]
  },

  async deleteBook(id: string) {
    const bookIndex = this.books.findIndex((book) => book.id === id)
    if (bookIndex === -1) return false

    this.books.splice(bookIndex, 1)
    return true
  },

  async findIssueById(id: string) {
    return this.issues.find((issue) => issue.id === id)
  },

  async findAllIssues() {
    return this.issues
  },

  async findIssuesByUserId(userId: string) {
    return this.issues.filter((issue) => issue.userId === userId)
  },

  async createIssue(data: any) {
    const newIssue = {
      id: String(this.issues.length + 1),
      ...data,
      issueDate: new Date().toISOString(),
      returnDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.issues.push(newIssue)
    return newIssue
  },

  async updateIssue(id: string, data: any) {
    const issueIndex = this.issues.findIndex((issue) => issue.id === id)
    if (issueIndex === -1) return null

    this.issues[issueIndex] = {
      ...this.issues[issueIndex],
      ...data,
      updatedAt: new Date(),
    }

    return this.issues[issueIndex]
  },
}

// Initialize with some mock data
export function seedDatabase() {
  // Add mock books
  db.books = [
    {
      id: "1",
      title: "Neuromancer",
      author: "William Gibson",
      isbn: "978-0441569595",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Snow Crash",
      author: "Neal Stephenson",
      isbn: "978-0553380958",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "Do Androids Dream of Electric Sheep?",
      author: "Philip K. Dick",
      isbn: "978-1407230016",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "4",
      title: "Altered Carbon",
      author: "Richard K. Morgan",
      isbn: "978-0345457684",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "5",
      title: "The Diamond Age",
      author: "Neal Stephenson",
      isbn: "978-0553380965",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "6",
      title: "Ready Player One",
      author: "Ernest Cline",
      isbn: "978-0307887436",
      isAvailable: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  // Add mock users
  db.users = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      password: "$2a$10$XHCgVIrNu7V3nIbj.P/YvO/BTCnW0/VQBCHQPz9.mV.pVUHOUw2Aq", // password123
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Regular User",
      email: "user@example.com",
      password: "$2a$10$XHCgVIrNu7V3nIbj.P/YvO/BTCnW0/VQBCHQPz9.mV.pVUHOUw2Aq", // password123
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "Jane Smith",
      email: "jane@example.com",
      password: "$2a$10$XHCgVIrNu7V3nIbj.P/YvO/BTCnW0/VQBCHQPz9.mV.pVUHOUw2Aq", // password123
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  // Add mock issues
  db.issues = [
    {
      id: "1",
      bookId: "6",
      userId: "2",
      issueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      returnDate: null,
      book: {
        title: "Ready Player One",
        author: "Ernest Cline",
      },
      user: {
        name: "Regular User",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
}

// Seed the database on import
seedDatabase()
