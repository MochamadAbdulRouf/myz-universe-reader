import comicCover1 from "@/assets/comic-cover-1.jpg";
import comicCover2 from "@/assets/comic-cover-2.jpg";
import comicCover3 from "@/assets/comic-cover-3.jpg";
import comicCover4 from "@/assets/comic-cover-4.jpg";

export interface Comic {
  id: string;
  title: string;
  slug: string;
  cover: string;
  description: string;
  genre: string;
  author: string;
  rating: number;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: string[];
}

export const mockComics: Comic[] = [
  {
    id: "1",
    title: "Galactic Warriors: Void Saga",
    slug: "galactic-warriors",
    cover: comicCover2,
    description:
      "Di era antariksa yang penuh konflik, sekelompok prajurit elit berjuang melawan kekuatan gelap yang mengancam seluruh galaksi. Dengan teknologi canggih dan keberanian luar biasa, mereka adalah garis pertahanan terakhir umat manusia.",
    genre: "Sci-Fi",
    author: "Myz Creator",
    rating: 4.9,
    chapters: [
      {
        id: "c1",
        number: 1,
        title: "Awal Perjalanan",
        pages: [comicCover2, comicCover2, comicCover2],
      },
      {
        id: "c2",
        number: 2,
        title: "Pertempuran Pertama",
        pages: [comicCover2, comicCover2],
      },
    ],
  },
  {
    id: "2",
    title: "Mystical Realm: The Awakening",
    slug: "mystical-realm",
    cover: comicCover1,
    description:
      "Seorang penyihir muda menemukan kekuatan tersembunyi yang dapat mengubah takdir dunia. Dalam perjalanannya, dia harus menghadapi makhluk-makhluk mistis dan menguak rahasia kuno yang terlupakan.",
    genre: "Fantasy",
    author: "Myz Creator",
    rating: 4.8,
    chapters: [
      {
        id: "c1",
        number: 1,
        title: "Kebangkitan",
        pages: [comicCover1, comicCover1],
      },
    ],
  },
  {
    id: "3",
    title: "Shadow Assassin Chronicles",
    slug: "shadow-assassin",
    cover: comicCover3,
    description:
      "Kisah seorang pembunuh bayaran misterius yang bekerja di kegelapan. Setiap misi membawa misteri baru dan mengungkap konspirasi yang lebih besar dari yang pernah dibayangkan.",
    genre: "Action",
    author: "Myz Creator",
    rating: 4.7,
    chapters: [
      {
        id: "c1",
        number: 1,
        title: "Misi Pertama",
        pages: [comicCover3],
      },
    ],
  },
  {
    id: "4",
    title: "Eternal Love: Beyond Stars",
    slug: "eternal-love",
    cover: comicCover4,
    description:
      "Kisah cinta yang melampaui ruang dan waktu. Dua jiwa yang ditakdirkan bersama, terpisah oleh dimensi yang berbeda, mencari cara untuk bersatu kembali dalam perjalanan emosional yang menyentuh hati.",
    genre: "Romance",
    author: "Myz Creator",
    rating: 4.9,
    chapters: [
      {
        id: "c1",
        number: 1,
        title: "Pertemuan Pertama",
        pages: [comicCover4, comicCover4],
      },
    ],
  },
];

export const genres = [
  "Semua",
  "Action",
  "Romance",
  "Fantasy",
  "Sci-Fi",
  "Comedy",
  "Horror",
  "Mystery",
  "Adventure",
];

export const getComicBySlug = (slug: string): Comic | undefined => {
  return mockComics.find((comic) => comic.slug === slug);
};

export const getComicsByGenre = (genre: string): Comic[] => {
  if (genre === "Semua") return mockComics;
  return mockComics.filter((comic) => comic.genre === genre);
};
