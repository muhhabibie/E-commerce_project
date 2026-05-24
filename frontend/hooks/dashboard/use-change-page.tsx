"use client"

import { useState } from "react";

const useChangePage = () => {
  type PageList = "overview" | "pos" | "analytics" | "inventory" | "sales" | "chat";

  const [activePage, setActivePage] = useState<PageList>("overview");

  const handlePage = (page: PageList) => {
    setActivePage(page);
  };

  return { activePage, handlePage };
};

export default useChangePage;
