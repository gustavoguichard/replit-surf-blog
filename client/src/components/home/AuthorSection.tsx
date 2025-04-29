import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Author } from "@shared/schema";
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin, FaTiktok, FaBehance } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

const AuthorSection = () => {
  const { data: authors, isLoading } = useQuery<Author[]>({
    queryKey: ["/api/authors"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="font-heading font-bold text-3xl text-[#1a5276] mb-4">Meet Our Authors</h2>
            <div className="w-20 h-1 bg-[#48c9b0]"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#f5f5f5] rounded-lg overflow-hidden transition duration-300 hover:shadow-md">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex space-x-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!authors || authors.length === 0) {
    return null;
  }

  const displayedAuthors = authors.slice(0, 4);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="font-heading font-bold text-3xl text-[#1a5276] mb-4">Meet Our Authors</h2>
          <div className="w-20 h-1 bg-[#48c9b0]"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedAuthors.map((author) => (
            <div 
              key={author.id} 
              className="bg-[#f5f5f5] rounded-lg overflow-hidden transition duration-300 hover:shadow-md"
            >
              <img 
                src={author.avatar} 
                alt={author.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-heading font-bold text-xl text-[#333333] mb-2">{author.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{author.bio}</p>
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
                  {author.socialYoutube && (
                    <a 
                      href={author.socialYoutube}
                      className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150"
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
                      className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150"
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
                      className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150"
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
                      className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150"
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
          ))}
        </div>
        
        {authors.length > 4 && (
          <div className="text-center mt-10">
            <Link 
              href="/authors"
              className="inline-flex items-center font-accent font-medium text-[#1a5276] hover:text-[#48c9b0] transition duration-150"
            >
              <span>View all authors</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default AuthorSection;
