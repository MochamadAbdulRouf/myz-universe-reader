import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
              Myz Universe
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Myz Universe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
