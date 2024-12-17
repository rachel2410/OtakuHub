"use client";
import { useEffect, useState } from "react";
import { fetchAniListData } from "@/lib/anilistFetch";
import Link from "next/link";
import withAuth from "@/lib/withAuth";
import Animation from "@/components/LoadingAnimation";

const GET_TOP_RANKED_ANIME_BY_GENRE = `
  query ($page: Int, $genre: String) {
    Page(page: $page, perPage: 5) {
      media(sort: SCORE_DESC, type: ANIME, genre: $genre) {
        id
        title {
          romaji
        }
        coverImage {
          large
        }
        averageScore
      }
    }
  }
`;

const GET_TOP_100_RANKED_ANIME = `
  query ($page: Int) {
    Page(page: $page, perPage: 100) {
      media(sort: SCORE_DESC, type: ANIME) {
        id
        title {
          romaji
        }
        coverImage {
          large
        }
        averageScore
      }
    }
  }
`;

const genres = ["Action", "Comedy", "Horror"];

export default withAuth(function RankingPage() {
  const [ genreAnimeLists, setGenreAnimeLists] = useState({});
  const [top100AnimeList, setTop100AnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch top 5 anime for each genre
  useEffect(() => {
    async function fetchGenreAnime() {
      try {
        setLoading(true);
        const genreData = {};
        for (const genre of genres) {
          const data = await fetchAniListData(GET_TOP_RANKED_ANIME_BY_GENRE, {
            page: 1,
            genre,
          });
          genreData[genre] = data.data.Page.media;
        }
        setGenreAnimeLists(genreData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGenreAnime();
  }, []);

  // Fetch top 100 anime after genre-specific data is loaded
  const fetchTop100Anime = async () => {
    try {
      setLoadingMore(true);
      const data = await fetchAniListData(GET_TOP_100_RANKED_ANIME, {
        page: 1,
      });
      setTop100AnimeList(data.data.Page.media);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center m-auto w-full mt-10"><Animation /></div>;
  if (error)
    return <p className="text-center mt-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 flex flex-col justify-center items-center m-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Top-Ranked Anime by Genre
      </h1>

      {/* Display top 5 anime for each genre */}
      <div className="p-4 flex flex-col items-center justify-center">
        {genres.map((genre) => (
          <div key={genre} className="mb-12 w-full max-w-7xl">
            <div className="flex">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                {genre}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-7 gap-y-6 mb-8 justify-center">
              {genreAnimeLists[genre]?.map((anime) => (
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
                        className="object-cover rounded-md shadow-md"
                      />
                    </div>
                  </div>

                  {/* Anime Title */}
                  <h3 className="font-semibold w-[180px]">
                    {anime.title.romaji}
                  </h3>
                  <p className="text-gray-500">Score: {anime.averageScore}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Button to load top 100 anime */}
      {top100AnimeList.length === 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={fetchTop100Anime}
            className="custom-button mb-10 w-full text-white px-7 py-4 rounded-xl"
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Show Top 100 Anime"}
          </button>
        </div>
      )}

      {/* Display top 100 anime */}
      {top100AnimeList.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Top 100 Ranked Anime
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {top100AnimeList.map((anime) => (
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
});
