-- Add artist column to comics table
ALTER TABLE public.comics ADD COLUMN artist text;

-- Create junction table for many-to-many relationship between comics and genres
CREATE TABLE public.comic_genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comic_id uuid NOT NULL REFERENCES public.comics(id) ON DELETE CASCADE,
  genre_id uuid NOT NULL REFERENCES public.genres(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(comic_id, genre_id)
);

-- Enable RLS on comic_genres
ALTER TABLE public.comic_genres ENABLE ROW LEVEL SECURITY;

-- Create policies for comic_genres
CREATE POLICY "Anyone can view comic genres"
ON public.comic_genres
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage comic genres"
ON public.comic_genres
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Migrate existing genre_id data to junction table
INSERT INTO public.comic_genres (comic_id, genre_id)
SELECT id, genre_id
FROM public.comics
WHERE genre_id IS NOT NULL;