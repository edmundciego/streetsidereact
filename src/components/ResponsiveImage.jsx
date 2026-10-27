import React from "react";
import OptimizedImage from "./OptimizedImage";

/**
 * Responsive image using Next Image's generated srcset and the formats
 * configured in next.config.js. It deliberately doesn't guess that sibling
 * .webp/.avif files exist beside a dynamic CDN URL.
 */
const ResponsiveImage = ({ src, alt = "", sizes = "100vw", ...props }) => (
  <OptimizedImage src={src} alt={alt} sizes={sizes} {...props} />
);

export default ResponsiveImage;
