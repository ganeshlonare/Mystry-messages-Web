"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Eye, EyeOff, Mail, Lock, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function SignIn() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  const { status } = useAuthRedirect();
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both email/username and password",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        identifier: identifier.trim(),
        password: password.trim(),
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Sign In Failed",
          description: "Invalid credentials. Please check your email/username and password.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        router.replace('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: "An error occurred during sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
        
        {/* Header */}
        <div className="text-center mb-8 mt-12">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <MessageCircle className="h-8 w-8 text-black" />
            <span className="text-2xl font-bold text-black">
              MysteryMsg
            </span>
          </Link>
          <div className="inline-block mb-4">
            <Sparkles className="h-12 w-12 text-black mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your mystery messaging account</p>
        </div>

        {/* Form */}
        <div className="bg-gray-100 rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Field */}
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-black flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email or Username</span>
              </Label>
              <div className="relative">
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-black focus:ring-black"
                />
              </div>
            </div>

            {/* Password Field */}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg rounded-xl"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-black hover:text-gray-800 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-black">
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Demo Account */}
        {/* <div className="mt-8 bg-gray-100 rounded-xl p-4 border border-gray-200">
          <h3 className="text-black font-semibold mb-2 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-black" />
            Quick Start
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            New to MysteryMsg? Create an account to start receiving anonymous messages from friends and followers.
          </p>
          <Link href="/signup">
            <Button variant="outline" className="w-full border-gray-300 text-black hover:bg-gray-200">
              Create New Account
            </Button>
          </Link>
        </div> */}
      </div>
    </div>
  );
}