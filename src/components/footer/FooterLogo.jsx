import NextImage from "../NextImage";

const FooterLogo = ({ src, alt, height }) => (
  <NextImage
    src={src}
    alt={alt || "Business logo"}
    width={223}
    height={63}
    sizes="(max-width: 600px) 200px, 223px"
    objectFit="contain"
    loading="lazy"
    style={{
      display: "block",
      width: "auto",
      height,
      maxWidth: "100%",
    }}
  />
);

export default FooterLogo;
