import React from "react";
import NextImage from "components/NextImage";

/**
 * Optimized remote/local image. Numeric dimensions reserve layout space and
 * Next Image generates appropriately sized AVIF/WebP variants when supported.
 */
const OptimizedImage = ({
  src,
  alt = "",
  width,
  height,
  sizes,
  placeholderSrc,
  objectFit = "cover",
  loading = "lazy",
  style,
  containerStyle,
  ...props
}) => {
  const numericWidth = Number(width);
  const numericHeight = Number(height);
  const hasDimensions =
    width != null &&
    height != null &&
    Number.isFinite(numericWidth) &&
    Number.isFinite(numericHeight) &&
    numericWidth > 0 &&
    numericHeight > 0;

  if (!hasDimensions) {
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        style={{ maxWidth: "100%", objectFit, ...style }}
        {...props}
      />
    );
  }

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        ...containerStyle,
      }}
    >
      <NextImage
        src={src}
        alt={alt}
        width={numericWidth}
        height={numericHeight}
        sizes={sizes || `${width}px`}
        altSrc={placeholderSrc}
        loading={loading}
        objectFit={objectFit}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit,
          ...style,
        }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
