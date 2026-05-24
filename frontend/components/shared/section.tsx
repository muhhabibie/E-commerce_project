interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const Section = ({ children, className }: SectionProps) => {
  return <section className={`${className} px-6 font-primary`}>{children}</section>;
};

export default Section;
