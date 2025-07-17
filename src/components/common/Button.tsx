import React from "react";

interface ButtonProps {
  text: string | React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  link?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ text, className, onClick, link, disabled }) => {
  const buttonClass = `inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-opacity-90 transition duration-300 transform hover:-translate-y-1 hover:scale-105 ${className || ''}`;

  if (link) {
    return (
      <a href={link} className={buttonClass} onClick={onClick} >
        {text}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={buttonClass} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
