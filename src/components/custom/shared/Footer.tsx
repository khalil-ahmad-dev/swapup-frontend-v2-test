import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="m-4 text-3xs lg:text-sm flex items-center justify-between" >
      <div className="flex items-center gap-3 lg:gap-6" >
        <Link to={'/'} className="font-semibold">Legal Terms</Link>
        <Link to={'/'} className="font-semibold">Privacy Policy</Link>
      </div>

      <p className="text-su_secondary">Copyright © 2024 SwapUp, All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;