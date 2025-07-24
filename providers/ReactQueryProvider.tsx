"use client";
import React, { FC } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      gcTime: 10 * (60 * 1000),
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface IProps {
  children: React.ReactNode;
}

const ReactQueryProvider: FC<IProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;