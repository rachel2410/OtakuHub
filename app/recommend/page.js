"use client";
import { useState, useEffect } from "react";
import { fetchAniListData } from "@/lib/anilistFetch";
import Link from "next/link";
import Input from "@/components/Input";
import { Button, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const GET_RECOMMENDATIONS = `
  query ($search: String) {
    Media(search: $search, type: ANIME) {
      id
      recommendations(page: 1, perPage: 10) {
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

const GET_ANIME_SUGGESTIONS = `
  query ($search: String) {
    Page(page: 1, perPage: 5) {
      media(search: $search, type: ANIME) {
        id
        title {
          romaji
        }
      }
    }
  }
`;

export default function RecommendationsPage() {
  const [watchedAnime, setWatchedAnime] = useState([]);
  const [inputAnime, setInputAnime] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load watched anime and recommendations from local storage on mount
  useEffect(() => {
    const storedWatchedAnime =
      JSON.parse(localStorage.getItem("watchedAnime")) || [];
    setWatchedAnime(storedWatchedAnime);

    if (storedWatchedAnime.length > 0) {
      fetchRecommendationsForWatchedList(storedWatchedAnime);
    }
  }, []);

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const data = await fetchAniListData(GET_ANIME_SUGGESTIONS, {
        search: searchTerm,
      });
      setSuggestions(data.data.Page.media);
    } catch (err) {
      setSuggestions([]);
    }
  };

  // Function to add a new anime to the watched list
  const addWatchedAnime = async (e) => {
    e.preventDefault();
    if (!inputAnime.trim()) return;

    // Prevent adding the same anime multiple times
    if (watchedAnime.includes(inputAnime)) {
      setInputAnime("");
      setSuggestions([]);
      return;
    }

    const updatedWatchedAnime = [...watchedAnime, inputAnime];
    setWatchedAnime(updatedWatchedAnime);
    localStorage.setItem("watchedAnime", JSON.stringify(updatedWatchedAnime));
    setInputAnime("");
    setSuggestions([]);

    await fetchRecommendations(inputAnime);
  };

  // Function to fetch recommendations for a single anime
  const fetchRecommendations = async (animeTitle) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAniListData(GET_RECOMMENDATIONS, {
        search: animeTitle,
      });
      const recommendedNodes = data.data.Media?.recommendations?.nodes || [];
      const newRecommendations = recommendedNodes.map(
        (node) => node.mediaRecommendation
      );

      // Combine new recommendations with existing ones, avoiding duplicates
      setRecommendations((prevRecommendations) => {
        const combinedRecommendations = [...prevRecommendations];

        newRecommendations.forEach((anime) => {
          if (!combinedRecommendations.some((item) => item.id === anime.id)) {
            combinedRecommendations.push(anime);
          }
        });

        return combinedRecommendations;
      });
    } catch (err) {
      setError("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch recommendations for the entire watched list
  const fetchRecommendationsForWatchedList = async (watchedList) => {
    setRecommendations([]);
    for (const anime of watchedList) {
      await fetchRecommendations(anime);
    }
  };

  // Function to remove an anime from the watched list and update recommendations
  const removeWatchedAnime = async (index) => {
    const updatedWatchedAnime = watchedAnime.filter((_, i) => i !== index);
    setWatchedAnime(updatedWatchedAnime);
    localStorage.setItem("watchedAnime", JSON.stringify(updatedWatchedAnime));

    if (updatedWatchedAnime.length > 0) {
      await fetchRecommendationsForWatchedList(updatedWatchedAnime);
    } else {
      setRecommendations([]);
      localStorage.removeItem("recommendations");
    }
  };

  // Function to clear the watched list
  const clearWatchedList = () => {
    setWatchedAnime([]);
    localStorage.removeItem("watchedAnime");
    setRecommendations([]);
    localStorage.removeItem("recommendations");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Anime Recommendations</h1>

      <form onSubmit={addWatchedAnime} className="relative mb-4">
        <div className="flex">
          <Input
            type="text"
            placeholder="Enter anime you've watched..."
            value={inputAnime}
            onChange={(e) => {
              setInputAnime(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            styles="w-full border-4 rounded-l"
          />
          <button
            type="submit"
            className="custom-button px-4 py-2 max-h-12 rounded-r"
          >
            Add
          </button>
        </div>

        {/* Display suggestions */}
        {suggestions.length > 0 && (
          <ul className="border-4 border-[#595168] rounded w-full mt-1 max-h-40 overflow-y-auto">
            {suggestions.map((anime) => (
              <li
                key={anime.id}
                className="p-2 hover:bg-[#595168] cursor-pointer"
                onClick={() => {
                  setInputAnime(anime.title.romaji);
                  setSuggestions([]);
                }}
              >
                {anime.title.romaji}
              </li>
            ))}
          </ul>
        )}
      </form>

      {watchedAnime.length > 0 && (
        <div className="mb-4 w-full">
          <h2 className="text-2xl font-semibold mb-2">Watched Anime</h2>
          <div className="flex w-full items-center">
            <Paper
              elevation={0}
              sx={{
                backgroundColor: "#3B3A4A",
                width: "100%",
                border: "4px solid #595168",
              }}
              className="flex flex-wrap gap-4 p-[5px]"
            >
              {watchedAnime.map((anime, index) => (
                <div
                  key={index}
                  className="flex items-center bg-[#252330] text-white rounded-full px-4 py-2"
                >
                  <span className="mr-2">{anime}</span>
                  <button
                    onClick={() => removeWatchedAnime(index)}
                    className="text-white rounded-full p-1"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
              ))}
            </Paper>
            <button
              onClick={clearWatchedList}
              className="bg-red-500 text-white px-4 py-2 rounded-r"
            >
              Clear List
            </button>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-center mt-4">Loading recommendations...</p>
      )}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recommended Anime</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recommendations.map((anime) => (
              <Link
                key={anime.id}
                href={`/anime/${anime.id}`}
                className="text-center block"
              >
                <img
                  src={anime.coverImage.large}
                  alt={anime.title.romaji}
                  className="rounded mb-2"
                />
                <h3 className="font-semibold">{anime.title.romaji}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
