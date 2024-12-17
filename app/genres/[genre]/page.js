"use client";
import { useEffect, useState } from "react";
import { fetchAniListData } from "@/lib/anilistFetch";
import { useParams } from "next/navigation";
import Link from "next/link";
import Animation from "@/components/LoadingAnimation";

const GET_ANIME_BY_GENRE = `
  query ($genre: String, $page: Int) {
    Page(page: $page, perPage: 10) {
      media(genre: $genre, type: ANIME) {
        id
        title {
          romaji
        }
        coverImage {
          large
        }
      }
    }
  }
`;

export default function GenrePage() {
  const { genre } = useParams();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch anime when the component mounts or when the genre changes
  useEffect(() => {
    async function fetchAnime() {
      try {
        setLoading(true);
        const data = await fetchAniListData(GET_ANIME_BY_GENRE, { genre, page: 1 });
        setAnimeList(data.data.Page.media);
        setPage(1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnime();
  }, [genre]);

  // Load more anime when "View More" is clicked
  const loadMore = async () => {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await fetchAniListData(GET_ANIME_BY_GENRE, { genre, page: nextPage });
      setAnimeList((prevList) => [...prevList, ...data.data.Page.media]);
      setPage(nextPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center m-auto w-full mt-10"><Animation /></div>;
  if (error) return <p className="text-center mt-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 flex flex-col justify-centrer items-center m-auto">
      <h1 className="text-3xl font-bold mb-4">Anime in {genre.trim()} genre</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-7 gap-y-6 mb-8">
          {animeList.map((anime) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}`}
              className="text-center flex flex-col items-center relative"
            >
              <div className="w-[180px] h-[256px] relative overflow-hidden rounded-[15px] mb-2">
                {/* Background Blurred Image */}
                <img
                  src={anime.coverImage.large}
                  alt={anime.title.romaji}
                  className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
                />

                {/* Centered Foreground Image */}
                <div className="relative z-10 flex justify-center items-center h-full">
                  <img
                    src={anime.coverImage.large}
                    alt={anime.title.romaji}
                    className=" object-cover rounded-md shadow-md"
                  />
                </div>
              </div>

              {/* Anime Title */}
              <h2 className="font-semibold w-[180px]">{anime.title.romaji}</h2>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-6">
        <button
          onClick={loadMore}
          className="custom-button mb-10 w-full text-white px-7 py-4 rounded-xl"
          disabled={loadingMore}
        >
          {loadingMore ? "Loading..." : "View More"}
        </button>
      </div>
    </div>
  );
}
