import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { getComicBySlug } from "@/lib/mockData";
import { motion } from "framer-motion";

const Reader = () => {
  const { slug, chapter } = useParams();
  const navigate = useNavigate();
  const comic = getComicBySlug(slug || "");
  const chapterNumber = parseInt(chapter || "1");
  const currentChapter = comic?.chapters.find((c) => c.number === chapterNumber);
  const [currentPage, setCurrentPage] = useState(0);

  if (!comic || !currentChapter) {
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

  const totalPages = currentChapter.pages.length;
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;
  const nextChapter = comic.chapters.find((c) => c.number === chapterNumber + 1);
  const prevChapter = comic.chapters.find((c) => c.number === chapterNumber - 1);

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    } else if (nextChapter) {
      navigate(`/baca/${slug}/${nextChapter.number}`);
      setCurrentPage(0);
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(currentPage - 1);
    } else if (prevChapter) {
      navigate(`/baca/${slug}/${prevChapter.number}`);
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
            src={currentChapter.pages[currentPage]}
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
