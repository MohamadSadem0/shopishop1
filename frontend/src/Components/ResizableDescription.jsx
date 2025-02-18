import React, { useState, useRef, useEffect } from "react";

const ResizableDescription = ({ text, initialHeight = 50 }) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(initialHeight);
  const contentRef = useRef(null);

  useEffect(() => {
    // After rendering, update the contentHeight to the actual scrollHeight.
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [text]);

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="relative">
      <div
        ref={contentRef}
        style={{
          maxHeight: expanded ? `${contentHeight}px` : `${initialHeight}px`,
        }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
      {/* Gradient overlay shown when truncated */}
      {contentHeight > initialHeight && !expanded && (
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}
      {/* Toggle button */}
      {contentHeight > initialHeight && (
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
