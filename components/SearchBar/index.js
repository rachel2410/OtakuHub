"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex justify-center max-sm:w-[100px] mb-10">
      <input
        type="text"
        placeholder="Search for anime..."
        className="p-2 border-2 border-[#595168] focus:border-[#595168] focus-within:outline-none rounded-l-xl w-80 bg-[#3B3A4A]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="custom-button px-4 py-2 text-white rounded-r-xl">
        Search
      </button>
    </form>
  );
}
