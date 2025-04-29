import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import SearchBar from "./SearchBar";
import { Menu, X, Droplets } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="text-[#1a5276] mr-2">
                <Droplets className="h-6 w-6" />
              </div>
              <span className="font-heading font-bold text-2xl text-[#1a5276]">Surf's Up</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-[#333333] focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-accent font-medium hover:text-[#48c9b0] transition duration-150 ${location === '/' ? 'text-[#1a5276]' : 'text-[#333333]'}`}>
              Home
            </Link>
            <Link href="/category/destinations" className={`font-accent font-medium hover:text-[#1a5276] transition duration-150 ${location.startsWith('/category') ? 'text-[#1a5276]' : 'text-[#333333]'}`}>
              Categories
            </Link>
            <Link href="/author/1" className={`font-accent font-medium hover:text-[#1a5276] transition duration-150 ${location.startsWith('/author') ? 'text-[#1a5276]' : 'text-[#333333]'}`}>
              Authors
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-4 space-y-3 bg-white border-t">
            <Link href="/" className={`block px-3 py-2 font-accent font-medium rounded-md ${location === '/' ? 'text-[#1a5276]' : 'text-[#333333] hover:bg-[#f5f5f5]'}`}>
              Home
            </Link>
            <Link href="/category/destinations" className={`block px-3 py-2 font-accent font-medium rounded-md ${location.startsWith('/category') ? 'text-[#1a5276]' : 'text-[#333333] hover:bg-[#f5f5f5]'}`}>
              Categories
            </Link>
            <Link href="/author/1" className={`block px-3 py-2 font-accent font-medium rounded-md ${location.startsWith('/author') ? 'text-[#1a5276]' : 'text-[#333333] hover:bg-[#f5f5f5]'}`}>
              Authors
            </Link>
            <div className="relative mt-3 px-3">
              <SearchBar isMobile={true} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
