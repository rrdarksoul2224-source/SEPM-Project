import { useState } from "react";
import { Menu, X, Shield, User, Chrome, Github, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Details", href: "#details" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute inset-0 rounded-lg gradient-primary opacity-50 blur-lg" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading font-semibold text-lg text-foreground">
                ANPR<span className="text-primary">System</span>
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
                Intelligent Detection
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Sign In Button */}
          <div className="hidden md:flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl font-heading">Welcome Back</DialogTitle>
                  <DialogDescription className="text-center">
                    Choose your preferred sign in method
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 mt-4">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12">
                    <Chrome className="w-5 h-5 text-primary" />
                    Continue with Google
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12">
                    <Github className="w-5 h-5" />
                    Continue with GitHub
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12">
                    <Phone className="w-5 h-5 text-success" />
                    Continue with Phone Number
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button size="sm" className="gradient-primary text-primary-foreground font-medium shadow-glow hover:opacity-90 transition-opacity">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t border-border/30 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-border/30 space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl font-heading">Welcome Back</DialogTitle>
                    <DialogDescription className="text-center">
                      Choose your preferred sign in method
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-3 mt-4">
                    <Button variant="outline" className="w-full justify-start gap-3 h-12">
                      <Chrome className="w-5 h-5 text-primary" />
                      Continue with Google
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3 h-12">
                      <Github className="w-5 h-5" />
                      Continue with GitHub
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3 h-12">
                      <Phone className="w-5 h-5 text-success" />
                      Continue with Phone Number
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button className="w-full gradient-primary text-primary-foreground font-medium">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
