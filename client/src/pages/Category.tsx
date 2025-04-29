import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { PostWithRelations, Category as CategoryType, Tag } from "@shared/schema";
import PostCard from "@/components/blog/PostCard";
import Sidebar from "@/components/blog/Sidebar";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [location] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  
  const isTagPage = location.startsWith('/tag/');
  
  const { data: category, isLoading: categoryLoading } = useQuery<CategoryType>({
    queryKey: [`/api/categories/${slug}`],
    enabled: !isTagPage,
  });
  
  const { data: tag, isLoading: tagLoading } = useQuery<Tag>({
    queryKey: [`/api/tags/${slug}`],
    enabled: isTagPage,
  });
  
  const { data: postsData, isLoading: postsLoading } = useQuery<{ posts: PostWithRelations[], total: number }>({
    queryKey: [isTagPage ? `/api/posts/tag/${slug}` : `/api/posts/category/${slug}`, currentPage, postsPerPage],
    queryFn: async () => {
      const url = isTagPage 
        ? `/api/posts/tag/${slug}?page=${currentPage}&limit=${postsPerPage}`
        : `/api/posts/category/${slug}?page=${currentPage}&limit=${postsPerPage}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return await res.json();
    },
    enabled: !!slug,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const isLoading = isTagPage ? tagLoading : categoryLoading;
  const entity = isTagPage ? tag : category;
  const title = isTagPage 
    ? `Posts tagged with ${tag?.name || slug}`
    : `${category?.name || 'Category'} Articles`;
  
  if (isLoading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <Skeleton className="h-10 w-64 mx-auto mb-2" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
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
            </div>
            
            <div className="w-full lg:w-1/3">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (!entity) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-heading font-bold text-[#1a5276] mb-4">
          {isTagPage ? 'Tag Not Found' : 'Category Not Found'}
        </h1>
        <p className="text-gray-600 mb-6">
          The {isTagPage ? 'tag' : 'category'} you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }
  
  const totalPages = postsData ? Math.ceil(postsData.total / postsPerPage) : 0;
  const displayName = isTagPage ? `#${tag.name}` : category.name;
  const description = isTagPage 
    ? `Browse all articles tagged with ${tag.name}` 
    : category.description || `Browse all articles in the ${category.name} category`;

  return (
    <>
      <Helmet>
        <title>{displayName} | Surf's Up</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="font-heading font-bold text-3xl text-[#1a5276] mb-3">{displayName}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              {postsLoading ? (
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
              ) : !postsData || postsData.posts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-600">No articles found for this {isTagPage ? 'tag' : 'category'}.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-8">
                    {postsData.posts.map((post) => (
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

export default Category;
