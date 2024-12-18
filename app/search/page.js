"use client";
import { useEffect, useState } from "react";
import { fetchAniListData } from "@/lib/anilistFetch";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import Animation from "@/components/LoadingAnimation";
import { Suspense } from "react";

const SEARCH_ANIME = `
  query ($search: String) {
    Page(page: 1, perPage: 10) {
      media(search: $search, type: ANIME) {
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

const GET_RECOMMENDATIONS = `
  query ($search: String) {
    Media(search: $search, type: ANIME) {
      id
      recommendations(page: 1, perPage: 5) {
        nodes {
          mediaRecommendation {
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
    }
  }
`;

export function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);
  const [animeList, setAnimeList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      fetchData(initialQuery);
      fetchRecommendations(initialQuery);
    }
  }, [initialQuery]);

  // Fetch anime search results with delay
async function fetchData(searchTerm) {
  setLoading(true);
  setError(null);
  setAnimeList([]);
  try {
    const data = await fetchAniListData(SEARCH_ANIME, { search: searchTerm });
    // Add a delay of 2 seconds before setting the anime list
    setTimeout(() => {
      setAnimeList(data.data.Page.media);
      setLoading(false);
    }, 2000); // 2000 milliseconds = 2 seconds
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
}

// Fetch anime recommendations with delay
async function fetchRecommendations(searchTerm) {
  setLoading(true);
  setError(null);
  setRecommendations([]);
  try {
    const data = await fetchAniListData(GET_RECOMMENDATIONS, { search: searchTerm });
    const recommendedNodes = data.data.Media?.recommendations?.nodes || [];
    const recommendedAnime = recommendedNodes.map(node => node.mediaRecommendation);

    // Add a delay of 2 seconds before setting the recommendations
    setTimeout(() => {
      setRecommendations(recommendedAnime);
      setLoading(false);
    }, 2000); // 2000 milliseconds = 2 seconds
  } catch (err) {
    setError("Failed to fetch recommendations.");
    setLoading(false);
  }
}


  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${query}`);
    }
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center m-auto">
      <h1 className="text-3xl font-bold mb-4">Search Anime</h1>

      <SearchBar />

      {loading && <div className="flex justify-center items-center m-auto w-full"><Animation /></div>}
      {error && <p className="text-center mt-4 text-red-500">Error: {error}</p>}

      {animeList.length === 0 && !loading && !error ? (
        <p className="text-center text-gray-500">
          No anime found with that name. Please try another anime.
        </p>
      ) : (
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
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Recommended Anime{" "}
            <span className="text-sm text-gray-400 font-normal">
              Based on the anime searched
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-7 gap-y-6">
            {recommendations.map((anime) => (
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
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Animation />}>
      <Search />
    </Suspense>
  );
}