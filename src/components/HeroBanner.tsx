import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroBanner from "@/assets/hero-banner.jpg";

interface FeaturedComic {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  rating: number;
  genre_id: string | null;
  status: string;
}

interface Genre {
  name: string;
}

interface Chapter {
  chapter_number: number;
}

const HeroBanner = () => {
  const [featuredComic, setFeaturedComic] = useState<FeaturedComic | null>(null);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [firstChapter, setFirstChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedComic();
  }, []);

  const fetchFeaturedComic = async () => {
    // Fetch the latest comic
    const { data: comicData, error: comicError } = await supabase
      .from("comics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (comicError || !comicData) {
      setLoading(false);
      return;
    }

    setFeaturedComic(comicData);

    // Fetch genre
    if (comicData.genre_id) {
      const { data: genreData } = await supabase
        .from("genres")
        .select("name")
        .eq("id", comicData.genre_id)
        .single();

      setGenre(genreData);
    }

    // Fetch first chapter
    const { data: chapterData } = await supabase
      .from("chapters")
      .select("chapter_number")
      .eq("comic_id", comicData.id)
      .order("chapter_number", { ascending: true })
      .limit(1)
      .single();

    setFirstChapter(chapterData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-galaxy">
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!featuredComic) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-galaxy">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Featured Comic"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <p className="text-muted-foreground">Belum ada komik tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-galaxy">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={featuredComic.cover_url || heroBanner}
          alt={featuredComic.title}
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
            {featuredComic.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-xl">
            {featuredComic.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {genre && <Badge>{genre.name}</Badge>}
            <Badge>{featuredComic.status}</Badge>
            <div className="flex items-center gap-1 px-3 py-1 bg-card rounded-full">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold">{featuredComic.rating}</span>
            </div>
          </div>

          <div className="flex gap-3">
            {firstChapter && (
              <Button size="lg" className="glow-purple-sm" asChild>
                <Link to={`/baca/${featuredComic.slug}/${firstChapter.chapter_number}`}>
                  <Play className="h-5 w-5 mr-2" />
                  Baca Sekarang
                </Link>
              </Button>
            )}
            <Button size="lg" variant="outline" asChild>
              <Link to={`/komik/${featuredComic.slug}`}>
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
