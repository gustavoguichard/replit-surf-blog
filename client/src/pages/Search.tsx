import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PostWithRelations } from "@shared/schema";
import PostCard from "@/components/blog/PostCard";
import Sidebar from "@/components/blog/Sidebar";
import { Pagination } from "@/components/ui/pagination";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Search = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  
  // Extract query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location]);
  
  const { data, isLoading, isFetching } = useQuery<{ posts: PostWithRelations[], total: number }>({
    queryKey: [`/api/posts/search`, searchQuery, currentPage, postsPerPage],
    queryFn: async () => {
      if (!searchQuery.trim()) return { posts: [], total: 0 };
      
      const res = await fetch(`/api/posts/search?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=${postsPerPage}`);
      if (!res.ok) throw new Error('Failed to fetch search results');
      return await res.json();
    },
    enabled: !!searchQuery.trim(),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to page 1 when submitting a new search
    setCurrentPage(1);
  };
  
  const totalPages = data ? Math.ceil(data.total / postsPerPage) : 0;
  const isSearching = isLoading || isFetching;

  return (
    <>
      <Helmet>
        <title>{searchQuery ? `Search: ${searchQuery}` : 'Search'} | Surf's Up</title>
        <meta name="description" content="Search for surfing articles, tips, and stories" />
      </Helmet>
      
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="font-heading font-bold text-3xl text-[#1a5276] mb-6">Search Articles</h1>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Search for articles, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 border border-gray-300 rounded-full font-accent text-base focus:outline-none focus:ring-2 focus:ring-[#48c9b0] focus:border-transparent w-full"
                />
                <div className="absolute left-4 text-gray-400">
                  <SearchIcon className="h-5 w-5" />
                </div>
                <Button 
                  type="submit"
                  className="absolute right-2 bg-[#1a5276] hover:bg-opacity-90 text-white font-accent px-4 py-2 rounded-full"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              {/* Search results heading */}
              {searchQuery && (
                <div className="mb-6">
                  <h2 className="font-heading font-medium text-lg text-[#333333]">
                    {isSearching ? (
                      "Searching..."
                    ) : data && data.total > 0 ? (
                      `Found ${data.total} result${data.total === 1 ? '' : 's'} for "${searchQuery}"`
                    ) : (
                      `No results found for "${searchQuery}"`
                    )}
                  </h2>
                </div>
              )}
              
              {/* Search results */}
              {isSearching ? (
                // Loading state
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <Skeleton className="w-full h-48 md:h-full" />
                        </div>
                        <div className="p-6 md:w-2/3">
                          <Skeleton className="h-4 w-16 mb-3" />
                          <Skeleton className="h-6 w-full mb-2" />
                          <Skeleton className="h-4 w-full mb-4" />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <div className="ml-3">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32 mt-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !searchQuery ? (
                // Initial state - no search yet
                <div className="bg-[#f5f5f5] rounded-lg p-8 text-center">
                  <p className="text-gray-600">Enter a search term to find articles.</p>
                </div>
              ) : !data || data.posts.length === 0 ? (
                // No results
                <div className="bg-[#f5f5f5] rounded-lg p-8">
                  <p className="text-gray-600 text-center">No results found for your search.</p>
                  <div className="mt-4">
                    <h3 className="font-heading font-medium text-[#333333] mb-2">Suggestions:</h3>
                    <ul className="list-disc pl-5 text-gray-600">
                      <li>Check your spelling</li>
                      <li>Try more general keywords</li>
                      <li>Try different keywords</li>
                      <li>Browse categories instead</li>
                    </ul>
                  </div>
                </div>
              ) : (
                // Search results
                <>
                  <div className="space-y-8">
                    {data.posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                  
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="w-full lg:w-1/3">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
