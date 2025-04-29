import { Helmet } from "react-helmet";
import HeroSection from "@/components/home/HeroSection";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import LatestArticles from "@/components/home/LatestArticles";
import AuthorSection from "@/components/home/AuthorSection";
import Sidebar from "@/components/blog/Sidebar";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Surf's Up - The Ultimate Surfing Blog</title>
        <meta name="description" content="Discover the world of surfing with tips, destinations, equipment reviews, and stories from experienced surfers." />
      </Helmet>

      <HeroSection />
      
      <FeaturedArticles />
      
      <div className="bg-[#f5f5f5] py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="w-full lg:w-2/3">
              <LatestArticles />
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
      
      <AuthorSection />
    </>
  );
};

export default Home;
