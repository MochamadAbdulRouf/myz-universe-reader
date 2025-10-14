import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Upload, BookOpen, Star } from "lucide-react";
import { toast } from "sonner";

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
  genre_id: string | null;
  featured: boolean;
  genres?: Genre[];
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
    author: "",
    artist: "",
    rating: "0",
    status: "ongoing",
    genre_ids: [] as string[],
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    fetchComics();
    fetchGenres();
  }, []);

  const fetchComics = async () => {
    const { data, error } = await supabase
      .from("comics")
      .select(`
        *,
        comic_genres(genre_id, genres(id, name, slug))
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error fetching comics");
      return;
    }

    // Transform the data to include genres array
    const comicsWithGenres = data?.map((comic: any) => ({
      ...comic,
      genres: comic.comic_genres?.map((cg: any) => cg.genres).filter(Boolean) || []
    })) || [];

    setComics(comicsWithGenres);
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

    // Validate at least author or artist is provided
    if (!formData.author.trim() && !formData.artist.trim()) {
      toast.error("Harap isi Author atau Artist (atau keduanya)");
      return;
    }

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
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      author: formData.author || "Unknown",
      artist: formData.artist || null,
      rating: parseFloat(formData.rating),
      status: formData.status,
      cover_url: coverUrl,
    };

    let comicId = editingComic?.id;

    if (editingComic) {
      const { error } = await supabase
        .from("comics")
        .update(comicData)
        .eq("id", editingComic.id);

      if (error) {
        toast.error("Error updating comic");
        return;
      }

      // Delete existing genre relationships
      await supabase
        .from("comic_genres")
        .delete()
        .eq("comic_id", editingComic.id);
    } else {
      const { data: newComic, error } = await supabase
        .from("comics")
        .insert([comicData])
        .select()
        .single();

      if (error) {
        toast.error("Error creating comic");
        return;
      }

      comicId = newComic.id;
    }

    // Insert genre relationships
    if (formData.genre_ids.length > 0 && comicId) {
      const genreRelations = formData.genre_ids.map(genreId => ({
        comic_id: comicId,
        genre_id: genreId
      }));

      const { error: genreError } = await supabase
        .from("comic_genres")
        .insert(genreRelations);

      if (genreError) {
        toast.error("Error saving genres");
        return;
      }
    }

    toast.success(editingComic ? "Comic updated!" : "Comic created!");
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

  const handleToggleFeatured = async (comic: Comic) => {
    // If setting as featured, remove featured from all other comics first
    if (!comic.featured) {
      const { error: unfeaturedError } = await supabase
        .from("comics")
        .update({ featured: false })
        .neq("id", comic.id);

      if (unfeaturedError) {
        toast.error("Error updating featured status");
        return;
      }
    }

    const { error } = await supabase
      .from("comics")
      .update({ featured: !comic.featured })
      .eq("id", comic.id);

    if (error) {
      toast.error("Error updating featured status");
      return;
    }

    toast.success(comic.featured ? "Removed from featured" : "Set as featured!");
    fetchComics();
  };

  const handleEdit = (comic: Comic) => {
    setEditingComic(comic);
    setFormData({
      title: comic.title,
      slug: comic.slug,
      description: comic.description,
      author: comic.author,
      artist: comic.artist || "",
      rating: comic.rating.toString(),
      status: comic.status,
      genre_ids: comic.genres?.map(g => g.id) || [],
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingComic(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      author: "",
      artist: "",
      rating: "0",
      status: "ongoing",
      genre_ids: [],
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
                  <Label htmlFor="author">Author (Penulis)</Label>
                  <Input
                    id="author"
                    placeholder="Nama penulis cerita"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="artist">Artist (Ilustrator)</Label>
                  <Input
                    id="artist"
                    placeholder="Nama ilustrator"
                    value={formData.artist}
                    onChange={(e) =>
                      setFormData({ ...formData, artist: e.target.value })
                    }
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground -mt-2">
                * Isi minimal salah satu (Author atau Artist)
              </p>

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

              <div className="space-y-2">
                <Label>Genre (Pilih satu atau lebih)</Label>
                <div className="border rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
                  {genres.map((genre) => (
                    <div key={genre.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre.id}`}
                        checked={formData.genre_ids.includes(genre.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              genre_ids: [...formData.genre_ids, genre.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              genre_ids: formData.genre_ids.filter(id => id !== genre.id)
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor={`genre-${genre.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {genre.name}
                      </Label>
                    </div>
                  ))}
                </div>
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
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{comic.title}</h3>
                    {comic.featured && (
                      <Star className="h-5 w-5 fill-primary text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {comic.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm mb-2">
                    {comic.author && (
                      <>
                        <span className="text-muted-foreground">
                          Author: {comic.author}
                        </span>
                        {comic.artist && <span>•</span>}
                      </>
                    )}
                    {comic.artist && (
                      <span className="text-muted-foreground">
                        Artist: {comic.artist}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm mb-2">
                    {comic.genres && comic.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {comic.genres.map((genre, index) => (
                          <span key={genre.id} className="text-primary">
                            {genre.name}{index < comic.genres!.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 text-sm mb-3">
                    <span className="text-primary">Rating: {comic.rating}</span>
                    <span>•</span>
                    <span className="capitalize">{comic.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={comic.featured}
                      onCheckedChange={() => handleToggleFeatured(comic)}
                      id={`featured-${comic.id}`}
                    />
                    <Label 
                      htmlFor={`featured-${comic.id}`}
                      className="text-sm cursor-pointer"
                    >
                      Featured
                    </Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.location.href = `/admin/chapters/${comic.id}`}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Chapters
                  </Button>
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
