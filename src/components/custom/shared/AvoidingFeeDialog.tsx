import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface IProp {
  children: any;
  className?: string;
}

const AvoidingFeeDialog = ({ children, className, ...props }: IProp) => {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "",
          className
        )}
        {...props}
      >
        {children}
      </DialogTrigger>

      <DialogContent className="w-[400px] p-4" >
        <div className="space-y-3" >
          {/* header */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-xl lg:text-1.5xl" >Bypass fees with subdomain ownership 🚀</h2>

              <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </DialogClose>
            </div>

            <p className="text-base lg:text-lg font-medium text-secondary dark:text-su_secondary">Extra functionality for having a subdomain:</p>
          </div>

          <div className="custom-border-card flex items-start gap-3" >
            <div className="pt-2" >
              <svg className="w-4" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 13H16V15H0L0 13ZM0 2.36842L4 4.73684L8 0L12 4.73684L16 2.36842V12H0V2.36842Z" fill="#868691" />
              </svg>
            </div>

            <div>
              <h2 className="text-sm lg:text-base text-primary font-bold text-text dark:text-su_primary" >No SwapUp Fees</h2>
              <p className="text-xs lg:text-sm dark:text-su_secondary" >
                Platform fees are waived for users who own a subdomain.
              </p>
            </div>
          </div>

          <div className="custom-border-card flex items-start gap-3" >
            <div className="pt-1.5" >
              <svg className="w-4" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.2857 0C8.23976 0 6.2776 0.842854 4.83089 2.34314C3.38418 3.84344 2.57143 5.87827 2.57143 8H0L3.33429 11.4578L3.39429 11.5822L6.85714 8H4.28571C4.28571 4.56 6.96857 1.77778 10.2857 1.77778C13.6029 1.77778 16.2857 4.56 16.2857 8C16.2857 11.44 13.6029 14.2222 10.2857 14.2222C8.63143 14.2222 7.13143 13.52 6.05143 12.3911L4.83429 13.6533C5.54864 14.3982 6.39813 14.9891 7.33377 15.3919C8.26941 15.7946 9.27267 16.0013 10.2857 16C12.3317 16 14.2938 15.1571 15.7405 13.6568C17.1872 12.1566 18 10.1217 18 8C18 5.87827 17.1872 3.84344 15.7405 2.34314C14.2938 0.842854 12.3317 3.16163e-08 10.2857 0ZM9.42857 4.44444V8.88889L13.0714 11.1289L13.7314 9.99111L10.7143 8.13333V4.44444H9.42857Z" fill="#868691" />
              </svg>
            </div>

            <div>
              <h2 className="text-sm lg:text-base text-primary font-bold text-text dark:text-su_primary" >Multichain</h2>
              <p className="text-xs lg:text-sm dark:text-su_secondary" >
                Your subdomain is multichain so every wallet you add, fees are waived for trades on that chain too.
              </p>
            </div>
          </div>

          <div className="custom-border-card flex items-start gap-3" >
            <div className="pt-2" >
              <svg className="w-3" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.75 10.5433V15.6298C9.75001 15.6953 9.73242 15.7596 9.69902 15.8162C9.66563 15.8728 9.61761 15.9196 9.55989 15.9519C9.50217 15.9842 9.43679 16.0008 9.37045 16C9.30411 15.9992 9.23916 15.981 9.18225 15.9474L6 14.0628L2.81775 15.9474C2.76078 15.9811 2.69577 15.9992 2.62936 16C2.56295 16.0007 2.49753 15.9841 2.43978 15.9517C2.38204 15.9193 2.33404 15.8724 2.30069 15.8157C2.26735 15.759 2.24985 15.6946 2.25 15.6291V10.544C1.27961 9.77722 0.574494 8.73192 0.232094 7.55254C-0.110306 6.37317 -0.0730831 5.11795 0.338618 3.96036C0.75032 2.80277 1.51617 1.79995 2.53034 1.0905C3.5445 0.381054 4.75691 0 6 0C7.24309 0 8.4555 0.381054 9.46966 1.0905C10.4838 1.79995 11.2497 2.80277 11.6614 3.96036C12.0731 5.11795 12.1103 6.37317 11.7679 7.55254C11.4255 8.73192 10.7204 9.77722 9.75 10.544M6 10.3619C7.19347 10.3619 8.33807 9.894 9.18198 9.06113C10.0259 8.22825 10.5 7.09863 10.5 5.92077C10.5 4.74291 10.0259 3.61329 9.18198 2.78041C8.33807 1.94754 7.19347 1.47964 6 1.47964C4.80653 1.47964 3.66193 1.94754 2.81802 2.78041C1.97411 3.61329 1.5 4.74291 1.5 5.92077C1.5 7.09863 1.97411 8.22825 2.81802 9.06113C3.66193 9.894 4.80653 10.3619 6 10.3619ZM6 8.88153C5.20435 8.88153 4.44129 8.56959 3.87868 8.01434C3.31607 7.45909 3 6.70601 3 5.92077C3 5.13553 3.31607 4.38245 3.87868 3.8272C4.44129 3.27195 5.20435 2.96001 6 2.96001C6.79565 2.96001 7.55871 3.27195 8.12132 3.8272C8.68393 4.38245 9 5.13553 9 5.92077C9 6.70601 8.68393 7.45909 8.12132 8.01434C7.55871 8.56959 6.79565 8.88153 6 8.88153Z" fill="#868691" />
              </svg>
            </div>

            <div>
              <h2 className="text-sm lg:text-base text-primary font-bold text-text dark:text-su_primary" >Earn More</h2>
              <p className="text-xs lg:text-sm dark:text-su_secondary" >
                Connect multiple wallets to earn points across all our supported networks for your SwapUp trading activity.
              </p>
            </div>
          </div>

          <div className="py-2" >
            <Button
              variant={"default"}
              className="w-full"
              onClick={() =>
                toast.info("Mint your subdomain", {
                  position: 'bottom-left',
                  duration: 2000,
                  description: "This feature is available now under Profile Tab --> Wallet Subsection!",
                  action: {
                    label: "Close",
                    onClick: () => console.log("Close"),
                  },
                  className: '!bg-gradient-primary border-none',
                  descriptionClassName: '!text-white',
                })
              }
            >
              Mint your subdomain
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog >
  );
};

export default AvoidingFeeDialog;