-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create genres table
CREATE TABLE public.genres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create comics table
CREATE TABLE public.comics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  cover_url TEXT,
  author TEXT NOT NULL DEFAULT 'Myz Creator',
  rating NUMERIC(2,1) NOT NULL DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  genre_id UUID REFERENCES public.genres(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'hiatus')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comic_id UUID REFERENCES public.comics(id) ON DELETE CASCADE NOT NULL,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(comic_id, chapter_number)
);

-- Create chapter_pages table
CREATE TABLE public.chapter_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  page_number INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(chapter_id, page_number)
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('comic-covers', 'comic-covers', true),
  ('comic-pages', 'comic-pages', true);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_pages ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Anyone can view roles"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for genres
CREATE POLICY "Anyone can view genres"
  ON public.genres FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage genres"
  ON public.genres FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for comics
CREATE POLICY "Anyone can view comics"
  ON public.comics FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert comics"
  ON public.comics FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update comics"
  ON public.comics FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete comics"
  ON public.comics FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for chapters
CREATE POLICY "Anyone can view chapters"
  ON public.chapters FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage chapters"
  ON public.chapters FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for chapter_pages
CREATE POLICY "Anyone can view pages"
  ON public.chapter_pages FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage pages"
  ON public.chapter_pages FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies for comic-covers
CREATE POLICY "Anyone can view comic covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'comic-covers');

CREATE POLICY "Admins can upload comic covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'comic-covers' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update comic covers"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'comic-covers' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete comic covers"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'comic-covers' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- Storage policies for comic-pages
CREATE POLICY "Anyone can view comic pages"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'comic-pages');

CREATE POLICY "Admins can upload comic pages"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'comic-pages' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update comic pages"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'comic-pages' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete comic pages"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'comic-pages' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign user role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comics_updated_at
  BEFORE UPDATE ON public.comics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default genres
INSERT INTO public.genres (name, slug) VALUES
  ('Action', 'action'),
  ('Romance', 'romance'),
  ('Fantasy', 'fantasy'),
  ('Sci-Fi', 'sci-fi'),
  ('Comedy', 'comedy'),
  ('Horror', 'horror'),
  ('Mystery', 'mystery'),
  ('Adventure', 'adventure');