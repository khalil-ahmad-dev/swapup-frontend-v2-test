const VerticalDivider = ({ height = "h-full", gradient = "linear-gradient(to bottom, #C7C7C7 0%, #0D0D23 100%)" }) => {
    return (
      <div
        className={`w-px ${height} `}
        style={{ backgroundImage: gradient, width:"1px"}}
      />
    );
  };
  
  export default VerticalDivider;