import { db } from "./db"
import bcrypt from "bcryptjs"

export async function getAllUsers() {
  // In a real app, this would use Prisma to query the database
  return db.users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }))
}

export async function getUserById(id: string) {
  // In a real app, this would use Prisma to query the database
  const user = await db.findUserById(id)

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

export async function addUser(name: string, email: string, password: string, role = "user") {
  // Check if user already exists
  const existingUser = await db.findUserByEmail(email)

  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const newUser = await db.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  })

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  }
}

export async function deleteUser(id: string) {
  // In a real app, this would use Prisma to delete from the database
  const userIndex = db.users.findIndex((user) => user.id === id)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  // Remove user from array
  db.users.splice(userIndex, 1)

  return true
}

export async function promoteUser(id: string) {
  // In a real app, this would use Prisma to update the database
  const userIndex = db.users.findIndex((user) => user.id === id)

  if (userIndex === -1) {
    throw new Error("User not found")
  }

  // Update user role to admin
  db.users[userIndex].role = "admin"

  return {
    id: db.users[userIndex].id,
    name: db.users[userIndex].name,
    email: db.users[userIndex].email,
    role: db.users[userIndex].role,
  }
}
