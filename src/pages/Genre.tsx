import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComicCard from "@/components/ComicCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Comic {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  rating: number;
  comic_genres: { genres: { name: string; slug: string } }[];
}

interface Genre {
  id: string;
  name: string;
  slug: string;
}

const Genre = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [comics, setComics] = useState<Comic[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchGenres();
    fetchComics();
  }, []);

  const fetchGenres = async () => {
    const { data, error } = await supabase
      .from("genres")
      .select("*")
      .order("name");

    if (!error && data) {
      setGenres([{ id: "all", name: "Semua", slug: "all" }, ...data]);
    }
  };

  const fetchComics = async () => {
    let query = supabase.from("comics").select(`
      id,
      title,
      slug,
      cover_url,
      rating,
      comic_genres (
        genres (
          name,
          slug
        )
      )
    `);

    const { data, error } = await query.order("created_at", { ascending: false });

    if (!error && data) {
      // Filter by genre if needed
      if (selectedGenre !== "Semua") {
        const filtered = data.filter(comic => 
          comic.comic_genres?.some(cg => cg.genres.name === selectedGenre)
        );
        setComics(filtered);
      } else {
        setComics(data);
      }
    }
  };

  useEffect(() => {
    if (genres.length > 0) {
      fetchComics();
    }
  }, [selectedGenre, genres]);

  const filteredComics = comics.filter((comic) =>
    comic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Jelajahi Genre
          </h1>

          {/* Search */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari komik..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            {genres.map((genre) => (
              <Button
                key={genre.id}
                variant={selectedGenre === genre.name ? "default" : "outline"}
                onClick={() => setSelectedGenre(genre.name)}
                className={selectedGenre === genre.name ? "glow-purple-sm" : ""}
              >
                {genre.name}
              </Button>
            ))}
          </div>

          {/* Comics Grid */}
          {filteredComics.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredComics.map((comic, index) => (
                <motion.div
                  key={comic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ComicCard
                    id={comic.id}
                    title={comic.title}
                    cover={comic.cover_url || ""}
                    genres={comic.comic_genres?.map(cg => cg.genres.name) || []}
                    rating={comic.rating}
                    slug={comic.slug}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                Tidak ada komik ditemukan
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Genre;
