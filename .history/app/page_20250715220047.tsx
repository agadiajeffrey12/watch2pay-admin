
'use client'
import Image from "next/image";
import { FormComponent } from "./form";
// import Banner from "@/components/banner";
// import axiosInstance from "@/lib/axios";
// import { LoginUser } from "@/lib/services/login.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {toast} from 'sonner'
// import { signIn } from "next-auth/react";
// import { useSessionStore } from "@/stores/session.store";

export default function Home() {
  const router = useRouter();
  const [submitButtonText,setSubmitButtonText] =  useState<string>('Login')
  const fields = [
    { name: "email", label: "Email", placeholder: "Enter your email",type: "email",isRequired: true },
    { name: "password", label: "Password", placeholder: "Enter your password",type: "password",isRequired: true },
  ];

  // const loginService = new LoginUser
  const formInputClassNames ='md:w-[500px] w-[250px] h-[50px] rounded-[8px]'
  // const submitButtonText="Login"
  const submitButtonStyle="bg-brand md:w-[500px] w-[250px] h-[50px] rounded-[16px] font-semibold text-white"
const handleSubmit = async (data: Record<string, string>): Promise<void> => {
  setSubmitButtonText("Logging in...");

  // const res = await signIn("credentials", {
  //   redirect: false,
  //   email: data.email,
  //   password: data.password,
  // });

  // if (res?.ok) {
  //   toast.success("Logged in successfully");
  //   router.push("/onboarding");
  // } else {
  //   // console.log(res)
  //   toast.error("Invalid email or password");
  // }

  setSubmitButtonText("Login");
};

  return (
    <div className="flex w-screen h-screen">
      <div className="flex items-center flex-col w-[90%] md:w-[50%] flex-1 gap-3 border justify-center">
        <h1 className="font-semibold text-3xl">Login</h1>
        <p className="text-greys text-[.9rem]">Welcome Back!</p>
        <FormComponent fields={fields} classNames={formInputClassNames} submitButtonStyle={submitButtonStyle} submitButtonText={submitButtonText} formType="login" submitFunction={handleSubmit}/>
        <p className="text-greys text-[.9rem]">Don&apos;t have an account? <span className="text-brand font-semibold cursor-pointer" onClick={() => router.push('/register')}>Register</span></p>
      </div>
      {/* <Banner/> */}
    </div>
  );
}
