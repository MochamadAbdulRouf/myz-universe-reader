import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ComicCard from "@/components/ComicCard";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Comic {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  rating: number;
  genres?: { name: string } | null; // legacy single-genre
  comic_genres?: { genres: { name: string } }[]; // multi-genre
}

const Index = () => {
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
        comic_genres ( genres ( name ) )
      `)
      .order("created_at", { ascending: false })
      .limit(8);

    if (!error && data) {
      setComics(data);
    }
  };
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroBanner />

      {/* Latest Comics */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Komik Terbaru
            </span>
            <div className="h-1 flex-1 bg-gradient-to-r from-primary/50 to-transparent rounded" />
          </h2>

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
                    genres={(comic as any).comic_genres?.map((cg: any) => cg.genres?.name).filter(Boolean) || []}
                    rating={comic.rating}
                    slug={comic.slug}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  Belum ada komik. Admin bisa menambahkan di dashboard!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
