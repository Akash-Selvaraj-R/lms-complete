"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ArrowLeft, UserPlus } from "lucide-react"
import { register } from "@/lib/auth"

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError("")

    try {
      await register(values.name, values.email, values.password)
      router.push("/login")
    } catch (err: any) {
      setError(err.message || "Registration failed")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Create Account
          </h1>
          <p className="text-gray-400 mt-2">Join the NeoLibrary network to access thousands of books</p>
        </div>

        <div className="bg-gray-900 border border-purple-500/20 rounded-lg p-6 shadow-lg shadow-purple-500/10">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-300 text-sm">{error}</div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="bg-gray-800 border-gray-700 text-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        className="bg-gray-800 border-gray-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-gray-800 border-gray-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-gray-800 border-gray-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
