import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Eye, MessageSquare } from "lucide-react";
import CategoryBadge from "@/components/blog/CategoryBadge";
import { formatDate } from "@/lib/utils";
import { PostWithRelations } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";

const LatestArticles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const { data, isLoading } = useQuery<{ posts: PostWithRelations[], total: number }>({
    queryKey: ["/api/posts", currentPage, postsPerPage],
    queryFn: async () => {
      const res = await fetch(`/api/posts?page=${currentPage}&limit=${postsPerPage}`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return await res.json();
    }
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the articles section
    document.getElementById('latest-articles')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div id="latest-articles" className="mb-12">
        <h2 className="font-heading font-bold text-2xl text-[#1a5276] mb-4">Latest Articles</h2>
        <div className="w-16 h-1 bg-[#48c9b0] mb-8"></div>
        
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
    );
  }

  if (!data || !data.posts || data.posts.length === 0) {
    return (
      <div id="latest-articles" className="mb-12">
        <h2 className="font-heading font-bold text-2xl text-[#1a5276] mb-4">Latest Articles</h2>
        <div className="w-16 h-1 bg-[#48c9b0] mb-8"></div>
        <p className="text-center text-gray-500 py-8">No articles found</p>
      </div>
    );
  }

  const { posts, total } = data;
  const totalPages = Math.ceil(total / postsPerPage);

  return (
    <div id="latest-articles" className="mb-12">
      <h2 className="font-heading font-bold text-2xl text-[#1a5276] mb-4">Latest Articles</h2>
      <div className="w-16 h-1 bg-[#48c9b0] mb-8"></div>
      
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <CategoryBadge category={post.category} variant="outline" />
              <h3 className="font-heading font-bold text-xl text-[#333333] mb-2 hover:text-[#1a5276] transition duration-150">
                <Link href={`/post/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <span className="font-accent text-sm text-[#333333] block">{post.author.name}</span>
                    <span className="font-accent text-xs text-gray-500">{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="text-xs">{post.viewCount}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span className="text-xs">{post.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default LatestArticles;
