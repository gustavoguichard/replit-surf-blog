import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Author, CategoryWithCount, Tag } from "@shared/schema";
import NewsletterForm from "./NewsletterForm";

interface SidebarProps {
  featuredAuthorId?: number;
}

const Sidebar = ({ featuredAuthorId }: SidebarProps) => {
  const { data: featuredAuthor } = useQuery<Author>({
    queryKey: ["/api/authors/featured"],
    enabled: !featuredAuthorId,
  });

  const { data: author } = useQuery<Author>({
    queryKey: ["/api/authors", featuredAuthorId],
    enabled: !!featuredAuthorId,
  });

  const { data: categories } = useQuery<CategoryWithCount[]>({
    queryKey: ["/api/categories"],
  });

  const { data: popularTags } = useQuery<Tag[]>({
    queryKey: ["/api/tags/popular"],
  });

  const displayedAuthor = featuredAuthorId ? author : featuredAuthor;

  return (
    <div>
      {/* Featured Author */}
      {displayedAuthor && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8 p-6">
          <h3 className="font-heading font-bold text-xl text-[#1a5276] mb-4">
            {featuredAuthorId ? "About the Author" : "Featured Author"}
          </h3>
          <div className="flex items-center mb-4">
            <img 
              src={displayedAuthor.avatar} 
              alt={displayedAuthor.name} 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="ml-4">
              <h4 className="font-heading font-bold text-lg">{displayedAuthor.name}</h4>
              <p className="text-gray-600 text-sm font-accent">{displayedAuthor.role}</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">{displayedAuthor.bio}</p>
          <div className="flex space-x-2">
            {displayedAuthor.socialTwitter && (
              <a 
                href={displayedAuthor.socialTwitter} 
                className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-lg"></i>
              </a>
            )}
            {displayedAuthor.socialInstagram && (
              <a 
                href={displayedAuthor.socialInstagram} 
                className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-lg"></i>
              </a>
            )}
            {displayedAuthor.socialYoutube && (
              <a 
                href={displayedAuthor.socialYoutube} 
                className="text-[#1a5276] hover:text-[#48c9b0] transition duration-150"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube text-lg"></i>
              </a>
            )}
          </div>
        </div>
      )}
      
      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8 p-6">
          <h3 className="font-heading font-bold text-xl text-[#1a5276] mb-4">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link 
                  href={`/category/${category.slug}`} 
                  className="flex items-center justify-between group"
                >
                  <span className="font-accent text-[#333333] group-hover:text-[#1a5276] transition duration-150">
                    {category.name}
                  </span>
                  <span className="bg-[#48c9b0] bg-opacity-10 text-[#48c9b0] text-xs font-accent px-2 py-1 rounded-full">
                    {category.postCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Popular Tags */}
      {popularTags && popularTags.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8 p-6">
          <h3 className="font-heading font-bold text-xl text-[#1a5276] mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link 
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="inline-block bg-[#f5f5f5] hover:bg-gray-200 text-[#333333] text-sm font-accent px-3 py-1 rounded-full transition duration-150"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Newsletter */}
      <div className="bg-[#1a5276] rounded-lg shadow-sm overflow-hidden p-6">
        <h3 className="font-heading font-bold text-xl text-white mb-2">Join Our Newsletter</h3>
        <p className="text-white text-opacity-90 font-accent text-sm mb-4">
          Get the latest surfing tips, destination guides, and exclusive content directly to your inbox.
        </p>
        <NewsletterForm isFooter={false} />
      </div>
    </div>
  );
};

export default Sidebar;
