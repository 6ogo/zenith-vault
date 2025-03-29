import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";

interface BoundedStickySidebarProps {
  className?: string;
  children: React.ReactNode;
  headerSelector?: string;
  footerSelector?: string;
  offsetTop?: number;
  offsetBottom?: number;
}

const BoundedStickySidebar: React.FC<BoundedStickySidebarProps> = ({
  className,
  children,
  headerSelector = "header",
  footerSelector = "footer",
  offsetTop = 0,
  offsetBottom = 0,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarStyles, setSidebarStyles] = useState<React.CSSProperties>({
    position: 'sticky',
    top: offsetTop,
  });
  
  useEffect(() => {
    // Get the header and footer elements
    const header = document.querySelector(headerSelector);
    const footer = document.querySelector(footerSelector);
    const sidebar = sidebarRef.current;
    
    if (!sidebar || !header || !footer) {
      console.warn('Could not find sidebar, header, or footer elements');
      return;
    }

    // Function to update the sidebar position
    const updateSidebarPosition = () => {
      const headerHeight = header.getBoundingClientRect().height;
      const footerTop = footer.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const sidebarHeight = sidebar.getBoundingClientRect().height;
      
      // Initial position: sticky with top offset
      let newStyles: React.CSSProperties = {
        position: 'sticky',
        top: headerHeight + offsetTop,
        transition: 'transform 0.1s ease-out'
      };
      
      // Check if sidebar bottom would overlap with footer
      const sidebarBottom = window.scrollY + headerHeight + offsetTop + sidebarHeight;
      const footerAbsoluteTop = window.scrollY + footerTop;
      
      // If sidebar would overlap footer, push it up just enough to prevent overlap
      if (sidebarBottom > footerAbsoluteTop - offsetBottom) {
        const translateY = footerAbsoluteTop - sidebarBottom - offsetBottom;
        newStyles.transform = `translateY(${translateY}px)`;
      }
      
      // If sidebar is taller than available space, make it scrollable
      if (sidebarHeight > windowHeight - headerHeight) {
        newStyles.maxHeight = `calc(100vh - ${headerHeight + offsetTop}px)`;
        newStyles.overflowY = 'auto';
      }
      
      setSidebarStyles(newStyles);
    };
    
    // Update on scroll and resize
    window.addEventListener('scroll', updateSidebarPosition);
    window.addEventListener('resize', updateSidebarPosition);
    
    // Initial update
    updateSidebarPosition();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', updateSidebarPosition);
      window.removeEventListener('resize', updateSidebarPosition);
    };
  }, [headerSelector, footerSelector, offsetTop, offsetBottom]);
  
  return (
    <div 
      ref={sidebarRef} 
      className={cn("bounded-sticky-sidebar", className)}
      style={sidebarStyles}
    >
      {children}
    </div>
  );
};

export default BoundedStickySidebar;