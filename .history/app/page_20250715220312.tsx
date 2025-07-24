'use client'
import Image from "next/image";
import { FormComponent } from "../components/reuseables/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from 'sonner';

export default function Home() {
  const router = useRouter();
  const [submitButtonText, setSubmitButtonText] = useState<string>('Login');
  const [isLoading, setIsLoading] = useState(false);

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

  const formInputClassNames = 'w-full max-w-[400px] h-[52px] rounded-[12px] border-2 border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-200 px-4 text-gray-700 placeholder:text-gray-400 bg-white/50 backdrop-blur-sm';
  
  const submitButtonStyle = `
    relative overflow-hidden bg-gradient-to-r from-brand to-brand/90 
    w-full max-w-[400px] h-[52px] rounded-[12px] font-semibold text-white 
    shadow-lg shadow-brand/25 hover:shadow-xl hover:shadow-brand/30 
    hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
  `;

  const handleSubmit = async (data: Record<string, string>): Promise<void> => {
    setSubmitButtonText("Logging in...");
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Replace with your actual login logic
      // const res = await signIn("credentials", {
      //   redirect: false,
      //   email: data.email,
      //   password: data.password,
      // });

      // if (res?.ok) {
      //   toast.success("Logged in successfully");
      //   router.push("/onboarding");
      // } else {
      //   toast.error("Invalid email or password");
      // }
      
      toast.success("Logged in successfully");
      router.push("/onboarding");
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setSubmitButtonText("Login");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Login Form Section */}
      <div className="flex items-center justify-center flex-col w-full md:w-1/2 px-6 py-12 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand to-brand/80 rounded-2xl shadow-lg shadow-brand/25 mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
            <p className="text-gray-600 text-base">Sign in to your account to continue</p>
          </div>

          {/* Form Container */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-200/50">
            <FormComponent 
              fields={fields} 
              classNames={formInputClassNames} 
              submitButtonStyle={submitButtonStyle} 
              submitButtonText={submitButtonText} 
              formType="login" 
              submitFunction={handleSubmit}
              // disabled={isLoading}
            />
          </div>

          {/* Footer */}
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <span 
                className="text-brand font-semibold cursor-pointer hover:text-brand/80 transition-colors duration-200 hover:underline" 
                onClick={() => router.push('/register')}
              >
                Create account
              </span>
            </p>
            
            {/* Additional Links */}
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-brand transition-colors duration-200">Forgot password?</a>
              <span>•</span>
              <a href="#" className="hover:text-brand transition-colors duration-200">Help</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-brand via-brand/90 to-brand/80 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
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

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 backdrop-blur-sm rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 backdrop-blur-sm rounded-full animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}