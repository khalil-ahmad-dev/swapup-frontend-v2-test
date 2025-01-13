import CustomAvatar from '@/components/custom/shared/CustomAvatar';
import CustomOutlineButton from '@/components/custom/shared/CustomOutlineButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Environment } from '@/config';
import { defaults } from '@/constants/defaults';
import { handleShowNotificationToast } from '@/lib/helpers';
import { paymentChain, thirdWebClient } from '@/lib/thirdWebClient';
import { getEthereumCurrencyTokenApi, mintNewSubnameOnL2Api, treasurySmartWalletBalanceCheckApi } from '@/service/api';
import { useGlobalStore } from '@/store/global-store';
import { useProfileStore } from '@/store/profile';
import { SUI_CurrencyChainItem, SUI_MintSubnamePayload } from '@/types/global.types';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { PayEmbed, } from 'thirdweb/react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SUI_PurchaseData } from '@/types/payments.types';
import { SUE_PaymentMode, SUE_PURCHASE_TYPE } from '@/constants/enums';
import { Address } from 'thirdweb';
import LoadingDataset from '@/components/custom/shared/LoadingDataset';


interface IProp {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  handleNavigationOfSteps: (navigationMode: "NEXT" | "PREVIOUS") => void;
}

const ConfirmSubnameDialog = ({ handleNavigationOfSteps, open, setOpen }: IProp) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [openPaymentSection, setOpenPaymentSection] = useState(false);
  const [paymentTransactionHash, setPaymentTransactionHash] = useState('');

  const [chargesInWei, setChargesInWei] = useState<bigint | null>(null);
  const [chargesInEth, setChargesInEth] = useState('');

  const [name, action, subname, setTransactionHash, avatar, isPremium, title, wallet] = useProfileStore(state => [
    state.overviewTab.subdomainSection.createNewSubdomain.name,
    state.overviewTab.subdomainSection.createNewSubdomain.action,
    state.overviewTab.subdomainSection.createNewSubdomain.subname,
    state.overviewTab.subdomainSection.createNewSubdomain.setTransactionHash,
    state.profile.avatar,
    state.profile.isPremium,
    state.profile.details?.title,
    state.profile.wallet
  ]);

  const [availableCurrencies, setAvailableCurrencies, subscriptionToken] = useGlobalStore(state => [state.availableCurrencies, state.setAvailableCurrencies, state.subscriptionToken]);

  const refetchCurrenciesDataset = async () => {
    try {
      const response = await getEthereumCurrencyTokenApi();
      setAvailableCurrencies([...new Set([...availableCurrencies, ...response.data.data.coins as SUI_CurrencyChainItem[]])]);
    } catch (error) {
      throw error;
    }
  };

  const handleMintSubnameAfterSuccessfulPayment = async (paymentMode: SUE_PaymentMode) => {
    try {
      setIsMinting(true);
      setOpenPaymentSection(false);

      const payload: SUI_MintSubnamePayload = {
        minterAddress: wallet.address,
        subnameLabel: subname,
        paymentMode
      };

      const mintRes = await mintNewSubnameOnL2Api(payload);
      console.log("mintRes: ", mintRes);

      if (mintRes.data.success) {
        handleShowNotificationToast(
          "success",
          "Subname created Successfully",
          `${mintRes.data.message || "Transaction successful"}`
        );

        setTransactionHash(mintRes.data.data.transactionHash);
        handleNavigationOfSteps("NEXT");
      }

    } catch (error: any) {
      handleShowNotificationToast(
        "error",
        "Request failed!",
        `${error.message}`
      );
    } finally {
      setIsMinting(false);
    }
  };

  const handleOpenPaymentSection = async () => {
    try {
      setIsLoading(true);
      const balanceRes = await treasurySmartWalletBalanceCheckApi();

      if (balanceRes.data.data.usdBalance < 1) {
        handleShowNotificationToast(
          "warning",
          "Treasury Low balance",
          `We have run out of free gas on our platform to sponsor your subdomain Minting. Please contact us on our social media platforms and we will set you up.`,
          9000
        );
      } else {
        // Subname Purchase with crypto or credit is commented for now
        // setOpenPaymentSection(true);

        await handleMintSubnameAfterSuccessfulPayment(SUE_PaymentMode.SUBSCRIPTION_TOKENS);
      }

    } catch (error: any) {
      handleShowNotificationToast(
        "error",
        "Request failed!",
        `${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (openPaymentSection) {

      let allCurrencies = availableCurrencies;

      const getCurrencies = async () => {
        await refetchCurrenciesDataset();
        allCurrencies = useGlobalStore.getState().availableCurrencies;
      };

      if (!availableCurrencies || availableCurrencies.length === 0) {
        getCurrencies();
      }

      if (allCurrencies) {
        const foundCurrency = allCurrencies.find(currency => currency.symbol.toLowerCase() === 'eth');
        if (foundCurrency) {
          const convertedChargesInEth = parseFloat((Environment.NEW_SUBNAME_CHARGES / Number(foundCurrency.price)).toFixed(18));
          const convertedChargesInWei = ethers.parseUnits(convertedChargesInEth.toString(), 'ether');

          setChargesInEth(String(convertedChargesInEth.toFixed(8)));
          setChargesInWei(convertedChargesInWei);
          setChargesInWei(convertedChargesInWei);
        }
      }
    }
  }, [availableCurrencies, openPaymentSection]);

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="w-[400px] p-4" >
        {/* subname detail section */}
        {!openPaymentSection &&
          <div className=' space-y-4' >
            {!isMinting &&
              <div className="space-y-3" >
                {/* header */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h2 className="font-bold text-xl pt-3" >Confirm Details</h2>

                    <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                      <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                      </svg>
                    </DialogClose>
                  </div>

                  <p className="text-base font-medium text-secondary dark:text-su_secondary">Double check these details before <br /> confirming in your wallet.</p>
                </div>

                <div className='space-y-3' >

                  <div className='border-[1.5px] border-su_enable_bg rounded-sm py-3.5 px-4 flex items-center justify-between text-xs lg:text-sm' >
                    <p className='text-su_ternary' >Name</p>

                    <span className='flex items-center gap-2 text-su_primary font-semibold' >
                      {name}

                      <img
                        className='h-7 w-7 object-cover'
                        src={"/assets/logos/swapup-icon-gradient.svg"}
                        alt=""
                      />
                    </span>
                  </div>

                  <div className='border-[1.5px] border-su_enable_bg rounded-sm py-3.5 px-4 flex items-center justify-between text-xs lg:text-sm' >
                    <p className='text-su_ternary' >Action</p>

                    <span className='flex items-center gap-2 text-su_primary font-semibold' >
                      {action}
                    </span>
                  </div>

                  <div className='border-[1.5px] border-su_enable_bg rounded-sm py-3.5 px-4 flex items-center justify-between text-xs lg:text-sm' >
                    <p className='text-su_ternary' >Subname</p>

                    <span className='flex items-center gap-2 text-su_primary font-semibold' >
                      {subname}.{name}

                      <CustomAvatar
                        imageSrc={avatar}
                        fallbackName={title || ''}
                        isPremium={isPremium}
                        sizeClasses="!w-7 !h-7"
                      />
                    </span>
                  </div>
                </div>
              </div>
            }

            <LoadingDataset
              className='h-[200px] lg:h-[200px]'
              isLoading={isMinting}
              title={`Subname is minting...`}
              description={`Please wait while we mint your subname.`}
            />

            <div className="w-full grid grid-cols-2 gap-4 py-2" >
              <CustomOutlineButton
                containerClasses="w-full h-full"
                disabled={isLoading || isMinting}
                onClick={() => { handleNavigationOfSteps('PREVIOUS'); }}
              >
                Back
              </CustomOutlineButton>

              <Button
                onClick={handleOpenPaymentSection}
                isLoading={isLoading || isMinting}
                disabled={isLoading || isMinting}
              >
                Pay {subscriptionToken?.subnameCharges} {subscriptionToken?.symbol}
              </Button>
            </div>

          </div>
        }


        {/* Payment section */}
        {openPaymentSection &&
          <div className=' space-y-4' >

            {/* Pay with Crypto or Card is commented for now */}

            {/* <section className="space-y-3" >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h2 className="font-bold text-xl pt-3">Subname payment</h2>

                  <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                    <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </DialogClose>
                </div>

                <p className="text-base font-medium text-secondary dark:text-su_secondary">You can choose Crypto or Card payment.</p>
              </div>

              <ScrollArea className="h-[415px]">
                <PayEmbed
                  theme={defaults.thirdweb.getCustomTheme()}
                  client={thirdWebClient}

                  payOptions={{
                    ...defaults.thirdweb.getCustomPaymentOptions(false),

                    purchaseData: {
                      purchaseType: SUE_PURCHASE_TYPE.SUBNAME,
                      details: {
                        subname: {
                          buyerAddress: useProfileStore.getState().profile.wallet.address,
                          subnameLabel: subname,
                          domain: name,
                          message: `${useProfileStore.getState().profile.wallet.address} user has successfully purchased ${subname}.${name} on ${paymentChain.name} network chain.`
                        }
                      },
                      paymentTriggeredFrom: {
                        environmentId: Environment.ENVIRONMENT_ID,
                        environmentKey: Environment.ENVIRONMENT_KEY
                      }
                    } as SUI_PurchaseData,

                    onPurchaseSuccess: (tx) => {
                      handleMintSubnameAfterSuccessfulPayment(SUE_PaymentMode.CRYPTO_OR_CARD);
                      console.log("payment transaction: ", tx);
                    },

                    mode: 'direct_payment',

                    // This 'paymentInfo' is for 'Payment mode: direct_payment' only
                    paymentInfo: {
                      amount: chargesInEth,
                      chain: paymentChain,
                      sellerAddress: Environment.SWAPUP_TREASURY_WALLET,
                      amountWei: (chargesInWei ? chargesInWei.toString() : "0") as unknown as bigint,
                    },
                  }}
                />

                <ScrollBar orientation='vertical' />
              </ScrollArea>
            </section> */}
          </div>
        }
      </DialogContent>
    </Dialog >
  );
};

export default ConfirmSubnameDialog;  