"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    // Check if there's a saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Logo size="md" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/about" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link 
              href="/how-it-works" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                Sell Your Vehicle
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/sell-my-car" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    Sell Your Car
                  </Link>
                  <Link href="/sell-my-suv" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    Sell Your SUV
                  </Link>
                  <Link href="/sell-my-truck" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    Sell Your Truck
                  </Link>
                  <Link href="/sell-my-van" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    Sell Your Van
                  </Link>
                  <div className="border-t my-1"></div>
                  <Link href="/#valuation-form" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    Free Instant Valuation
                  </Link>
                </div>
              </div>
            </div>
            <Link 
              href="/contact" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right side - Theme toggle and Get Quote button */}
          <div className="flex items-center space-x-4">
            {/* Get Quote Button */}
            <Link href="/#valuation-form">
              <Button size="sm" className="hidden sm:flex">
                Get a Quote Now
              </Button>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/about" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/how-it-works" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </Link>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Sell Your Vehicle</div>
                  <div className="pl-4 space-y-2">
                    <Link 
                      href="/sell-my-car" 
                      className="block text-sm hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sell Your Car
                    </Link>
                    <Link 
                      href="/sell-my-suv" 
                      className="block text-sm hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sell Your SUV
                    </Link>
                    <Link 
                      href="/sell-my-truck" 
                      className="block text-sm hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sell Your Truck
                    </Link>
                    <Link 
                      href="/sell-my-van" 
                      className="block text-sm hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sell Your Van
                    </Link>
                    <Link 
                      href="/#valuation-form" 
                      className="block text-sm hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Free Instant Valuation
                    </Link>
                  </div>
                </div>
                <Link 
                  href="/contact" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="pt-4 border-t">
                  <Link href="/#valuation-form" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Get a Quote Now
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo size="sm" showText={true} />
              </div>
              <p className="text-sm text-muted-foreground">
                The easiest way to sell your car online. Get the best price with our professional service.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-primary transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Sell Your Vehicle</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/sell-my-car" className="hover:text-primary transition-colors">
                    Sell Your Car
                  </Link>
                </li>
                <li>
                  <Link href="/sell-my-suv" className="hover:text-primary transition-colors">
                    Sell Your SUV
                  </Link>
                </li>
                <li>
                  <Link href="/sell-my-truck" className="hover:text-primary transition-colors">
                    Sell Your Truck
                  </Link>
                </li>
                <li>
                  <Link href="/sell-my-van" className="hover:text-primary transition-colors">
                    Sell Your Van
                  </Link>
                </li>
                <li>
                  <Link href="/#valuation-form" className="hover:text-primary transition-colors">
                    Free Instant Valuation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="hover:text-primary transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-primary transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 CarSellMax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
