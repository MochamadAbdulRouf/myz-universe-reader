import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface ComicCardProps {
  id: string;
  title: string;
  cover: string;
  genre: string;
  rating: number;
  slug: string;
}

const ComicCard = ({ id, title, cover, genre, rating, slug }: ComicCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/komik/${slug}`}>
        <Card className="overflow-hidden hover-glow cursor-pointer h-full">
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={cover}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-primary text-primary" />
                {rating}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg line-clamp-1 mb-1">{title}</h3>
            <Badge variant="outline">{genre}</Badge>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ComicCard;
