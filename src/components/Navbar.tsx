import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", path: "/" },
  { label: "World", path: "/world" },
  { label: "Dominica", path: "/dominica" },
  { label: "Economy", path: "/economy" },
  { label: "Agriculture", path: "/agriculture" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      {/* Top bar with logo and auth buttons */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-1 lg:flex-none text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-wide">
              DOMINICA NEWS
            </h1>
          </Link>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              asChild
              className="bg-primary hover:bg-primary/90"
            >
              <Link to="/auth">Register</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Navigation links - Desktop */}
        <nav className="hidden lg:flex items-center justify-center gap-8 py-3 border-t">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.path
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-foreground/80"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Navigation links - Mobile */}
        {mobileMenuOpen && (
          <nav className="lg:hidden flex flex-col gap-2 py-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
