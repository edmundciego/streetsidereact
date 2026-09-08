import dynamic from "next/dynamic";
import { Skeleton, Stack } from "@mui/material";

// Shared lazy wrapper for react-slick (used in 55+ home sections).
// - ssr:false keeps ~40kB slick code out of the initial server bundle
// - client-only render avoids hydration mismatch for carousels
// - Skeleton fallback prevents layout shift while chunk loads
// Usage: replace `import Slider from "react-slick"` with
// `import LazySlider from "components/common/LazySlider"` and use <LazySlider>.
const Slider = dynamic(() => import("react-slick"), {
  ssr: false,
  loading: () => (
    <Stack direction="row" spacing={2} sx={{ overflow: "hidden", py: 1 }}>
      <Skeleton variant="rounded" width="100%" height={160} />
    </Stack>
  ),
});

const LazySlider = (props) => <Slider {...props} />;

export default LazySlider;
