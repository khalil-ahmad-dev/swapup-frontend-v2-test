import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface IProp {
  children: any;
}

const StaySafeDialog = ({ children }: IProp) => {

  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>

      <DialogContent className="w-[600px] p-4" >
        <div className="space-y-3" >
          {/* header */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-xl lg:text-1.5xl" >Stay safe!</h2>

              <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </DialogClose>
            </div>

            <p className="text-base lg:text-lg font-medium text-secondary dark:text-su_secondary">Here are some helpful tips for trading safely and avoiding scammers.</p>
          </div>

          <div className="custom-border-card" >
            <h2 className="text-sm lg:text-base text-primary font-bold text-text dark:text-su_primary" >Verify assets are correct</h2>
            <p className="text-xs lg:text-sm dark:text-su_secondary" >
              <span>
                Click the
                <svg className="w-3.5 inline-block mx-2" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.50268 6.06934C3.1801 6.06934 2.91464 6.33479 2.91464 6.65793L2.9152 10.3637C2.9152 10.6179 2.73039 10.8375 2.47669 10.8604C2.18884 10.8952 1.9581 10.9181 1.77329 10.9299C1.42719 10.9646 1.10405 10.7916 0.930994 10.4914C0.71202 10.1106 0.527208 9.71797 0.388879 9.30242C-0.879603 5.65379 1.05812 1.65961 4.7034 0.389449C8.34867 -0.880713 12.3395 1.05925 13.6085 4.70733C13.7239 5.03047 13.6662 5.37713 13.4584 5.64259C12.7662 6.54313 11.8892 7.29357 11.0357 7.91689V3.67966C11.0357 3.34476 10.7703 3.0793 10.4471 3.0793H9.45531C9.13216 3.0793 8.86671 3.35652 8.86671 3.67966V8.81687C8.86671 9.02521 8.75134 9.19826 8.56653 9.2789C8.32459 9.38251 8.0821 9.48668 8.0821 9.48668V5.18C8.0821 4.8451 7.80544 4.57964 7.4823 4.57964H6.49047C6.15613 4.57964 5.89067 4.85686 5.89067 5.18V9.82102C5.89067 10.0523 5.72882 10.2483 5.50985 10.306C5.348 10.3407 5.20967 10.3755 5.0943 10.4102V6.66969C5.0943 6.33479 4.81765 6.06934 4.4945 6.06934H3.50268ZM12.6613 11.1145C10.3893 14.2429 6.01706 14.9357 2.89093 12.6613C6.70926 12.1187 11.4276 10.3294 13.9763 6.50823L13.9779 6.53171C13.9886 6.68568 13.9993 6.8392 13.9993 6.99322C13.9993 8.4706 13.5266 9.91381 12.6613 11.1145Z" fill="#868691" />
                </svg>
              </span>
              icon on any asset card to be directed to the blockchain details of the asset.
            </p>
          </div>

          <div className="custom-border-card" >
            <h2 className="text-sm lg:text-base text-primary font-bold text-text dark:text-su_primary" >Use wallet security apps</h2>
            <p className="text-xs lg:text-sm dark:text-su_secondary" >
              Web3 is always evolving, and so are the security risks. Wallet security companies like
              <Link to={'https://www.kerberus.com/en?ref=SWAPUP'} target="_blank" className="link-style px-2" >Kerberus</Link>
              provide extension based solutions to help keep you safe while browsing the internet and transacting in web3.
            </p>
          </div>

          <div className="custom-border-card" >
            <h2 className="text-sm lg:text-base text-primary font-bold text-text dark:text-su_primary" >Avoid rushed trades</h2>
            <p className="text-xs lg:text-sm dark:text-su_secondary" >
              Don't do business with someone who is rushing the trade. It should be timely and beneficial for both of you.
            </p>
          </div>

          <div className="py-2" >
            <DialogClose className="w-full" ><Button variant={"default"} className="w-full" >Got it</Button></DialogClose>
          </div>

        </div>
      </DialogContent>
    </Dialog >
  );
};

export default StaySafeDialog;