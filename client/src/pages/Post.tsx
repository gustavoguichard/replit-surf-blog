import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/blog/CategoryBadge";
import AuthorBio from "@/components/blog/AuthorBio";
import CommentSection from "@/components/blog/CommentSection";
import Sidebar from "@/components/blog/Sidebar";
import { PostWithRelations } from "@shared/schema";
import { Eye, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  
  const { data: post, isLoading, error } = useQuery<PostWithRelations>({
    queryKey: [`/api/posts/${slug}`],
  });
  
  useEffect(() => {
    // Prefetch related posts by the same author
    if (post?.authorId) {
      queryClient.prefetchQuery({
        queryKey: [`/api/authors/${post.authorId}/posts`],
      });
    }
  }, [post, queryClient]);
  
  if (isLoading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Skeleton className="h-6 w-20 mr-3" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-full mb-4" />
              <div className="flex items-center">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="ml-3">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-8">
              <Skeleton className="w-full h-96 rounded-lg" />
              <Skeleton className="h-4 w-72 mt-2" />
            </div>

            {/* Article Content */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-8 w-1/2 mt-6" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-heading font-bold text-[#1a5276] mb-4">
          {error ? "Error Loading Post" : "Post Not Found"}
        </h1>
        <p className="text-gray-600 mb-6">
          {error ? "There was an error loading this post. Please try again later." : "The post you are looking for does not exist or has been removed."}
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Surf's Up</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <div className="max-w-3xl">
                {/* Article Header */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <CategoryBadge category={post.category} />
                    <span className="text-gray-500 font-accent text-sm">{formatDate(post.publishedAt)}</span>
                  </div>
                  <h1 className="font-heading font-bold text-3xl md:text-4xl text-[#333333] mb-4">{post.title}</h1>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <span className="font-accent text-sm text-[#333333] block">By {post.author.name}</span>
                        <span className="font-accent text-sm text-gray-500">{post.author.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-sm">{post.viewCount}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{post.readTime} min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="mb-8">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title} 
                    className="w-full h-auto rounded-lg object-cover"
                  />
                  <p className="text-gray-500 text-sm mt-2 italic">Photo: {post.author.name}</p>
                </div>

                {/* Article Content */}
                <div 
                  className="article-body prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="my-8">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <a 
                          key={tag.id}
                          href={`/tag/${tag.slug}`}
                          className="inline-block bg-[#f5f5f5] hover:bg-gray-200 text-[#333333] text-sm font-accent px-3 py-1 rounded-full transition duration-150"
                        >
                          #{tag.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Author Bio */}
                <AuthorBio authorId={post.authorId} />
                
                {/* Comments Section */}
                <CommentSection postId={post.id} />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <Sidebar featuredAuthorId={post.authorId} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Post;
