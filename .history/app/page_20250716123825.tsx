'use client'
import Image from "next/image";
import { FormComponent } from "../components/reuseables/form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { useAdminAuth } from "@/hooks/useLogin"; // Adjust path as needed

export default function Home() {
  const router = useRouter();
  const [submitButtonText, setSubmitButtonText] = useState<string>('Login');
  
  // Use the admin auth hook
  const { 
    login, 
    isLoggingIn, 
    loginError, 
    isAuthenticated, 
    user 
  } = useAdminAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  // Update button text based on loading state
  useEffect(() => {
    setSubmitButtonText(isLoggingIn ? "Logging in..." : "Login");
  }, [isLoggingIn]);

  // Handle login errors
  useEffect(() => {
    if (loginError) {
      toast.error(loginError.message || "Login failed. Please try again.");
    }
  }, [loginError]);

  const fields = [
    { 
      name: "email", 
      label: "Email", 
      placeholder: "Enter your email",
      type: "email",
      isRequired: true 
    },
    { 
      name: "password", 
      label: "Password", 
      placeholder: "Enter your password",
      type: "password",
      isRequired: true 
    },
  ];

  // Enhanced input styling that should work with your FormComponent
  const formInputClassNames = 'w-full max-w-[400px] h-[52px] rounded-[12px] border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 px-4 text-gray-800 placeholder:text-gray-500 bg-white shadow-sm hover:shadow-md';
  
  // Enhanced button styling with disabled state
  const submitButtonStyle = `bg-blue-600 hover:bg-blue-700 active:bg-blue-800 w-full max-w-[400px] h-[52px] rounded-[12px] font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''}`;

  const handleSubmit = async (data: Record<string, string>): Promise<void> => {
    try {
      // Use the login function from the hook
      await login({
        email: data.email,
        password: data.password,
        // deviceId is automatically generated in the hook
      });
      
      // Success handling is done in the hook's onSuccess callback
      // and the useEffect above will handle the redirect
      toast.success("Logged in successfully");
      
    } catch (error) {
      // Error handling is done in the hook and useEffect above
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Left Side - Login Form */}
      <div className="flex items-center justify-center flex-col w-full md:w-1/2 px-6 py-12 relative">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.5),transparent_70%)]"></div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-md space-y-8">
          {/* Header with Icon */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg shadow-blue-600/25 mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
            <p className="text-gray-600 text-base">Sign in to your account to continue</p>
          </div>

          {/* Form Container with improved styling */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-200/50">
            <div className="space-y-6">
              <FormComponent 
                fields={fields} 
                classNames={formInputClassNames} 
                submitButtonStyle={submitButtonStyle} 
                submitButtonText={submitButtonText} 
                formType="login" 
                submitFunction={handleSubmit}
              />
              
              {/* Forgot Password Link */}
              <div className="text-center">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200">
                  Forgotten password?
                </a>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <span 
                className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700 transition-colors duration-200 hover:underline" 
                onClick={() => router.push('/register')}
              >
                Create account
              </span>
            </p>
            
            {/* Additional Links */}
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">Help</a>
              <span>•</span>
              <a href="#" className="hover:text-blue-600 transition-colors duration-200">Privacy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white space-y-8 max-w-md">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              Start your journey with us
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Join thousands of users who trust our platform for their daily productivity needs.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {['Secure', 'Fast', 'Reliable'].map((feature) => (
              <div key={feature} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 backdrop-blur-sm rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 backdrop-blur-sm rounded-full animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}