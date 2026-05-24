"use client";

import { useState } from "react";

const useClickLike = () => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const toggleLike = () => {
    setIsLiked((prevState) => !prevState);
  };

  return {
    isLiked,
    toggleLike,
  };
};

export default useClickLike;
