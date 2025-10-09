import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-galaxy">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Featured Comic"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <Badge variant="secondary" className="mb-4 flex items-center gap-1 w-fit">
            <Star className="h-4 w-4 fill-primary text-primary" />
            Featured
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Galactic Warriors: Void Saga
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-xl">
            Dalam kegelapan luar angkasa, para pahlawan berjuang melawan ancaman
            misterius yang mengancam seluruh galaksi. Petualangan epik dimulai!
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge>Sci-Fi</Badge>
            <Badge>Action</Badge>
            <Badge>Adventure</Badge>
            <div className="flex items-center gap-1 px-3 py-1 bg-card rounded-full">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold">4.9</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button size="lg" className="glow-purple-sm" asChild>
              <Link to="/baca/galactic-warriors/1">
                <Play className="h-5 w-5 mr-2" />
                Baca Sekarang
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/komik/galactic-warriors">
                <BookOpen className="h-5 w-5 mr-2" />
                Detail
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
