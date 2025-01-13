import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

interface IProp {
  textToCopy: string;
  className?: string;
  children: any;
}

const CopyTile = ({ children, className, textToCopy, ...props }: IProp) => {
  const [textCopied, setTextCopied] = useState(false);

  useEffect(() => {
    if (textCopied) {
      setTimeout(() => {
        setTextCopied(false);
      }, 2000);
    }

  }, [textCopied]);
  return (
    <span
      className={cn(
        "bg-background text-text dark:bg-su_enable_bg dark:text-su_ternary text-xs flex items-center gap-2 py-1.5 px-3 rounded-xs",
        className
      )}
      {...props}
    >
      {children}

      {
        !textCopied ?
          <CopyToClipboard text={textToCopy} onCopy={() => setTextCopied(true)} >
            <svg className="size-3 cursor-pointer" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.17647 2.74282V12H0V2.74282H9.17647ZM12 0V9.25718H10.5882V1.37141H2.82353V0H12Z" fill="#B6B6BD" />
            </svg>
          </CopyToClipboard>
          :
          <CopyToClipboard text={textToCopy} onCopy={() => setTextCopied(true)} >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-su_ternary animate-bounce-once cursor-pointer">
              <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clipRule="evenodd" />
            </svg>
          </CopyToClipboard>
      }

    </span>
  );
};

export default CopyTile;