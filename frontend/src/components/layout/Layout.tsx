import { ReactNode } from "react";
import { Header } from "./Header";
import { ErrorBoundary } from "../common/ErrorBoundary";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ErrorBoundary>
        <main className="max-w-7xl mx-auto px-6 py-6">{children}</main>
      </ErrorBoundary>
    </div>
  );
}
