import { useEffect, useState } from "react";
import type { Notice } from "../types";

export function useNotice() {
  const [notice, setNoticeState] = useState<Notice | null>(null);

  const setNotice = (newNotice: Notice | null) => {
    setNoticeState(newNotice);
  };

  const clearNotice = () => {
    setNoticeState(null);
  };

  const showNotice = (type: Notice["type"], message: string) => {
    setNoticeState({ type, message });
  };

  useEffect(() => {
    if (notice) {
      const timer = window.setTimeout(() => setNoticeState(null), 6000);
      return () => window.clearTimeout(timer);
    }
    return;
  }, [notice]);

  return {
    notice,
    setNotice,
    clearNotice,
    showNotice,
  };
}
