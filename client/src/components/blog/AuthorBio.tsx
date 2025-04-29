import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Author } from "@shared/schema";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthorBioProps {
  authorId: number;
}

const AuthorBio = ({ authorId }: AuthorBioProps) => {
  const { data: author, isLoading } = useQuery<Author>({
    queryKey: ["/api/authors", authorId],
  });

  if (isLoading) {
    return (
      <div className="border-t border-b border-gray-200 py-8 my-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="mt-4 sm:mt-0 sm:ml-6">
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
            <div className="flex space-x-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <div className="border-t border-b border-gray-200 py-8 my-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <img 
          src={author.avatar} 
          alt={author.name} 
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="mt-4 sm:mt-0 sm:ml-6">
          <h3 className="font-heading font-bold text-xl text-[#333333] mb-2">About {author.name}</h3>
          <p className="text-gray-600 mb-3">{author.bio}</p>
          <div className="flex space-x-3">
            {author.socialTwitter && (
              <a 
                href={author.socialTwitter}
                className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150"
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
                className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            )}
            {author.socialLinkedin && (
              <a 
                href={author.socialLinkedin}
                className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            )}
          </div>
          <Link 
            href={`/author/${author.id}`}
            className="mt-2 inline-block text-[#1a5276] hover:text-[#48c9b0] font-accent transition duration-150"
          >
            View all posts by {author.name}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
