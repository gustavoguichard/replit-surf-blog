import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    let pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (pages[pages.length - 1] !== i - 1) {
        // Add ellipsis if there's a gap
        pages.push(-1);
      }
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (pages[pages.length - 1] !== totalPages - 1) {
      if (pages[pages.length - 1] !== -1) {
        pages.push(-1);
      }
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1 && pages[pages.length - 1] !== totalPages) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
      <Button
        variant="outline"
        className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-accent font-medium text-[#333333] hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      
      {pages.map((page, i) => (
        page === -1 ? (
          <span
            key={`ellipsis-${i}`}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-accent font-medium text-[#333333]"
          >
            …
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className={`relative inline-flex items-center px-4 py-2 border ${currentPage === page ? 'bg-[#1a5276] text-white' : 'border-gray-300 bg-white text-sm font-accent font-medium text-[#333333] hover:bg-[#f5f5f5]'}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        )
      ))}
      
      <Button
        variant="outline"
        className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-accent font-medium text-[#333333] hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </nav>
  );
}
