import { Button } from "@/components/ui/button";
import LogoButton from "@/components/custom/landing-page/logo-button";
import CommunityCard from "@/components/custom/landing-page/community-card";
import VerticalDivider from "@/components/custom/landing-page/vertical-divider";
import HorizontalDivider from "@/components/custom/landing-page/horizontal-divider";
import LpNavbar from "@/components/custom/landing-page/lp-navbar";
import { communityCardDetails } from "@/constants/data";
import CarousalCard from "@/components/custom/landing-page/carousal-card";
import Testimonial from "@/components/custom/landing-page/testimonial";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link, useNavigate } from "react-router-dom";
import CustomOutlineButton from "@/components/custom/shared/CustomOutlineButton";
import { defaults } from "@/constants/defaults";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (

    <div>

      {/* Section 1 */}
      <LpNavbar />


      <div className=" flex flex-col lg:flex-row justify-between p-2 gap-2">
        <div className="mt-8 w-1/2   pl-10  ">
          <p className="text-5xl font-Poppins md:text-5xl font-semibold text-left mt-12 text-su_primary">
            Privacy Policy
          </p>
          <p className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10 ">
            Version as of April 8, 2024
          </p>

        </div>
        <div className="flex text-start md:text-start w-1/2  mt-10">
          <div className="flex w-full flex-col font-Poppins h-auto text-start md:text-start space-x-0 lg:flex-row  ">
            <div className="text-start md:text-start w-full   ">
              <div className="w-full">
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
                  Welcome to SwapUp's Privacy Policy. This document describes how we collect, use, and disclose your information when you use our service. We value your privacy and aim to provide transparency about our practices. By using SwapUp, you agree to the terms outlined in this Privacy Policy.
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
                  This Policy is intended to provide you with all the relevant information about the processing of your Data that may be collected on the website or the application (together “the Website”) by Shipup (“us” “our”) or any affiliated company (together “the Shipup Group”) in compliance with the GDPR and the “ Informatique et Libertés” law n°78-17 (for the needs of this Policy, the persons who will access the Website will be referred to as “you” and “your”). This Policy also describes your rights in relation to Data protection.
                </p>
                {/* section 1*/}
                <p className="text-su_primary font-Poppins text-base leading-14 mt-2 md:text-1.3xl ">
                  1. Interpretation and Definitions
                </p>
                {/* section 1.1*/}
                <p className="text-su_primary_light font-Poppins text-base leading-10 mt-2 md:text-1xl ">
                  Interpretation:
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-2">
                  The terms used in this Privacy Policy have specific meanings defined under certain conditions. These definitions are applicable regardless of whether they appear in singular or plural form.
                </p>

                {/* section 1.1*/}
                <p className="text-su_primary_light font-Poppins text-base leading-10 mt-2 md:text-1xl ">
                  Definitions:
                </p>
                <p className="h-2">{"   "}</p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4  md:mt-2 mb-2" >
                  • {"   "}   "Account" refers to the unique account created by users to access our service.
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4  md:mt-2 mb-2" >
                  • {"   "} "Company," "We," "Us," or "Our" refers to SwapUp.
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4 md:mt-2 mb-2" >
                  • {"   "}  "Cookies" are small files stored on your device by a website, containing details of your browsing history and preferences.
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4 md:mt-2 mb-2" >
                  •  {"   "} "Personal Data" refers to any information that relates to an identified or identifiable individual.
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4 md:mt-2 mb-2" >
                  •{"   "}   "Service" refers to SwapUp, accessible via our website or mobile application.
                </p>

                <p className="h-6">{"   "}</p>
                {/* section 2  */}
                <p className="text-su_primary font-Poppins text-base leading-14 mt-2 md:text-1.3xl ">
                  2. Collecting and Using Your Personal Data
                </p>
                {/* section 2.1 */}
                <p className="text-su_primary_light font-Poppins text-base leading-10 mt-2 md:text-1xl ">
                  Personal Data:
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  md:mt-2 mb-2" >
                  When you use SwapUp, we may request certain personally identifiable information, such as:
                </p>

                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4 md:mt-2 mb-2" >
                  • {"   "}Email address;
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4 md:mt-2 mb-2" >
                  • {"   "} First name and last name;
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4 md:mt-2 mb-2" >
                  • {"   "} Phone number;
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4 md:mt-2 mb-2" >
                  •  {"   "} Usage Data.
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  md:mt-2 mb-2" >
                  We collect this information to provide and improve our service, as well as to communicate with you. We may also use your data for KYC verification and share it with third-party service providers as necessary.
                </p>
                {/* section 2.2 */}
                <p className="text-su_primary_light font-Poppins text-base leading-10 mt-2  ml-4 md:text-1xl ">
                  Usage Data:
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  md:mt-2 mb-2" >
                  We automatically collect Usage Data, including information about your device and browsing behavior, to optimize our service and user experience.
                </p>
                {/* section 2.3 */}
                <p className="text-su_primary_light font-Poppins text-base leading-10 mt-2 md:text-1xl ">
                  Cookies:
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  md:mt-2 mb-2" >
                  SwapUp uses cookies and similar tracking technologies to track user activity and store certain information. You can manage your cookie preferences through your browser settings.
                </p>
                {/* section 2.4 */}
                <p className="text-su_primary_light font-Poppins text-base leading-10 mt-2 md:text-1xl ">
                  Sharing Your Personal Data:
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  md:mt-2 mb-2" >
                  We may share your Personal Data in the following circumstances:
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4 md:mt-2 mb-2" >
                  • {"   "}With service providers to facilitate our service.
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4 md:mt-2 mb-2" >
                  • {"   "} For business transfers, such as mergers or acquisitions.
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4 md:mt-2 mb-2" >
                  • {"   "} With affiliates and business partners.
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0 ml-4  md:mt-2 mb-2" >
                  •  {"   "} With other users when you interact publicly.
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  md:mt-2 mb-2" >
                  We collect this information to provide and improve our service, as well as to communicate with you. We may also use your data for KYC verification and share it with third-party service providers as necessary.
                </p>
                <p className="h-6">{"   "}</p>
                {/* section 3 */}
                <p className="text-su_primary font-Poppins text-base leading-14 mt-2 md:text-1.3xl ">
                  3. How We Use Your Information:
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  md:mt-2 mb-2" >
                  We may use your personal information for various purposes, including
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0 ml-10 md:mt-2 mb-2" >
                  • {"   "} Thank you for trusting SwapUp with your information!
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0 ml-10 md:mt-2 mb-2" >
                  • {"   "} Communicating with you
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-10 md:mt-2 mb-2" >
                  • {"   "} Analyzing usage data to improve our services
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0 ml-10 md:mt-2 mb-2" >
                  •  {"   "} Conducting identity verification
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0 ml-10 md:mt-2 mb-2" >
                  •  {"   "} Conducting identity verification
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  md:mt-2 mb-2" >
                  We may share your personal information with:
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0 ml-10 md:mt-2 mb-2" >
                  • {"   "} Service providers to facilitate our services;
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0 ml-10 md:mt-2 mb-2" >
                  • {"   "} Business partners for joint promotional activities;
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-10 md:mt-2 mb-2" >
                  • {"   "} Law enforcement agencies or regulators when required by law.
                </p>
                <p className="h-6">{"   "}</p>
                {/* section 4 */}
                <p className="text-su_primary font-Poppins text-base leading-14 mt-2 md:text-1.3xl ">
                  4. Changes to this Policy:
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  md:mt-2 mb-2" >
                  We may update this Privacy Policy periodically. Any changes will be posted on this page, and your continued use of SwapUp after the changes constitute your acceptance of the revised policy.
                </p>
                <p className="h-6">{"   "}</p>
                {/* section 5 */}
                <p className="text-su_primary font-Poppins text-base leading-14 mt-2 md:text-1.3xl ">
                  Contact Us
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  md:mt-2 mb-2" >
                  If you have any questions or concerns about this Privacy Policy, please contact us at [contact@email.com].
                </p>
                <p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  md:mt-2 mb-2" >
                  Thank you for trusting SwapUp with your information!
                </p>
                <p className="h-6">{"   "}</p>



              </div>
            </div>

          </div>
        </div>
      </div>




      {/* Footer Section */}
      <div>


        <div className="flex flex-col md:flex-row items-center md:justify-center">
          <div className="max-w-[auto] mt-12">



            <div className="flex justify-normal w-full mt-8 pb-8 overflow-x-auto  md:justify-center">
              <div className="flex space-x-0 md:space-x-0">

                <Link to={"https://x.com/Swapupdapp"} target="_blank" ><span >
                  <img src={'/assets/svgs/twiter.svg'} className="ml-0 md:ml-0  md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
                </span></Link>
                <Link to={"https://warpcast.com/swapupdapp"} target="_blank" ><span >
                  <img src={'/assets/svgs/Warpcast.svg'} className="ml-0 md:ml-0 w-4 h-5 md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
                </span></Link>
                <Link to={"https://discord.gg/RCvDRY9dW3"} target="_blank" ><span >
                  <img src={'/assets/svgs/Discord.svg'} className="ml-0 md:ml-0 w-4 h-5 md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
                </span></Link>
                <Link to={"https://medium.com/@swapup"} target="_blank" ><span >
                  <img src={'/assets/svgs/Medium.svg'} className="ml-0 md:ml-0 w-4 h-5 md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
                </span></Link>

              </div>
            </div>
            <div className="flex items-center gap-3 lg:gap-6 mb-10  md:justify-center" >
              <Link to={'/'} className="font-semibold">Legal Terms</Link>
              <Link to={'/'} className="font-semibold">Go Back</Link>
            </div>

            <div className="flex items-center gap-3 lg:gap-6 mb-10  md:justify-center" >
              <p className="text-su_secondary">Copyright © 2024 SwapUp, All Rights Reserved.</p>
            </div>

          </div>

        </div>

      </div>


    </div >
  );
};

export default PrivacyPolicy;
