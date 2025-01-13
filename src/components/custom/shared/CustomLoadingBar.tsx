import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface IProp {
  setIsDone: React.Dispatch<React.SetStateAction<boolean>>;
  isDone: boolean;
}


const CustomLoadingBar = ({ setIsDone, isDone }: IProp) => {
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 20);

    return () => {
      clearInterval(interval);

      setTimeout(() => {
        setIsDone(true);
      }, 1500);
    };
  }, []);

  useEffect(() => {
    if (isDone) {
      setProgress(100);
    }
  }, [isDone]);

  return (
    <div className="w-full bg-su_enable_bg h-9 overflow-hidden rounded-full">
      <span
        className={cn(
          "h-full transition-all duration-300 ease-in-out flex items-center justify-between px-4 rounded-full text-xs lg:text-sm text-su_primary font-semibold",
          progress === 100 ? "bg-green-700" : "bg-gradient-primary"
        )}
        style={{ width: `${progress}%` }}
      >
        {progress === 100 ? "Done" : "Sent"}

        {
          progress === 100 ?
            <svg className='w-4' viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.06671 10.0667L10.7667 5.36666L9.83337 4.43333L6.06671 8.2L4.16671 6.29999L3.23338 7.23333L6.06671 10.0667ZM7.00004 13.6667C6.07782 13.6667 5.21115 13.4916 4.40004 13.1413C3.58893 12.7911 2.88337 12.3162 2.28338 11.7167C1.68338 11.1171 1.20849 10.4116 0.858708 9.59999C0.50893 8.78844 0.333819 7.92177 0.333375 7C0.33293 6.07822 0.508042 5.21155 0.858708 4.4C1.20937 3.58844 1.68426 2.88288 2.28338 2.28333C2.88249 1.68377 3.58804 1.20888 4.40004 0.858662C5.21204 0.508439 6.07871 0.333328 7.00004 0.333328C7.92137 0.333328 8.78804 0.508439 9.60004 0.858662C10.412 1.20888 11.1176 1.68377 11.7167 2.28333C12.3158 2.88288 12.7909 3.58844 13.142 4.4C13.4932 5.21155 13.668 6.07822 13.6667 7C13.6654 7.92177 13.4903 8.78844 13.1414 9.59999C12.7925 10.4116 12.3176 11.1171 11.7167 11.7167C11.1158 12.3162 10.4103 12.7913 9.60004 13.142C8.78982 13.4927 7.92315 13.6676 7.00004 13.6667Z" fill="currentColor" />
            </svg>
            :
            <svg className="w-3" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.30169e-07 7.26756L3.08296 6.00028L4.30169e-07 4.7334L4.30169e-07 0.282089C-8.13349e-05 0.233112 0.0114944 0.184958 0.0335847 0.142384C0.055675 0.0998093 0.0875158 0.0642862 0.125963 0.0393223C0.16441 0.0143584 0.208133 0.000817141 0.252815 3.58382e-05C0.297496 -0.000745465 0.341591 0.0112601 0.380745 0.0348671L9.867 5.75362C9.90728 5.77793 9.94087 5.81364 9.96426 5.85703C9.98766 5.90041 10 5.94989 10 6.00028C10 6.05068 9.98766 6.10015 9.96426 6.14354C9.94087 6.18692 9.90728 6.22263 9.867 6.24694L0.380745 11.9651C0.34163 11.9887 0.297582 12.0007 0.252943 12C0.208304 11.9992 0.164616 11.9857 0.126184 11.9608C0.087752 11.9359 0.0559029 11.9005 0.033776 11.858C0.011649 11.8155 8.07357e-06 11.7674 4.30169e-07 11.7185L4.30169e-07 7.26756Z" fill="white" />
            </svg>
        }
      </span>
    </div>
  );
};

export default CustomLoadingBar;
