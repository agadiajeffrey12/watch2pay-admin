"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Dynamically generate schema based on fields
const generateSchema = (fields: { name: string; label: string, isRequired:boolean }[]) => {
  const shape = fields.reduce((acc, field) => {
    acc[field.name] = field.isRequired ? z.string().min(2, `${field.label} must be at least 2 characters.`) : z.string();
    return acc;
  }, {} as Record<string, z.ZodTypeAny>);
  return z.object(shape);
};

// Define props for the component
interface FormProps {
  fields: {
    name: string;
    label: string;
    placeholder?: string;
    description?: string;
    type?: string; // Input type (e.g., text, email, password)
    isRequired:boolean
  }[];
  classNames?: string;
  submitButtonText?: string;
  submitButtonStyle?: string;
  formType?: string;
  submitFunction?: (data: Record<string, string>) => void; 
}

export function FormComponent({
  fields,
  classNames = "",
  submitButtonStyle = "",
  submitButtonText = "Submit",
  formType = "",
  submitFunction=()=>{},
}: FormProps) {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>(
    Object.fromEntries(fields.map((field) => [field.name, false]))
  );

  // Toggle password visibility
  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  // Dynamically generate schema
  const formSchema = generateSchema(fields);

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = ""; // Set default value for each field
      return acc;
    }, {} as Record<string, string>),
  });

  // Define the submit handler
  const onsubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data);
    if(submitFunction)submitFunction(data as Record<string, string>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={
                        field.type === "password" && showPassword[field.name]
                          ? "text"
                          : field.type || "text"
                      }
                      placeholder={field.placeholder || ""}
                      {...formField}
                      value={typeof formField.value === "string" ? formField.value : ""}
                      className={classNames}
                    />
                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field.name)}
                        className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500"
                      >
                        {showPassword[field.name] ? "Hide" : "Show"}
                      </button>
                    )}
                  </div>
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {formType === 'login' && <div className="flex justify-end">
                <Link href="/forgot-password" className="font-semibold text-brand text-[16px]">Forgotten password?</Link>
            </div>}
        <Button type="submit" className={submitButtonStyle}>
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}