import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, BookOpen, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Comic {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  author: string;
  artist: string | null;
  rating: number;
  status: string;
  comic_genres: { genres: { name: string } }[];
}

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
}

const ComicDetail = () => {
  const { slug } = useParams();
  const [comic, setComic] = useState<Comic | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComicData();
  }, [slug]);

  const fetchComicData = async () => {
    setLoading(true);

    // Fetch comic with genres
    const { data: comicData, error: comicError } = await supabase
      .from("comics")
      .select(`
        *,
        comic_genres (
          genres (
            name
          )
        )
      `)
      .eq("slug", slug)
      .single();

    if (comicError || !comicData) {
      setLoading(false);
      return;
    }

    setComic(comicData);

    // Fetch chapters
    const { data: chaptersData } = await supabase
      .from("chapters")
      .select("*")
      .eq("comic_id", comicData.id)
      .order("chapter_number", { ascending: true });

    setChapters(chaptersData || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

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
                src={comic.cover_url || "/placeholder.svg"}
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
              {comic.comic_genres?.map((cg, index) => (
                <Badge key={index}>{cg.genres.name}</Badge>
              ))}
              <Badge variant="outline" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Author: {comic.author}
              </Badge>
              {comic.artist && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Artist: {comic.artist}
                </Badge>
              )}
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {comic.description}
            </p>

            {chapters.length > 0 && (
              <Button size="lg" className="glow-purple-sm mb-12" asChild>
                <Link to={`/baca/${comic.slug}/${chapters[0].chapter_number}`}>
                  <BookOpen className="h-5 w-5 mr-2" />
                  Baca Chapter {chapters[0].chapter_number}
                </Link>
              </Button>
            )}

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
                  {chapters.length > 0 ? (
                    chapters.map((chapter) => (
                      <Link
                        key={chapter.id}
                        to={`/baca/${comic.slug}/${chapter.chapter_number}`}
                      >
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary hover:bg-card/50 transition-all cursor-pointer hover-glow">
                          <div>
                            <p className="font-semibold">
                              Chapter {chapter.chapter_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {chapter.title}
                            </p>
                          </div>
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Belum ada chapter tersedia
                    </p>
                  )}
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
