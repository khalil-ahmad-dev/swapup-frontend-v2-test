import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface IProp {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  navigateTo?: string;
  showBackgroundPicture?: boolean;
  icon?: JSX.Element;
  className?: string;
}

const EmptyDataset = ({ title, description, children, navigateTo, showBackgroundPicture = true, icon, className }: IProp) => {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        "relative w-full flex justify-center items-center h-[200px] lg:h-[386px]",
        className
      )}
    >
      {showBackgroundPicture &&
        <img className="absolute top-0 h-full" src="/assets/svgs/emptyBackground.svg" alt="" />
      }
      <div className="absolute lg:w-[497px] h-full bg-[rgba(217, 217, 217, 1)]" ></div>

      <div className="relative flex flex-col gap-3 items-center" >
        {
          icon ? icon :
            <svg className="w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.2544 0.452047C16.8086 -0.150682 15.1914 -0.150682 13.7456 0.452047L10.2416 1.91297L25.5888 8.04948L30.9872 5.90582C30.7652 5.71809 30.5171 5.56559 30.2512 5.45339L18.2544 0.452047ZM32 8.1482L17.2 14.0281V31.9984C17.5584 31.9238 17.9099 31.8146 18.2544 31.671L30.2512 26.6696C30.7679 26.4544 31.2104 26.0855 31.522 25.61C31.8336 25.1346 32 24.5744 32 24.0011V8.1482ZM14.8 31.9984V14.0281L0 8.1482V24.0028C0.00031523 24.5758 0.166903 25.1356 0.478443 25.6107C0.789984 26.0858 1.2323 26.4545 1.7488 26.6696L13.7456 31.671C14.0901 31.8135 14.4416 31.9216 14.8 31.9984ZM1.0128 5.90582L16 11.8597L22.2672 9.36892L6.9984 3.2653L1.7488 5.45339C1.47573 5.56746 1.2304 5.71827 1.0128 5.90582Z" fill="#565665" />
            </svg>
        }

        <div className="text-center" >
          <h3 className="font-semibold leading-8">{title ? title : "Page not found!"}</h3>
          <p
            className="text-sm text-su_secondary"
            dangerouslySetInnerHTML={{
              __html: description ? description : "Navigate to previous page!"
            }}
          ></p>
        </div>
        {
          !(title && description) && <Button className="gradient-button" onClick={() => { navigate(navigateTo ? navigateTo : ''); }} >Go back</Button>
        }
        {children}
      </div>
    </div>
  );
};

export default EmptyDataset;