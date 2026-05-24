import React from "react";

interface SearchNormalProps {
  className?: string;
}

const SearchNormal: React.FC<SearchNormalProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="23"
    height="23"
    viewBox="0 0 23 23"
    fill="currentColor"
    className={className}
  >
    <path
      d="M22 22L17.9167 17.9167M17.3333 9.16667C17.3333 10.2391 17.1221 11.3011 16.7117 12.2919C16.3013 13.2827 15.6997 14.183 14.9414 14.9414C14.183 15.6997 13.2827 16.3013 12.2919 16.7117C11.3011 17.1221 10.2391 17.3333 9.16667 17.3333C8.0942 17.3333 7.03224 17.1221 6.04142 16.7117C5.05059 16.3013 4.15031 15.6997 3.39196 14.9414C2.63362 14.183 2.03206 13.2827 1.62165 12.2919C1.21124 11.3011 1 10.2391 1 9.16667C1 7.00073 1.86041 4.92351 3.39196 3.39196C4.92351 1.86041 7.00073 1 9.16667 1C11.3326 1 13.4098 1.86041 14.9414 3.39196C16.4729 4.92351 17.3333 7.00073 17.3333 9.16667Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default SearchNormal;
