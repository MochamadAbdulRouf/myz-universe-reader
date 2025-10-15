import { Link, useLocation } from "react-router-dom";
import { BookOpen, Home, Grid3x3, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
// Import logo dari assets
import logoImage from "@/assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
              <img 
              src={logoImage} 
              alt="Myz Universe Logo" 
              className="h-10 w-10 transition-all group-hover:glow-purple-sm" 
              />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
              Myz Universe
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>

            <Button
              variant={isActive("/komik") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/komik" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Komik</span>
              </Link>
            </Button>

            <Button
              variant={isActive("/genre") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/genre" className="flex items-center gap-2">
                <Grid3x3 className="h-4 w-4" />
                <span className="hidden sm:inline">Genre</span>
              </Link>
            </Button>

            {user ? (
              <>
                {isAdmin && (
                  <Button
                    variant={isActive("/admin") ? "default" : "ghost"}
                    size="sm"
                    asChild
                  >
                    <Link to="/admin" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Logout</span>
                </Button>
              </>
            ) : (
              <Button
                variant={isActive("/auth") ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to="/auth" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
