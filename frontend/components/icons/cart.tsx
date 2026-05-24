const Cart = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="52"
      height="50"
      viewBox="0 0 52 50"
      fill="none"
      className={className}
    >
      <path
        d="M10 12.5H44.475C45.1735 12.5 45.8643 12.6464 46.5028 12.9298C47.1414 13.2131 47.7134 13.6271 48.1821 14.145C48.6508 14.663 49.0058 15.2734 49.2242 15.9369C49.4426 16.6005 49.5195 17.3024 49.45 17.9975L47.95 32.9975C47.8266 34.2313 47.2492 35.3752 46.3299 36.2072C45.4106 37.0392 44.2149 37.5 42.975 37.5H19.1C17.9437 37.5005 16.8229 37.1001 15.9286 36.3671C15.0343 35.6342 14.4216 34.6139 14.195 33.48L10 12.5Z"
        stroke="white"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.5L7.975 4.3925C7.83957 3.85188 7.52738 3.37202 7.08802 3.02914C6.64866 2.68626 6.10732 2.50001 5.55 2.5H2.5M17.5 47.5H22.5M37.5 47.5H42.5"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Cart;
