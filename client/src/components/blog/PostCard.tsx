import { Link } from "wouter";
import { Eye, MessageSquare } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import { formatDate } from "@/lib/utils";
import { PostWithRelations } from "@shared/schema";

interface PostCardProps {
  post: PostWithRelations;
  variant?: "horizontal" | "vertical";
  showExcerpt?: boolean;
}

const PostCard = ({ post, variant = "horizontal", showExcerpt = true }: PostCardProps) => {
  if (variant === "vertical") {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
        <Link href={`/post/${post.slug}`} className="block group flex-shrink-0">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 p-3 z-10">
              <CategoryBadge category={post.category} />
            </div>
          </div>
        </Link>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-heading font-bold text-lg text-[#333333] mb-2 line-clamp-2">
            <Link href={`/post/${post.slug}`} className="hover:text-[#1a5276] transition duration-150">
              {post.title}
            </Link>
          </h3>
          {showExcerpt && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{post.excerpt}</p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="ml-2">
                <span className="font-accent text-xs text-[#333333] block">{post.author.name}</span>
                <span className="font-accent text-xs text-gray-500">{formatDate(post.publishedAt)}</span>
              </div>
            </div>
            <div className="flex items-center text-gray-500 space-x-3">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span className="text-xs">{post.viewCount}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                <span className="text-xs">{post.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="md:flex">
        <div className="md:w-1/3">
          <Link href={`/post/${post.slug}`} className="block h-full">
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              className="w-full h-48 md:h-full object-cover"
            />
          </Link>
        </div>
        <div className="p-6 md:w-2/3">
          <CategoryBadge category={post.category} variant="outline" />
          <h3 className="font-heading font-bold text-xl text-[#333333] mb-2 hover:text-[#1a5276] transition duration-150">
            <Link href={`/post/${post.slug}`}>{post.title}</Link>
          </h3>
          {showExcerpt && (
            <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="ml-3">
                <span className="font-accent text-sm text-[#333333] block">
                  {post.author.name}
                </span>
                <span className="font-accent text-xs text-gray-500">
                  {formatDate(post.publishedAt)} • {post.readTime} min read
                </span>
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
  );
};

export default PostCard;
