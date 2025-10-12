import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  created_at: string;
}

interface ChapterPage {
  id: string;
  page_number: number;
  image_url: string;
}

interface Comic {
  id: string;
  title: string;
  slug: string;
}

const AdminChapters = () => {
  const { comicId } = useParams();
  const [comic, setComic] = useState<Comic | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [pages, setPages] = useState<ChapterPage[]>([]);
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [isPagesDialogOpen, setIsPagesDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterFormData, setChapterFormData] = useState({
    chapter_number: "",
    title: "",
  });
  const [pageFiles, setPageFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (comicId) {
      fetchComic();
      fetchChapters();
    }
  }, [comicId]);

  const fetchComic = async () => {
    const { data, error } = await supabase
      .from("comics")
      .select("id, title, slug")
      .eq("id", comicId)
      .single();

    if (error) {
      toast.error("Error fetching comic");
      return;
    }

    setComic(data);
  };

  const fetchChapters = async () => {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("comic_id", comicId)
      .order("chapter_number", { ascending: true });

    if (error) {
      toast.error("Error fetching chapters");
      return;
    }

    setChapters(data || []);
  };

  const fetchPages = async (chapterId: string) => {
    const { data, error } = await supabase
      .from("chapter_pages")
      .select("*")
      .eq("chapter_id", chapterId)
      .order("page_number", { ascending: true });

    if (error) {
      toast.error("Error fetching pages");
      return;
    }

    setPages(data || []);
  };

  const handleChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const chapterData = {
      comic_id: comicId,
      chapter_number: parseInt(chapterFormData.chapter_number),
      title: chapterFormData.title,
    };

    if (editingChapter) {
      const { error } = await supabase
        .from("chapters")
        .update(chapterData)
        .eq("id", editingChapter.id);

      if (error) {
        toast.error("Error updating chapter");
        return;
      }

      toast.success("Chapter updated!");
    } else {
      const { error } = await supabase.from("chapters").insert([chapterData]);

      if (error) {
        toast.error("Error creating chapter");
        return;
      }

      toast.success("Chapter created!");
    }

    setIsChapterDialogOpen(false);
    resetChapterForm();
    fetchChapters();
  };

  const handleDeleteChapter = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chapter?")) return;

    const { error } = await supabase.from("chapters").delete().eq("id", id);

    if (error) {
      toast.error("Error deleting chapter");
      return;
    }

    toast.success("Chapter deleted!");
    fetchChapters();
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setChapterFormData({
      chapter_number: chapter.chapter_number.toString(),
      title: chapter.title,
    });
    setIsChapterDialogOpen(true);
  };

  const resetChapterForm = () => {
    setEditingChapter(null);
    setChapterFormData({
      chapter_number: "",
      title: "",
    });
  };

  const handleManagePages = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    fetchPages(chapter.id);
    setIsPagesDialogOpen(true);
  };

  const handleUploadPages = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pageFiles || !selectedChapter) return;

    const uploadPromises = Array.from(pageFiles).map(async (file, index) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${selectedChapter.id}/${Date.now()}-${index}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("comic-pages")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("comic-pages")
        .getPublicUrl(fileName);

      return {
        chapter_id: selectedChapter.id,
        page_number: pages.length + index + 1,
        image_url: urlData.publicUrl,
      };
    });

    try {
      const pagesData = await Promise.all(uploadPromises);

      const { error } = await supabase.from("chapter_pages").insert(pagesData);

      if (error) throw error;

      toast.success("Pages uploaded!");
      setPageFiles(null);
      fetchPages(selectedChapter.id);
    } catch (error) {
      toast.error("Error uploading pages");
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    const { error } = await supabase.from("chapter_pages").delete().eq("id", id);

    if (error) {
      toast.error("Error deleting page");
      return;
    }

    toast.success("Page deleted!");
    if (selectedChapter) {
      fetchPages(selectedChapter.id);
    }
  };

  if (!comic) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{comic.title}</h1>
          <p className="text-muted-foreground">Kelola chapter dan halaman</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Daftar Chapter</h2>
          <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetChapterForm}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Chapter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingChapter ? "Edit Chapter" : "Tambah Chapter Baru"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleChapterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chapter_number">Nomor Chapter</Label>
                  <Input
                    id="chapter_number"
                    type="number"
                    value={chapterFormData.chapter_number}
                    onChange={(e) =>
                      setChapterFormData({
                        ...chapterFormData,
                        chapter_number: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Judul Chapter</Label>
                  <Input
                    id="title"
                    value={chapterFormData.title}
                    onChange={(e) =>
                      setChapterFormData({ ...chapterFormData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingChapter ? "Update" : "Simpan"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsChapterDialogOpen(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {chapters.map((chapter) => (
            <Card key={chapter.id} className="hover-glow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">
                      Chapter {chapter.chapter_number}
                    </h3>
                    <p className="text-muted-foreground">{chapter.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManagePages(chapter)}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Kelola Halaman
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditChapter(chapter)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteChapter(chapter.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {chapters.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  Belum ada chapter. Klik "Tambah Chapter" untuk membuat yang pertama!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pages Management Dialog */}
        <Dialog open={isPagesDialogOpen} onOpenChange={setIsPagesDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Kelola Halaman - Chapter {selectedChapter?.chapter_number}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleUploadPages} className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="pages">Upload Halaman (Multiple)</Label>
                <Input
                  id="pages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setPageFiles(e.target.files)}
                />
                <p className="text-sm text-muted-foreground">
                  Pilih beberapa gambar sekaligus untuk upload
                </p>
              </div>

              <Button type="submit" disabled={!pageFiles}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Halaman
              </Button>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pages.map((page) => (
                <Card key={page.id}>
                  <CardHeader className="p-2">
                    <CardTitle className="text-sm">
                      Halaman {page.page_number}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <img
                      src={page.image_url}
                      alt={`Page ${page.page_number}`}
                      className="w-full rounded mb-2"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePage(page.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Hapus
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {pages.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Belum ada halaman. Upload gambar untuk menambahkan halaman.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
};

export default AdminChapters;
