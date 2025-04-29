import { Link } from "wouter";
import { 
  Facebook, Twitter, Instagram, Youtube, Linkedin, Droplets 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import NewsletterForm from "@/components/blog/NewsletterForm";

const Footer = () => {
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: popularTags } = useQuery({
    queryKey: ["/api/tags/popular"],
  });

  return (
    <footer className="bg-[#1a5276] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="text-white mr-2">
                <Droplets className="h-6 w-6" />
              </div>
              <span className="font-heading font-bold text-2xl">Surf's Up</span>
            </div>
            <p className="font-accent text-white text-opacity-80 mb-4">
              Your go-to resource for surfing tips, destinations, equipment reviews, and ocean conservation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[#f39c12] transition duration-150" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" className="text-white hover:text-[#f39c12] transition duration-150" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" className="text-white hover:text-[#f39c12] transition duration-150" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" className="text-white hover:text-[#f39c12] transition duration-150" aria-label="YouTube">
                <Youtube />
              </a>
              <a href="#" className="text-white hover:text-[#f39c12] transition duration-150" aria-label="Linkedin">
                <Linkedin />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 font-accent">
              <li>
                <Link href="/" className="text-white text-opacity-80 hover:text-[#f39c12] transition duration-150">
                  Home
                </Link>
              </li>
              {categories?.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/category/${category.slug}`}
                    className="text-white text-opacity-80 hover:text-[#f39c12] transition duration-150"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/author/1" className="text-white text-opacity-80 hover:text-[#f39c12] transition duration-150">
                  Authors
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags?.slice(0, 10).map((tag) => (
                <Link 
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="inline-block bg-white bg-opacity-10 hover:bg-opacity-20 text-white text-xs font-accent px-3 py-1 rounded-full transition duration-150"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Newsletter</h3>
            <p className="font-accent text-white text-opacity-80 mb-4">
              Subscribe to get the latest articles, tips, and surf updates.
            </p>
            <NewsletterForm isFooter={true} />
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-accent text-white text-opacity-60 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Surf's Up Blog. All rights reserved.
          </p>
          <div className="flex space-x-6 font-accent text-white text-opacity-60 text-sm">
            <a href="#" className="hover:text-white transition duration-150">Privacy Policy</a>
            <a href="#" className="hover:text-white transition duration-150">Terms of Service</a>
            <a href="#" className="hover:text-white transition duration-150">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
