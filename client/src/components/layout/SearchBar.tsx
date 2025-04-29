import { useState } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  isMobile?: boolean;
}

const SearchBar = ({ isMobile = false }: SearchBarProps) => {
  const [_, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={isMobile ? "w-full" : ""}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`pl-10 pr-4 py-2 border border-gray-300 rounded-full font-accent text-sm focus:outline-none focus:ring-2 focus:ring-[#48c9b0] focus:border-transparent ${isMobile ? "w-full" : ""}`}
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <Search className="h-4 w-4" />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
