import { useState } from "react";

const useHandleSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return { isSidebarOpen, toggleSidebar };
};

export default useHandleSidebar;
