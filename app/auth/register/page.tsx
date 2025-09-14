"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useFormStatus } from "react-dom"
import { signup } from "../actions"
import { toast } from "sonner"

function SubmitButton() {
   const { pending } = useFormStatus()

   return (
      <Button type="submit" className="w-full" disabled={pending}>
         {pending ? "Creating account..." : "Create Account"}
      </Button>
   )
}

export default function RegisterPage() {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      role: "",
      studentId: "",
      department: "",
      section: "",
      semester: "",
   })
   const [error, setError] = useState<string | null>(null)
   const [showPassword, setShowPassword] = useState(false)
   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
   const router = useRouter()

   const [state, formAction] = useActionState(signup, { error: undefined, success: undefined })

   useEffect(() => {
      if (state.error) {
         toast.error(state.error)
      }
      if (state.success) {
         toast.success(state.success)
      }
   }, [state])

   return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
         <div className="w-full max-w-md">
            <Card>
               <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <CardDescription>Register for university permission slip access</CardDescription>
               </CardHeader>
               <CardContent>
                  <form action={formAction}>
                     <div className="flex flex-col gap-4">
                        <div className="grid gap-2">
                           <Label htmlFor="fullName">Full Name</Label>
                           <Input
                              id="fullName"
                              name="fullName"
                              type="text"
                              required
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                           />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="email">Email</Label>
                           <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="student@university.edu"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                           />
                        </div>

                        <div className="grid gap-2">
                           <Label htmlFor="studentId">Student ID</Label>
                           <Input
                              id="studentId"
                              name="studentId"
                              type="number"
                              required
                              placeholder="41230301861"
                              value={formData.studentId}
                              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                           />
                        </div>

                        <div className="grid gap-2">
                           <Label htmlFor="department">Department</Label>
                           <Select name="department" value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Select your department" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="CSE">CSE</SelectItem>
                                 <SelectItem value="EEE">EEE</SelectItem>
                                 <SelectItem value="LLB">LLB</SelectItem>
                                 <SelectItem value="PHARMACY">PHARMACY</SelectItem>
                                 <SelectItem value="BBA">BBA</SelectItem>
                                 <SelectItem value="ENGLISH">ENGLISH</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <div className="grid gap-2">
                           <Label htmlFor="section">Section</Label>
                           <Select name="section" value={formData.section} onValueChange={(value) => setFormData({ ...formData, section: value })}>
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Select your section" />
                              </SelectTrigger>
                              <SelectContent>
                                 <div className="grid grid-cols-3 gap-1 p-2">
                                    <SelectItem value="A" className="text-center">A</SelectItem>
                                    <SelectItem value="B" className="text-center">B</SelectItem>
                                    <SelectItem value="C" className="text-center">C</SelectItem>
                                    <SelectItem value="D" className="text-center">D</SelectItem>
                                    <SelectItem value="E" className="text-center">E</SelectItem>
                                    <SelectItem value="F" className="text-center">F</SelectItem>
                                    <SelectItem value="G" className="text-center">G</SelectItem>
                                    <SelectItem value="H" className="text-center">H</SelectItem>
                                    <SelectItem value="I" className="text-center">I</SelectItem>
                                    <SelectItem value="J" className="text-center">J</SelectItem>
                                    <SelectItem value="K" className="text-center">K</SelectItem>
                                 </div>
                              </SelectContent>

                           </Select>
                        </div>

                        <div className="grid gap-2">
                           <Label htmlFor="semester">Current Semester</Label>
                           <Select name="semester" value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Select your current semester" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="1st">1st Semester</SelectItem>
                                 <SelectItem value="2nd">2nd Semester</SelectItem>
                                 <SelectItem value="3rd">3rd Semester</SelectItem>
                                 <SelectItem value="4th">4th Semester</SelectItem>
                                 <SelectItem value="5th">5th Semester</SelectItem>
                                 <SelectItem value="6th">6th Semester</SelectItem>
                                 <SelectItem value="7th">7th Semester</SelectItem>
                                 <SelectItem value="8th">8th Semester</SelectItem>
                                 <SelectItem value="9th">9th Semester</SelectItem>
                                 <SelectItem value="10th">10th Semester</SelectItem>
                                 <SelectItem value="11th">11th Semester</SelectItem>
                                 <SelectItem value="12th">12th Semester</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <div className="grid gap-2">
                           <Label htmlFor="password">Password</Label>
                           <div className="relative">
                              <Input
                                 id="password"
                                 name="password"
                                 type={showPassword ? "text" : "password"}
                                 placeholder="••••••••"
                                 required
                                 value={formData.password}
                                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                 className="pr-10"
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowPassword(!showPassword)}
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                           </div>
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="confirmPassword">Confirm Password</Label>
                           <div className="relative">
                              <Input
                                 id="confirmPassword"
                                 name="confirmPassword"
                                 type={showConfirmPassword ? "text" : "password"}
                                 placeholder="••••••••"
                                 required
                                 value={formData.confirmPassword}
                                 onChange={(e) =>
                                    setFormData({
                                       ...formData,
                                       confirmPassword: e.target.value,
                                    })
                                 }
                                 className="pr-10"
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                 {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                           </div>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <SubmitButton />
                     </div>
                     <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="underline underline-offset-4">
                           Sign in
                        </Link>
                     </div>
                  </form>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}
