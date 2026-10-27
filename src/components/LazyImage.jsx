import React from "react";

/**
 * Let the browser defer below-the-fold images without an extra observer or
 * placeholder element. Native lazy loading keeps the image mounted, so it
 * won't disappear again when it scrolls out of view.
 */
const LazyImage = ({
  src,
  alt = "",
  loading = "lazy",
  decoding = "async",
  style,
  ...props
}) => (
  <img
    src={src}
    alt={alt}
    loading={loading}
    decoding={decoding}
    style={{ maxWidth: "100%", ...style }}
    {...props}
  />
);

export default LazyImage;
