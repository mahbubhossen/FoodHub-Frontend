"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full">
        <DashboardSidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex md:hidden h-14 items-center justify-between border-b bg-card px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <DashboardSidebar />
            </SheetContent>
          </Sheet>

          <span className="font-bold text-primary">FoodHub</span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-transform" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-transform" />
          </Button>
        </header>

        {/* Desktop topbar */}
        <header className="hidden md:flex h-14 items-center justify-end border-b bg-card px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-transform" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-transform" />
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
