import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, BookOpen, User } from "lucide-react";
import { getComicBySlug } from "@/lib/mockData";
import { motion } from "framer-motion";

const ComicDetail = () => {
  const { slug } = useParams();
  const comic = getComicBySlug(slug || "");

  if (!comic) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Komik Tidak Ditemukan</h1>
          <Button asChild>
            <Link to="/">Kembali ke Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-[300px_1fr] gap-8"
        >
          {/* Cover Image */}
          <div className="relative">
            <div className="sticky top-24">
              <img
                src={comic.cover}
                alt={comic.title}
                className="w-full rounded-lg shadow-2xl glow-purple"
              />
            </div>
          </div>

          {/* Comic Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {comic.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                {comic.rating}
              </Badge>
              <Badge>{comic.genre}</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {comic.author}
              </Badge>
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {comic.description}
            </p>

            <Button size="lg" className="glow-purple-sm mb-12" asChild>
              <Link to={`/baca/${comic.slug}/1`}>
                <BookOpen className="h-5 w-5 mr-2" />
                Baca Chapter 1
              </Link>
            </Button>

            {/* Chapters List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Daftar Chapter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {comic.chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      to={`/baca/${comic.slug}/${chapter.number}`}
                    >
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary hover:bg-card/50 transition-all cursor-pointer hover-glow">
                        <div>
                          <p className="font-semibold">
                            Chapter {chapter.number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {chapter.title}
                          </p>
                        </div>
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ComicDetail;
