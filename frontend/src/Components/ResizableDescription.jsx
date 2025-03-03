import React, { useState, useRef, useEffect } from "react";

const ResizableDescription = ({ text, initialHeight = 50 }) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(initialHeight);
  // Use a responsive height value based on screen width.
  const [responsiveHeight, setResponsiveHeight] = useState(initialHeight);
  const contentRef = useRef(null);

  // Update the actual content height once rendered.
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [text]);

  // Update responsive height based on window size.
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setResponsiveHeight(40); // Mobile devices
      } else if (width < 1024) {
        setResponsiveHeight(50); // Tablets
      } else {
        setResponsiveHeight(initialHeight); // Desktop
      }
    };

    handleResize(); // Set initial height on mount.
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialHeight]);

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="relative">
      <div
        ref={contentRef}
        style={{
          maxHeight: expanded ? `${contentHeight}px` : `${responsiveHeight}px`,
        }}
        className="overflow-auto transition-all duration-300 ease-in-out"
      >
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
      {/* Gradient overlay when truncated */}
      {contentHeight > responsiveHeight && !expanded && (
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}
      {/* Toggle button */}
      {contentHeight > responsiveHeight && (
        <button
          onClick={toggleExpand}
          className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default ResizableDescription;
