import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Comic {
  id: string;
  title: string;
  slug: string;
}

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
}

interface ChapterPage {
  id: string;
  page_number: number;
  image_url: string;
}

const Reader = () => {
  const { slug, chapter } = useParams();
  const navigate = useNavigate();
  const [comic, setComic] = useState<Comic | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [pages, setPages] = useState<ChapterPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const chapterNumber = parseInt(chapter || "1");

  useEffect(() => {
    fetchReaderData();
  }, [slug, chapter]);

  const fetchReaderData = async () => {
    setLoading(true);

    // Fetch comic
    const { data: comicData, error: comicError } = await supabase
      .from("comics")
      .select("id, title, slug")
      .eq("slug", slug)
      .single();

    if (comicError || !comicData) {
      setLoading(false);
      return;
    }

    setComic(comicData);

    // Fetch all chapters
    const { data: chaptersData } = await supabase
      .from("chapters")
      .select("*")
      .eq("comic_id", comicData.id)
      .order("chapter_number", { ascending: true });

    setChapters(chaptersData || []);

    // Fetch current chapter
    const { data: chapterData } = await supabase
      .from("chapters")
      .select("*")
      .eq("comic_id", comicData.id)
      .eq("chapter_number", chapterNumber)
      .single();

    if (chapterData) {
      setCurrentChapter(chapterData);

      // Fetch pages
      const { data: pagesData } = await supabase
        .from("chapter_pages")
        .select("*")
        .eq("chapter_id", chapterData.id)
        .order("page_number", { ascending: true });

      setPages(pagesData || []);
    }

    setLoading(false);
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!comic || !currentChapter || pages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Chapter Tidak Ditemukan</h1>
          <Button asChild>
            <Link to="/">Kembali ke Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalPages = pages.length;
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;
  const nextChapter = chapters.find((c) => c.chapter_number === chapterNumber + 1);
  const prevChapter = chapters.find((c) => c.chapter_number === chapterNumber - 1);

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    } else if (nextChapter) {
      navigate(`/baca/${slug}/${nextChapter.chapter_number}`);
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(currentPage - 1);
    } else if (prevChapter) {
      navigate(`/baca/${slug}/${prevChapter.chapter_number}`);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/komik/${slug}`}>
              <Home className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div className="text-center">
            <p className="font-semibold">{comic.title}</p>
            <p className="text-sm text-muted-foreground">
              Chapter {chapterNumber} - Halaman {currentPage + 1}/{totalPages}
            </p>
          </div>
          <div className="w-24" />
        </div>
      </div>

      {/* Reader */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <img
            src={pages[currentPage].image_url}
            alt={`Page ${currentPage + 1}`}
            className="w-full rounded-lg shadow-2xl"
          />
        </motion.div>

        {/* Navigation Buttons */}
        <div className="max-w-4xl mx-auto mt-8 flex justify-between items-center">
          <Button
            size="lg"
            variant="secondary"
            onClick={goToPrevPage}
            disabled={!hasPrevPage && !prevChapter}
            className="gap-2"
          >
            <ChevronLeft className="h-5 w-5" />
            Sebelumnya
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {currentPage + 1} / {totalPages}
          </div>

          <Button
            size="lg"
            onClick={goToNextPage}
            disabled={!hasNextPage && !nextChapter}
            className="gap-2"
          >
            Berikutnya
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reader;
