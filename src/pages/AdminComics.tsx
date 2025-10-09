import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

interface Comic {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  author: string;
  rating: number;
  status: string;
  genre_id: string | null;
}

interface Genre {
  id: string;
  name: string;
  slug: string;
}

const AdminComics = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingComic, setEditingComic] = useState<Comic | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    author: "Myz Creator",
    rating: "0",
    status: "ongoing",
    genre_id: "",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    fetchComics();
    fetchGenres();
  }, []);

  const fetchComics = async () => {
    const { data, error } = await supabase
      .from("comics")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error fetching comics");
      return;
    }

    setComics(data || []);
  };

  const fetchGenres = async () => {
    const { data, error } = await supabase
      .from("genres")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Error fetching genres");
      return;
    }

    setGenres(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let coverUrl = editingComic?.cover_url || null;

    // Upload cover if provided
    if (coverFile) {
      const fileExt = coverFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("comic-covers")
        .upload(fileName, coverFile);

      if (uploadError) {
        toast.error("Error uploading cover");
        return;
      }

      const { data: urlData } = supabase.storage
        .from("comic-covers")
        .getPublicUrl(fileName);

      coverUrl = urlData.publicUrl;
    }

    const comicData = {
      ...formData,
      rating: parseFloat(formData.rating),
      cover_url: coverUrl,
    };

    if (editingComic) {
      const { error } = await supabase
        .from("comics")
        .update(comicData)
        .eq("id", editingComic.id);

      if (error) {
        toast.error("Error updating comic");
        return;
      }

      toast.success("Comic updated!");
    } else {
      const { error } = await supabase.from("comics").insert([comicData]);

      if (error) {
        toast.error("Error creating comic");
        return;
      }

      toast.success("Comic created!");
    }

    setIsDialogOpen(false);
    resetForm();
    fetchComics();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comic?")) return;

    const { error } = await supabase.from("comics").delete().eq("id", id);

    if (error) {
      toast.error("Error deleting comic");
      return;
    }

    toast.success("Comic deleted!");
    fetchComics();
  };

  const handleEdit = (comic: Comic) => {
    setEditingComic(comic);
    setFormData({
      title: comic.title,
      slug: comic.slug,
      description: comic.description,
      author: comic.author,
      rating: comic.rating.toString(),
      status: comic.status,
      genre_id: comic.genre_id || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingComic(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      author: "Myz Creator",
      rating: "0",
      status: "ongoing",
      genre_id: "",
    });
    setCoverFile(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kelola Komik</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Komik
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingComic ? "Edit Komik" : "Tambah Komik Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: title.toLowerCase().replace(/\s+/g, "-"),
                    });
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select
                    value={formData.genre_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, genre_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.id}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="hiatus">Hiatus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image</Label>
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  {editingComic ? "Update" : "Simpan"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {comics.map((comic) => (
          <Card key={comic.id} className="hover-glow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {comic.cover_url && (
                  <img
                    src={comic.cover_url}
                    alt={comic.title}
                    className="w-24 h-36 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{comic.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {comic.description}
                  </p>
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground">
                      Author: {comic.author}
                    </span>
                    <span>•</span>
                    <span className="text-primary">Rating: {comic.rating}</span>
                    <span>•</span>
                    <span className="capitalize">{comic.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(comic)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(comic.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {comics.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Belum ada komik. Klik "Tambah Komik" untuk membuat yang pertama!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminComics;
