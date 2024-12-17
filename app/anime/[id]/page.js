"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchAniListData } from "@/lib/anilistFetch";

const GET_ANIME_DETAILS = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      description
      episodes
      duration
      coverImage {
        large
        extraLarge
      }
        bannerImage
      genres
      averageScore
    }
  }
`;

export default function AnimeDetailsPage() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnimeDetails() {
      try {
        const data = await fetchAniListData(GET_ANIME_DETAILS, {
          id: parseInt(id),
        });
        setAnime(data.data.Media);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnimeDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error)
    return <p className="text-center mt-4 text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden shadow-xl">
        <img
          src={anime.bannerImage? anime.bannerImage : `/defaultCover.jpg`}
          alt={anime.title.romaji}
          className="w-full h-full object-cover"
        />
      </div>

      <div className=" p-4 max-w-4xl mx-auto rounded-lg z-10">
        <div className="relative flex flex-col md:flex-row mb-4 -mt-32">
          <img
            src={anime.coverImage.large}
            alt={anime.title.romaji}
            className="mb-4 md:mb-0 md:mr-8 w-64 rounded-xl max-sm:w-[50%] max-sm:h-[50%]"
          />
          <div className="mt-32 max-sm:mt-5">
            <h1 className="text-4xl font-bold mb-4">{anime.title.romaji}</h1>
            <p className="mb-2">
              <strong>English Title:</strong> {anime.title.english || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Native Title:</strong> {anime.title.native}
            </p>
            <p className="mb-2">
              <strong>Episodes:</strong> {anime.episodes || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Duration:</strong> {anime.duration || "N/A"} minutes
            </p>
            <p className="mb-2">
              <strong>Genres:</strong> {anime.genres.join(", ")}
            </p>
            <p className="mb-2">
              <strong>Average Score:</strong> {anime.averageScore || "N/A"}
            </p>
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: anime.description }}
          className="prose max-w-none"
        />
      </div>
    </>
  );
}
