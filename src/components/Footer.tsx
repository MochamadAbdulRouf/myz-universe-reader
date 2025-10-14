import { BookOpen } from "lucide-react";
// Import logo dari assets
import logoImage from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src={logoImage} 
              alt="Myz Universe Logo" 
              className="h-20 w-20 transition-all group-hover:glow-purple-sm" 
              />
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
              Myz Universe
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Myz Universe. All rights reserved.<br></br>
            <center>Build With ❤️ by Rouf</center>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
