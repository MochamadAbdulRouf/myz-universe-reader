import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComicCard from "@/components/ComicCard";
import { mockComics } from "@/lib/mockData";
import { motion } from "framer-motion";

const ComicList = () => {
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
            {mockComics.map((comic, index) => (
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
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ComicList;
