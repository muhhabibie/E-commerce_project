const Parking = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="13"
      viewBox="0 0 10 13"
      fill="none"
      className={className}
    >
      <path
        d="M1.5 11.5V7.5M1.5 7.5H5.29333C9.125 7.5 9.125 1.5 5.29333 1.5H1.5V7.5Z"
        stroke="#00825D"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Parking;
