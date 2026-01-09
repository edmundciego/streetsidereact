"use client";

import Image from "next/image";
import { useRef, useState, useMemo } from "react";
import placeholder from "../../public/static/no-image-found.png";

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#e5e4e4" offset="20%" />
      <stop stop-color="#ddd" offset="50%" />
      <stop stop-color="#e5e4e4" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#e5e4e4" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const NextImage = ({
   src,
   altSrc = placeholder,
   alt = "Image",
   width,
   height,
   objectFit,
   borderRadius,
   aspectRatio,
   sizes = undefined,
   ...props
 }) => {
  // Use ref to track the last valid src to prevent flicker
  const lastValidSrc = useRef(src || altSrc);
  const [errorFallback, setErrorFallback] = useState(false);
  
  // Determine the image source without causing unnecessary re-renders
  const imageSrc = useMemo(() => {
    if (errorFallback) {
      return altSrc;
    }
    if (src) {
      lastValidSrc.current = src;
      return src;
    }
    return lastValidSrc.current || altSrc;
  }, [src, errorFallback, altSrc]);

  const handleError = () => {
    if (!errorFallback) {
      setErrorFallback(true);
    }
  };

  // Conditionally create style object
  const style = {
    objectFit,
    borderRadius,
    aspectRatio,
    ...props.style, // allow passing additional styles
  };

  // Default sizes hint for responsive images
  const defaultSizes = sizes || `(max-width: 768px) 100vw, ${width}px`;

  // Memoize placeholder to prevent recalculation on every render
  const placeholderData = useMemo(
    () => `data:image/svg+xml;base64,${toBase64(shimmer(width || 100, height || 100))}`,
    [width, height]
  );

  return (
    <Image
      src={imageSrc}
      width={width}
      height={height}
      alt={alt}
      onError={handleError}
      placeholder={placeholderData}
      style={style}
      sizes={defaultSizes}
      {...props}
    />
  );
};

export default NextImage;
