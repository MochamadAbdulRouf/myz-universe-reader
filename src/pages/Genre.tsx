import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComicCard from "@/components/ComicCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { genres, getComicsByGenre } from "@/lib/mockData";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const Genre = () => {
  const [selectedGenre, setSelectedGenre] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComics = getComicsByGenre(selectedGenre).filter((comic) =>
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
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                onClick={() => setSelectedGenre(genre)}
                className={selectedGenre === genre ? "glow-purple-sm" : ""}
              >
                {genre}
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
                    cover={comic.cover}
                    genre={comic.genre}
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
