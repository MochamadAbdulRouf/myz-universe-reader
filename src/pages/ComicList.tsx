import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComicCard from "@/components/ComicCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Comic {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  rating: number;
  comic_genres: { genres: { name: string } }[];
}

const ComicList = () => {
  const [comics, setComics] = useState<Comic[]>([]);

  useEffect(() => {
    fetchComics();
  }, []);

  const fetchComics = async () => {
    const { data, error } = await supabase
      .from("comics")
      .select(`
        id,
        title,
        slug,
        cover_url,
        rating,
        comic_genres (
          genres (
            name
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setComics(data);
    }
  };
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
            Semua Komik
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {comics.length > 0 ? (
              comics.map((comic, index) => (
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
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  Belum ada komik tersedia
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ComicList;
