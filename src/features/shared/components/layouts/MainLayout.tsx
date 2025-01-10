import { ReactNode } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const MainLayout = ({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showHeader && (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="container max-w-7xl mx-auto p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary">UroCenter</h1>
            <LanguageSelector />
          </div>
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      {showFooter && (
        <footer className="p-4 text-center text-sm text-muted-foreground">
          © 2025 All rights reserved
        </footer>
      )}
    </div>
  );
};