-- Add featured column to comics table
ALTER TABLE public.comics 
ADD COLUMN featured BOOLEAN NOT NULL DEFAULT false;

-- Create index for featured comics for better performance
CREATE INDEX idx_comics_featured ON public.comics(featured) WHERE featured = true;

-- Add comment
COMMENT ON COLUMN public.comics.featured IS 'Indicates if this comic should be featured on the hero banner';