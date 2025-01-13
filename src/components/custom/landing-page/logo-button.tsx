import React from 'react';

interface LogoButtonProps {
  imgSrc: string;
  onClick?: () => void;
}

const LogoButton: React.FC<LogoButtonProps> = ({ imgSrc, onClick }) => {
  return (
    <button
      style={{
        backgroundColor: "transparent",
        border: "1px solid #FFFFFF14",
        padding: "8px 12px",
        borderRadius: "12px",
        height: "50px",
        width: "140px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#A39DAB"
      }}
      onClick={onClick}
    >
      <img src={imgSrc} alt="icon" style={{ marginRight: "5px" }} />
    </button>
  );
};

export default LogoButton;
