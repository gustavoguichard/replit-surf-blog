import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-[500px] bg-[#1a5276] overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
        alt="Surfer on a wave" 
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Discover the World of Surfing
          </h1>
          <p className="font-accent text-xl text-white mb-8 max-w-3xl mx-auto">
            Riding waves, chasing horizons, and embracing the ocean lifestyle
          </p>
          <Link 
            href="#featured" 
            className="bg-[#f39c12] hover:bg-opacity-90 text-white font-accent font-medium px-8 py-3 rounded-md transition duration-150 inline-flex items-center"
          >
            <span>Explore Articles</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
