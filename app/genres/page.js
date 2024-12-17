"use client";
import { useEffect, useState } from "react";
import { fetchAniListData } from "@/lib/anilistFetch";
import Link from "next/link";
import Image from "next/image"; // Import the Image component
import withAuth from "@/lib/withAuth";
import Animation from "@/components/LoadingAnimation";

const GET_GENRES = `
  query {
    GenreCollection
  }
`;

// Array of image paths
const images = [
  "/genre/action.jpeg",
  "/genre/adventure.jpeg",
  "/genre/comedy.jpeg",
  "/genre/drama.jpeg",
  "/genre/ecchi.jpeg",
  "/genre/fantasy.jpeg",
  "/genre/hentai.jpeg",
  "/genre/horror.jpeg",
  "/genre/mahou shoujo.jpeg",
  "/genre/mecha.jpeg",
  "/genre/music.jpeg",
  "/genre/mystery.jpeg",
  "/genre/psychological.jpeg",
  "/genre/romance.jpeg",
  "/genre/sci-fi.jpeg",
  "/genre/slice of life.jpeg",
  "/genre/sports.jpeg",
  "/genre/supernatural.jpeg",
  "/genre/thriller.jpeg",
];

export default withAuth(function GenresPage() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const data = await fetchAniListData(GET_GENRES);
        setGenres(data.data.GenreCollection);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGenres();
  }, []);

  if (loading) return <div className="flex justify-center items-center m-auto w-full mt-10"><Animation /></div>;
  if (error)
    return <p className="text-center mt-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Genres</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {genres.map((genre, index) => (
          <Link
            key={genre}
            href={`/genres/${genre.toLowerCase()}`}
            className="block bg-[#595168] bg-opacity-80 p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <div className="relative w-full h-48 mb-4">
              <Image
                src={images[index] || "/genre/default.jpeg"} // Fallback image if no image matches
                alt={genre}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h2 className="text-lg font-semibold">{genre}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
});
