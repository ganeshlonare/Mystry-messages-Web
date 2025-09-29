"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Eye, EyeOff, Mail, User, Lock, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  const { status } = useAuthRedirect();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });
  
  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/sign-up', data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${data.username}`);
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        {/* Back Arrow */}
        <div className="absolute top-0 left-0">
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-black transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
        
        <div className="text-center mb-8 mt-12">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <MessageCircle className="h-8 w-8 text-black" />
            <span className="text-2xl font-bold text-black">MystryMsg</span>
          </Link>
          <div className="inline-block mb-4">
            <Sparkles className="h-12 w-12 text-black mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
          <p className="text-gray-600">Join the mystery messaging revolution</p>
        </div>

        <div className="bg-gray-100 rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-black flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Username</span>
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  {...register("username")}
                  className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                />
              </div>
              {errors.username && (
                <p className="text-red-600 text-sm">{errors.username.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-black flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Password</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password.message as string}</p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg rounded-xl"
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/signin" className="text-black hover:text-gray-800 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>

       
      </div>
    </div>
  );
}
