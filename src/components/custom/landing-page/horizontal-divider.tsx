const HorizontalDivider = ({ width = "w-full", gradient = "linear-gradient(to right, #0D0D23 0%, #C7C7C7 50%, #0D0D23 100%)" }) => {
    return (
        <div
            className={`h-px ${width} block lg:hidden `}
            style={{ backgroundImage: gradient}}
        />
    );
};

export default HorizontalDivider;