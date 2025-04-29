import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { PostWithRelations, Author as AuthorType } from "@shared/schema";
import PostCard from "@/components/blog/PostCard";
import Sidebar from "@/components/blog/Sidebar";
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin, FaTiktok, FaBehance } from "react-icons/fa";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Author = () => {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  
  const { data: author, isLoading: authorLoading } = useQuery<AuthorType>({
    queryKey: [`/api/authors/${id}`],
  });
  
  const { data: postsData, isLoading: postsLoading } = useQuery<{ posts: PostWithRelations[], total: number }>({
    queryKey: [`/api/authors/${id}/posts`, currentPage, postsPerPage],
    queryFn: async () => {
      const res = await fetch(`/api/authors/${id}/posts?page=${currentPage}&limit=${postsPerPage}`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return await res.json();
    },
    enabled: !!id,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (authorLoading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
            <Skeleton className="w-40 h-40 rounded-full" />
            <div className="md:flex-1 text-center md:text-left">
              <Skeleton className="h-8 w-48 mb-2 mx-auto md:mx-0" />
              <Skeleton className="h-5 w-32 mb-4 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex justify-center md:justify-start space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </div>
          </div>
          
          <div className="border-b border-gray-200 mb-8"></div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <h2 className="font-heading font-bold text-2xl text-[#1a5276] mb-6">Articles</h2>
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
  
  if (!author) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-heading font-bold text-[#1a5276] mb-4">Author Not Found</h1>
        <p className="text-gray-600 mb-6">The author you are looking for does not exist or has been removed.</p>
      </div>
    );
  }
  
  const totalPages = postsData ? Math.ceil(postsData.total / postsPerPage) : 0;

  return (
    <>
      <Helmet>
        <title>{author.name} | Surf's Up</title>
        <meta name="description" content={`Articles by ${author.name}. ${author.bio}`} />
      </Helmet>
      
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          {/* Author Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
            <img 
              src={author.avatar} 
              alt={author.name} 
              className="w-40 h-40 rounded-full object-cover"
            />
            <div className="md:flex-1 text-center md:text-left">
              <h1 className="font-heading font-bold text-3xl text-[#333333] mb-2">{author.name}</h1>
              <p className="text-[#1a5276] font-accent text-lg mb-4">{author.role}</p>
              <p className="text-gray-600 mb-6 max-w-3xl">{author.bio}</p>
              <div className="flex justify-center md:justify-start space-x-4">
                {author.socialTwitter && (
                  <a 
                    href={author.socialTwitter} 
                    className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150 text-xl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                  >
                    <FaTwitter />
                  </a>
                )}
                {author.socialInstagram && (
                  <a 
                    href={author.socialInstagram} 
                    className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150 text-xl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <FaInstagram />
                  </a>
                )}
                {author.socialYoutube && (
                  <a 
                    href={author.socialYoutube} 
                    className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150 text-xl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                  >
                    <FaYoutube />
                  </a>
                )}
                {author.socialLinkedin && (
                  <a 
                    href={author.socialLinkedin} 
                    className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150 text-xl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin />
                  </a>
                )}
                {author.socialTiktok && (
                  <a 
                    href={author.socialTiktok} 
                    className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150 text-xl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                  >
                    <FaTiktok />
                  </a>
                )}
                {author.socialBehance && (
                  <a 
                    href={author.socialBehance} 
                    className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150 text-xl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Behance"
                  >
                    <FaBehance />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-b border-gray-200 mb-8"></div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <h2 className="font-heading font-bold text-2xl text-[#1a5276] mb-6">Articles by {author.name}</h2>
              
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
                  <p className="text-gray-600">No articles found for this author.</p>
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
              <Sidebar featuredAuthorId={parseInt(id)} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Author;
