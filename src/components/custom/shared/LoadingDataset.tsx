import { cn } from "@/lib/utils";

interface IProp {
  title?: string;
  description?: string;
  icon?: JSX.Element;
  className?: string;
  isLoading: boolean;
}

const LoadingDataset = ({ title, description, icon, className, isLoading }: IProp) => {

  return (
    <div
      className={cn(
        "relative w-full justify-center items-center h-[200px] lg:h-[300px]",
        className,
        isLoading ? "flex" : "hidden"
      )}
    >
      <div className="absolute lg:w-[497px] h-full bg-[rgba(217, 217, 217, 1)]" ></div>

      <div className="relative flex flex-col gap-3 items-center" >
        {
          icon ? icon :
            <svg className="w-8 animate-spin" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 0C7.66472 0 0.5 7.16472 0.5 16C0.5 24.8353 7.66472 32 16.5 32V28.0008C14.1269 28.0005 11.8072 27.2965 9.83423 25.9779C7.86123 24.6593 6.32352 22.7853 5.41553 20.5928C4.50754 18.4003 4.27006 15.9878 4.7331 13.6603C5.19615 11.3329 6.33892 9.19496 8.01694 7.51694C9.69496 5.83892 11.8329 4.69615 14.1603 4.2331C16.4878 3.77006 18.9003 4.00754 21.0928 4.91553C23.2853 5.82352 25.1593 7.36123 26.4779 9.33423C27.7965 11.3072 28.5005 13.6269 28.5008 16H32.5C32.5 7.16472 25.3353 0 16.5 0Z" fill="#565665" />
            </svg>
        }

        <div className="text-center" >
          <h3 className="font-semibold leading-8">{title ? title : "Loading"}</h3>
          <p className="text-sm text-su_secondary">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingDataset;