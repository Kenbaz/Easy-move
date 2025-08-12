import { useEffect, useState } from "react";
import { usePathname } from "expo-router";

const TAB_ROUTES: Record<string, number> = {
  "/(dashboard)": 0, // index
  "/(dashboard)/services": 1,
  "/(dashboard)/activity": 2,
  "/(dashboard)/profile": 3,
};

export function useFocusedTab(): number | null {
  const pathname = usePathname();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log("Current pathname:", pathname); // Debug log
    // Map the current pathname to tab index
    const tabIndex = TAB_ROUTES[pathname];
    console.log("Tab index:", tabIndex); // Debug log
    setFocusedIndex(tabIndex !== undefined ? tabIndex : null);
  }, [pathname]);

  return focusedIndex;
}
