// components/ConnectButtonAuth.tsx
import { thirdWebClient, currentChain, paymentChain } from "../../../lib/thirdWebClient";
import { createWallet } from "thirdweb/wallets";
import { useProfileStore } from "@/store/profile";
import { cn, getShortenWalletAddress } from "@/lib/utils";
import CustomAvatar from "../shared/CustomAvatar";
import { Button } from "@/components/ui/button";
import { defaults } from "@/constants/defaults";
import { ConnectButton, useActiveWalletChain, useSwitchActiveWalletChain, useWalletDetailsModal } from "thirdweb/react";
import { useEffect, useState } from "react";
import { SUI_PurchaseData } from "@/types/payments.types";
import { SUE_PURCHASE_TYPE } from "@/constants/enums";
import { Environment } from "@/config";
import { useNavigate } from "react-router-dom";
// import {
//   LoginPayload,
//   VerifyLoginPayloadParams,
// } from "thirdweb/auth";
//import { get, post } from "../lib/api";


const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet", {
    walletConfig: { options: "smartWalletOnly" }
  })
];

interface IProp {
  className?: string;
  hideDetails?: boolean;
  hideAvatarButton?: boolean;
}

export default function ThirdWebWalletConnect({ className, hideDetails = false, hideAvatarButton = false }: IProp) {
  const [profile] = useProfileStore(state => [state.profile]);
  const [showSwitchNetworkButton, setShowSwitchNetworkButton] = useState(false);
  const navigate = useNavigate();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const detailsModal = useWalletDetailsModal();

  const handleSwitchNetwork = () => {
    switchChain(currentChain);
  };

  const handleOpenThirdwebDetailsDialog = () => {
    detailsModal.open({
      client: thirdWebClient,
      theme: defaults.thirdweb.getCustomTheme()
    });
  };

  useEffect(() => {
    if (activeChain && (activeChain !== currentChain)) {
      setShowSwitchNetworkButton(true);
    }

    if (activeChain && (activeChain === currentChain)) (
      setShowSwitchNetworkButton(false)
    );

  }, [activeChain, currentChain]);


  return (
    <>
      {
        showSwitchNetworkButton ?
          <Button
            onClick={handleSwitchNetwork}
            className={cn(
              "",
              hideAvatarButton && "hidden"
            )}
          >
            Switch Network
          </Button>
          :
          <div
            className={cn(
              "flex flex-col-reverse lg:flex-row lg:items-center gap-3",
              className
            )}
          >

            {(profile.wallet.isConnected && !hideDetails) &&
              <div
                onClick={handleOpenThirdwebDetailsDialog}
                className="cursor-pointer flex flex-col lg:flex-row lg:items-center gap-3 border-[1.5px] border-white/20 p-3 rounded-md"
              >
                <span className="flex justify-center lg:justify-start items-center gap-4 lg:gap-2" >
                  <svg
                    className="w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6667 8C11.0478 8 10.4543 8.24583 10.0168 8.68342C9.57917 9.121 9.33333 9.71449 9.33333 10.3333C9.33333 10.9522 9.57917 11.5457 10.0168 11.9832C10.4543 12.4208 11.0478 12.6667 11.6667 12.6667H16V16H0V4.66667H16V8H11.6667ZM12.3333 11.3333H11.6667C11.4015 11.3333 11.1471 11.228 10.9596 11.0404C10.772 10.8529 10.6667 10.5985 10.6667 10.3333C10.6667 10.0681 10.772 9.81376 10.9596 9.62623C11.1471 9.43869 11.4015 9.33333 11.6667 9.33333H12.3333C12.5985 9.33333 12.8529 9.43869 13.0404 9.62623C13.228 9.81376 13.3333 10.0681 13.3333 10.3333C13.3333 10.5985 13.228 10.8529 13.0404 11.0404C12.8529 11.228 12.5985 11.3333 12.3333 11.3333ZM10.6667 0L13.3333 3.33333H5.33333L10.6667 0Z" fill="#868691" />
                  </svg>

                  {getShortenWalletAddress(profile.wallet.address)}
                </span>

                <span className="border-b-[2px] border-b-white/20 lg:border-r-[2px] lg:border-r-white/20 lg:h-5" ></span>

                <span className="flex justify-center lg:justify-start items-center gap-4 lg:gap-2" >
                  <img src={profile.wallet.network.iconUrl} alt="" className="w-4 h-4" />

                  {profile.wallet.network.name}

                  <svg className="w-3" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2L6 6L2 2" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
                  </svg>
                </span>
              </div>
            }

            {(!hideAvatarButton && profile.wallet.isConnected) &&
              <CustomAvatar
                onClick={() => navigate("/swap-up/profile/wallet-overview")}
                imageSrc={profile.avatar}
                fallbackName={profile.details?.title || profile.ensAddress || "SwapUp User"}
                sizeClasses="w-12 h-12 lg:h-10 lg:w-10"
                className="mx-auto cursor-pointer hover:scale-110 transition duration-150 ease-in-out hover:shadow-md hover:shadow-su_least_bg"
              />
            }

            {!profile.wallet.isConnected &&
              <ConnectButton
                client={thirdWebClient}
                wallets={wallets}
                showAllWallets={false}
                chain={currentChain}
                theme={defaults.thirdweb.getCustomTheme()}
                appMetadata={{
                  name: "SwapUp",
                  logoUrl: '/assets/logos/swapup-logo-white.svg'
                }}

                detailsButton={{
                  style: {
                    borderRadius: "1rem",
                    padding: ".5rem .75rem",
                  },
                  render: () => (
                    <div className="" onClick={() => navigate("/swap-up/profile")} >
                      <CustomAvatar
                        imageSrc={profile.avatar}
                        fallbackName={profile.details?.title || profile.ensAddress || "SwapUp User"}
                        sizeClasses="w-12 h-12 lg:h-10 lg:w-10"
                        className="mx-auto cursor-pointer hover:scale-110 transition duration-150 ease-in-out hover:shadow-md hover:shadow-su_least_bg"
                      />
                    </div>
                  )
                }}

                connectButton={{
                  style: {
                    borderRadius: "1.5rem",
                    padding: '0',
                    border: 'none',
                    background: 'transparent',
                  },
                  label: <Button className="w-full h-full text-sm lg:text-base hover:scale-105 transition duration-300 ease-in-out" >Connect Wallet</Button>
                }}

                switchButton={{
                  style: {
                    borderRadius: "1.5rem",
                    padding: '0',
                    border: 'none',
                    background: 'red',
                    color: "white"
                  },
                  label: "Switch Network"
                  // label: <Button className="w-full h-full text-sm lg:text-base hover:scale-105 transition duration-300 ease-in-out" >Switch Network</Button>
                }}

                connectModal={{
                  showThirdwebBranding: false,
                  size: 'wide',
                  title: "Sign In to SwapUp",
                  welcomeScreen: {
                    img: {
                      src: "/assets/logos/swapup-logo-white.svg",
                      height: 50,
                    },
                    title: "Connect your wallet to SwapUp",
                    subtitle: "Wallet connection is required to get started."
                  }
                }}

                detailsModal={{
                  // footer: (props: { close: () => void; }) => (
                  //   <div className={cn(
                  //     'text-xs mt-2 text-center font-semibold',)}
                  //   >
                  //     Copyright © 2024 SwapUp, All Rights Reserved.
                  //   </div>
                  // ), 
                  connectedAccountAvatarUrl: profile.avatar,
                  payOptions: {
                    ...defaults.thirdweb.getCustomPaymentOptions(),
                    purchaseData: {
                      purchaseType: SUE_PURCHASE_TYPE.CRYPTO,
                      details: {
                        crypto: {
                          message: `${profile.wallet.address} user has successfully purchased crypto on ${paymentChain.name} network chain.`
                        }
                      },
                      paymentTriggeredFrom: {
                        environmentId: Environment.ENVIRONMENT_ID,
                        environmentKey: Environment.ENVIRONMENT_KEY
                      }
                    } as SUI_PurchaseData,
                    mode: "fund_wallet"
                  }
                }}

              //auth={{

              //  * 	`getLoginPayload` should @return {VerifyLoginPayloadParams} object.
              //  * 	This can be generated on the server with the generatePayload method.
              //  */
              // getLoginPayload: async (params: {
              //   address: string;
              // }): Promise<LoginPayload> => {
              //   return get({
              //     url: process.env.AUTH_API + "/login",
              //     params: {
              //       address: params.address,
              //       chainId: chain.id.toString(),
              //     },
              //   });
              // },
              // /**
              //  * 	`doLogin` performs any logic necessary to log the user in using the signed payload.
              //  * 	In this case, this means sending the payload to the server for it to set a JWT cookie for the user.
              //  */
              // doLogin: async (params: VerifyLoginPayloadParams) => {
              //   await post({
              //     url: process.env.AUTH_API + "/login",
              //     params,
              //   });
              // },
              // /**
              //  * 	`isLoggedIn` returns true or false to signal if the user is logged in.
              //  * 	Here, this is done by calling the server to check if the user has a valid JWT cookie set.
              //  */
              // isLoggedIn: async () => {
              //   return await get({
              //     url: process.env.AUTH_API + "/isLoggedIn",
              //   });
              // },
              // /**
              //  * 	`doLogout` performs any logic necessary to log the user out.
              //  * 	In this case, this means sending a request to the server to clear the JWT cookie.
              //  */
              // doLogout: async () => {
              //   await post({
              //     url: process.env.AUTH_API + "/logout",
              //   });
              //},
              //}}
              />
            }

          </div>
      }
    </>
  );
}
