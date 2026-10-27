import { useEffect, useState } from "react";

// Closed panels do not mount on startup. After the first open, retain them so
// closing and reopening a panel preserves its draft and navigation state.
const DeferredPanel = ({ open, children }) => {
  const [hasOpened, setHasOpened] = useState(Boolean(open));
  useEffect(() => {
    if (open) setHasOpened(true);
  }, [open]);
  return open || hasOpened ? children : null;
};

export default DeferredPanel;
