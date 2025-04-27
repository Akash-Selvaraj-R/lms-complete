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
import { MoreVertical, Search, Shield, Trash2, UserPlus } from "lucide-react"
import { checkAuth } from "@/lib/auth"
import { getAllUsers, addUser, deleteUser, promoteUser } from "@/lib/users"

type User = {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  })

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const user = await checkAuth()
        if (!user || user.role !== "admin") {
          router.push("/login?role=admin")
          return
        }

        const usersData = await getAllUsers()
        setUsers(usersData)
        setIsLoading(false)
      } catch (error) {
        router.push("/login?role=admin")
      }
    }

    checkUserAuth()
  }, [router])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddUser = async () => {
    try {
      const newUser = await addUser(formData.name, formData.email, formData.password, formData.role)

      setUsers([...users, newUser])
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to add user:", error)
    }
  }

  const handleDeleteUser = async () => {
    if (!currentUser) return

    try {
      await deleteUser(currentUser.id)
      setUsers(users.filter((user) => user.id !== currentUser.id))
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  const handlePromoteUser = async () => {
    if (!currentUser) return

    try {
      const updatedUser = await promoteUser(currentUser.id)
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
      setIsPromoteDialogOpen(false)
    } catch (error) {
      console.error("Failed to promote user:", error)
    }
  }

  const openDeleteDialog = (user: User) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const openPromoteDialog = (user: User) => {
    setCurrentUser(user)
    setIsPromoteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
    })
    setCurrentUser(null)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-400">Loading users...</p>
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
            Manage Users
          </h1>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 bg-gray-800 border-gray-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-gray-900 border border-purple-500/20 rounded-lg shadow-lg shadow-purple-500/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800">
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                    No users found. Add a new user to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800">
                    <TableCell className="font-medium text-gray-200">{user.name}</TableCell>
                    <TableCell className="text-gray-300">{user.email}</TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge className="bg-purple-600 hover:bg-purple-700">Admin</Badge>
                      ) : (
                        <Badge className="bg-blue-600 hover:bg-blue-700">User</Badge>
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
                          {user.role === "user" && (
                            <DropdownMenuItem
                              onClick={() => openPromoteDialog(user)}
                              className="text-purple-400 focus:bg-purple-900/50 focus:text-purple-300"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Promote to Admin
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(user)}
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

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-900 border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-200">Add New User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the details of the new user to add to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Name
              </label>
              <Input
                id="name"
                placeholder="Full name"
                className="bg-gray-800 border-gray-700 text-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                className="bg-gray-800 border-gray-700 text-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="bg-gray-800 border-gray-700 text-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Role</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === "user"}
                    onChange={() => setFormData({ ...formData, role: "user" })}
                    className="text-purple-600"
                  />
                  <span className="text-gray-300">User</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={() => setFormData({ ...formData, role: "admin" })}
                    className="text-purple-600"
                  />
                  <span className="text-gray-300">Admin</span>
                </label>
              </div>
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
              onClick={handleAddUser}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!formData.name || !formData.email || !formData.password}
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-red-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-200">Delete User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentUser && (
              <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                <p className="text-gray-300">
                  <span className="font-medium">Name:</span> {currentUser.name}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Email:</span> {currentUser.email}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Role:</span> {currentUser.role}
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
            <Button onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700 text-white">
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promote User Dialog */}
      <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <DialogContent className="bg-gray-900 border-purple-500/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-200">Promote to Admin</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to promote this user to admin? They will have full access to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentUser && (
              <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                <p className="text-gray-300">
                  <span className="font-medium">Name:</span> {currentUser.name}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Email:</span> {currentUser.email}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Current Role:</span> {currentUser.role}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPromoteDialogOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handlePromoteUser} className="bg-purple-600 hover:bg-purple-700 text-white">
              Promote to Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
