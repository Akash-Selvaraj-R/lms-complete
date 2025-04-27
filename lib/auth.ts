import bcrypt from "bcryptjs"

// Mock user data for development
const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "admin",
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user",
  },
]

// Mock session storage
let currentUser: any = null

export async function login(email: string, password: string) {
  try {
    // In a real app, this would query the database
    const user = mockUsers.find((u) => u.email === email)

    if (!user) {
      throw new Error("User not found")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error("Invalid password")
    }

    // Store user in session (in a real app, this would set cookies/JWT)
    currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    return currentUser
  } catch (error) {
    throw error
  }
}

export async function register(name: string, email: string, password: string) {
  try {
    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)

    if (existingUser) {
      throw new Error("User already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user (in a real app, this would insert into the database)
    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role
    }

    mockUsers.push(newUser)

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }
  } catch (error) {
    throw error
  }
}

export async function logout() {
  // Clear the current user (in a real app, this would clear cookies/JWT)
  currentUser = null
  return true
}

export async function checkAuth() {
  // In a real app, this would verify JWT or session cookie
  if (!currentUser) {
    throw new Error("Not authenticated")
  }

  return currentUser
}

export async function getUserById(id: string) {
  // In a real app, this would query the database
  const user = mockUsers.find((u) => u.id === id)

  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}
