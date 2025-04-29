import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import CategoryBadge from "@/components/blog/CategoryBadge";
import { formatDate } from "@/lib/utils";
import { PostWithRelations } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedArticles = () => {
  const { data: featuredPosts, isLoading } = useQuery<PostWithRelations[]>({
    queryKey: ["/api/posts/featured"],
  });

  if (isLoading) {
    return (
      <section id="featured" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="font-heading font-bold text-3xl text-[#1a5276] mb-4">Featured Articles</h2>
            <div className="w-20 h-1 bg-[#48c9b0]"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-1 lg:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-lg mb-4" />
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40 mt-1" />
                </div>
              </div>
            </div>
            
            <div className="col-span-1">
              <Skeleton className="h-[200px] w-full rounded-lg mb-4" />
              <div className="flex items-center mb-6">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="ml-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-32 mt-1" />
                </div>
              </div>
              
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <div className="flex items-center mt-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="ml-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-32 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredPosts || featuredPosts.length === 0) {
    return null;
  }

  const mainPost = featuredPosts[0];
  const sidePosts = featuredPosts.slice(1, 3);

  return (
    <section id="featured" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="font-heading font-bold text-3xl text-[#1a5276] mb-4">Featured Articles</h2>
          <div className="w-20 h-1 bg-[#48c9b0]"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main featured article */}
          <div className="col-span-1 lg:col-span-2">
            <Link href={`/post/${mainPost.slug}`} className="block group">
              <div className="relative h-[400px] rounded-lg overflow-hidden mb-4">
                <img 
                  src={mainPost.featuredImage} 
                  alt={mainPost.title} 
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 gradient-overlay">
                  <CategoryBadge category={mainPost.category} />
                  <h3 className="font-heading font-bold text-2xl text-white mb-2">{mainPost.title}</h3>
                  <p className="text-white text-opacity-90 font-accent hidden md:block">{mainPost.excerpt}</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center">
              <img 
                src={mainPost.author.avatar} 
                alt={mainPost.author.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <span className="font-accent text-sm text-[#333333] block">By {mainPost.author.name}</span>
                <span className="font-accent text-sm text-gray-500">
                  {formatDate(mainPost.publishedAt)} • {mainPost.readTime} min read
                </span>
              </div>
            </div>
          </div>
          
          {/* Side featured articles */}
          <div className="col-span-1">
            {sidePosts.map((post, index) => (
              <div key={post.id} className={index === 0 ? "mb-6" : ""}>
                <Link href={`/post/${post.slug}`} className="block group">
                  <div className="relative h-[200px] rounded-lg overflow-hidden mb-4">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 gradient-overlay">
                      <CategoryBadge category={post.category} size="small" />
                      <h3 className="font-heading font-bold text-lg text-white">{post.title}</h3>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center mb-6">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="ml-2">
                    <span className="font-accent text-xs text-[#333333] block">By {post.author.name}</span>
                    <span className="font-accent text-xs text-gray-500">
                      {formatDate(post.publishedAt)} • {post.readTime} min read
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
