import { Link } from "wouter";
import { Category } from "@shared/schema";

interface CategoryBadgeProps {
  category: Category;
  variant?: "default" | "outline";
  size?: "default" | "small";
}

const CategoryBadge = ({ 
  category, 
  variant = "default",
  size = "default" 
}: CategoryBadgeProps) => {
  const sizeClasses = size === "small" 
    ? "text-xs px-2 py-1 mb-2" 
    : "text-sm px-3 py-1 mb-3";
    
  if (variant === "outline") {
    return (
      <Link 
        href={`/category/${category.slug}`}
        className={`inline-block bg-[#48c9b0] bg-opacity-10 text-[#48c9b0] font-accent ${sizeClasses} rounded-full`}
      >
        {category.name}
      </Link>
    );
  }
  
  return (
    <Link 
      href={`/category/${category.slug}`}
      className={`inline-block bg-[#48c9b0] text-white font-accent ${sizeClasses} rounded-full`}
    >
      {category.name}
    </Link>
  );
};

export default CategoryBadge;
