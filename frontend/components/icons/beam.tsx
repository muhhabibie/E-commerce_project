interface BeamProps {
  className?: string;
  onText?: boolean;
}

const Beam = ({ className, onText }: BeamProps) => {
  return (
    <>
      {onText ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="382"
          height="398"
          viewBox="0 0 382 398"
          fill="none"
          className={className}
        >
          <path
            d="M369.556 122.944C369.556 252.148 170.405 398 44.6224 398C-81.1606 398 -172 252.148 -172 122.944C-172 -6.25961 16.0227 -111 141.806 -111C267.589 -111 428.163 -40.5231 369.556 122.944Z"
            fill="url(#paint0_radial_620_4968)"
          />
          <defs>
            <radialGradient
              id="paint0_radial_620_4968"
              cx="0"
              cy="0"
              r="1"
              gradientTransform="matrix(1.20503 233.944 -227.75 1.2378 141.806 122.944)"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FD6600" stopOpacity="0.5" />
              <stop offset="1" stopColor="#FD6600" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="432"
          height="231"
          viewBox="0 0 432 231"
          fill="none"
          className={className}
        >
          <path
            opacity="0.4"
            d="M414.76 45.8149L412.353 42.6758C392.108 15.8737 354.393 -0.880422 313.973 0.0357611C308.782 0.141511 303.606 0.537917 298.478 1.22229C261.584 6.24628 228.925 26.3648 214.746 52.8139C206.417 68.3665 203.605 86.4423 188.398 98.578C168.567 114.348 135.963 114.086 107.271 112.719C78.5792 111.352 45.9752 111.119 26.2343 126.987C13.894 136.922 1.38246 155.607 0.282737 169.297C-3.49417 216.022 31.0839 252.587 73.1708 269.746C115.258 286.906 172.209 287.62 219.154 281.672C284.885 273.336 358.35 238.221 397.201 197.008C436.051 155.794 443.055 92.007 414.76 45.8149Z"
            fill="url(#paint0_radial_620_4967)"
          />
          <defs>
            <radialGradient
              id="paint0_radial_620_4967"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(216 142.525) rotate(90) scale(142.525 216)"
            >
              <stop stopColor="#F8C600" />
              <stop offset="1" stopColor="#F8C600" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      )}
    </>
  );
};

export default Beam;
