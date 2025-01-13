import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Environment } from '@/config';
import { defaults } from '@/constants/defaults';
import { SUE_PURCHASE_TYPE } from '@/constants/enums';
import { handleShowNotificationToast } from '@/lib/helpers';
import { paymentChain, thirdWebClient } from '@/lib/thirdWebClient';
import { getEthereumCurrencyTokenApi, getSubscriptionTokenApi, transferSubscriptionTokensToUserApi } from '@/service/api';
import { useGlobalStore } from '@/store/global-store';
import { useProfileStore } from '@/store/profile';
import { SUI_CurrencyChainItem, SUI_SubscriptionToken } from '@/types/global.types';
import { SUI_PurchaseData } from '@/types/payments.types';
import { SUI_TransferSubscriptionTokensToUserPayload } from '@/types/profile.types';
import { ethers } from 'ethers';
import { PayEmbed } from 'thirdweb/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn, getDefaultNftImageOnError } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import LoadingDataset from '../../shared/LoadingDataset';
import { useNavigate } from 'react-router-dom';

const Schema_SubscriptionForm = z.object({
  tokensToBuy: z.string().optional(),
}).superRefine((data, ctx) => {

  if (!data.tokensToBuy) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["tokensToBuy"],
      message: "Please enter the amount of tokens you want.",
    });
  }

  if (data.tokensToBuy && Number(data.tokensToBuy) < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["tokensToBuy"],
      message: "Token amount should be greater than 0.",
    });
  }

  if (data.tokensToBuy && Number(data.tokensToBuy) > 9999) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["tokensToBuy"],
      message: "Token amount should be less than 10000.",
    });
  }
});


const MembershipStoreTabContent = () => {
  const [isSendingTokens, setIsSendingTokens] = useState(false);
  const [openPaymentSection, setOpenPaymentSection] = useState(false);

  const [chargesInWei, setChargesInWei] = useState<bigint | null>(null);
  const [chargesInEth, setChargesInEth] = useState('');
  const [chargesInUsd, setChargesInUsd] = useState(0);

  const [wallet, profile] = useProfileStore(state => [state.profile.wallet, state.profile]);
  const [availableCurrencies, setAvailableCurrencies, subscriptionToken, setSubscriptionToken] = useGlobalStore(state => [state.availableCurrencies, state.setAvailableCurrencies, state.subscriptionToken, state.setSubscriptionToken]);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof Schema_SubscriptionForm>>({
    resolver: zodResolver(Schema_SubscriptionForm),
    defaultValues: {
      tokensToBuy: '',
    }
  });


  const handleSubscriptionTokenTransfer = async () => {
    try {
      setIsSendingTokens(true);

      if (profile.details?.smartAccount) {
        let latestSubscriptionToken = subscriptionToken;
        const getSubscriptionToken = async () => {
          await refetchSubscriptionTokenDetails();
          latestSubscriptionToken = useGlobalStore.getState().subscriptionToken;
        };

        if (!latestSubscriptionToken) {
          await getSubscriptionToken();
        }

        const payload: SUI_TransferSubscriptionTokensToUserPayload = {
          amountToTransfer: form.getValues('tokensToBuy')!,
          tokenAddress: latestSubscriptionToken?.address!,
          transferToAddress: profile.details?.smartAccount,
        };

        const response = await transferSubscriptionTokensToUserApi(payload);

        if (response) {
          handleShowNotificationToast(
            "success",
            `Subscribed successfully`,
            `You will receive a subscription tokens in your smart account. \n ${response.data.message || response.data}`
          );
          console.log("Token transferred: ", response);
          navigate('/swap-up/profile/wallet-overview');
        }

      } else {
        throw new Error(`${wallet.address} user does't not have smart account!`);
      }

    } catch (error: any) {
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.message}`
      );
    } finally {
      setIsSendingTokens(false);
      setOpenPaymentSection(false);
    }
  };

  const refetchCurrenciesDataset = async () => {
    try {
      const response = await getEthereumCurrencyTokenApi();
      setAvailableCurrencies([...new Set([...availableCurrencies, ...response.data.data.coins as SUI_CurrencyChainItem[]])]);
    } catch (error) {
      throw error;
    }
  };

  const refetchSubscriptionTokenDetails = async () => {
    try {
      const subscriptionTokenRes = await getSubscriptionTokenApi();
      // console.log("subscriptionTokenRes: ", subscriptionTokenRes);
      setSubscriptionToken(subscriptionTokenRes.data.data as SUI_SubscriptionToken);
    } catch (error) {
      throw error;
    }
  };

  const handleAmountConversion = async () => {
    const isValid = await form.trigger();
    const value = form.getValues('tokensToBuy');
    const tokensToBuy = Number(value ? value : '');

    if (isValid && tokensToBuy) {
      let allCurrencies = availableCurrencies;
      let latestSubscriptionToken = subscriptionToken;

      if (!availableCurrencies || availableCurrencies.length === 0) {
        await refetchCurrenciesDataset();
        allCurrencies = useGlobalStore.getState().availableCurrencies;
      }

      if (!subscriptionToken) {
        await refetchSubscriptionTokenDetails();
        latestSubscriptionToken = useGlobalStore.getState().subscriptionToken;
      }

      const convertedChargesInUsd = tokensToBuy * latestSubscriptionToken?.usdAmount!;

      if (allCurrencies) {
        const foundCurrency = allCurrencies.find(currency => currency.symbol.toLowerCase() === 'eth');
        if (foundCurrency) {
          const convertedChargesInEth = parseFloat((convertedChargesInUsd / Number(foundCurrency.price)).toFixed(18));
          const convertedChargesInWei = ethers.parseUnits(convertedChargesInEth.toString(), 'ether');

          setChargesInUsd(convertedChargesInUsd);
          setChargesInEth(convertedChargesInEth ? String(convertedChargesInEth.toFixed(8)) : '');
          setChargesInWei(convertedChargesInWei);
        }
      }
    } else {
      setChargesInUsd(0);
      setChargesInEth('');
      setChargesInWei(null);
    }
  };

  useEffect(() => {
    const getAmountConversion = async () => { await handleAmountConversion(); };
    getAmountConversion();
  }, [form.watch("tokensToBuy")]);

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10" >
      <aside>
        <h2 className='text-2xl text-su_primary font-bold leading-loose' >{subscriptionToken?.symbol} tokens</h2>
        <p className='text-su_secondary text-sm pr-10' >
          Our tokens are the backbone of how enable our platform functionality. This allows us to offer more functionality to our users efficiently as we expand our platform and provide more utility to our users. Purchase and use your tokens for platform fees, minting subdomains, and other use cases coming down the pipeline. Stay tuned for more ways to use your tokens and earn more of them with.
        </p>
      </aside>

      <aside className='w-full bg-su_enable_bg p-4 rounded-md mx-auto space-y-4' >
        <h2 className='text-lg font-semibold' >Buy {subscriptionToken?.symbol} tokens</h2>

        {!openPaymentSection &&
          <div className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-12 ' >
              <div className='lg:col-span-5' >
                <Form {...form}>
                  <form className="space-y-3" onSubmit={form.handleSubmit(async (data: z.infer<typeof Schema_SubscriptionForm>) => { })} >
                    <FormField
                      control={form.control}
                      name="tokensToBuy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-su_secondary text-sm font-normal">Tokens wanted:</FormLabel>
                          <Input
                            className="border-2 border-su_enable_bg py-3.5 px-4"
                            icon={
                              <img
                                className='w-5 h-5 mt-0.5'
                                src={subscriptionToken?.iconUrl}
                                alt=""
                                onError={getDefaultNftImageOnError}
                                loading="lazy"
                              />
                            }
                            type="number"
                            onChange={field.onChange}
                            value={field.value}
                            placeholder="0.00"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>

              <div className={cn(
                "lg:col-span-2 flex justify-center items-center",
                form.watch("tokensToBuy") && "lg:pt-7"
              )}
              >
                <svg className="rotate-90 lg:rotate-0 w-8 lg:w-10" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1.91992" y="1.57617" width="38" height="38" rx="19" stroke="url(#paint0_linear_1_6150)" strokeWidth="2" />
                  <path d="M23.5126 12.5762L29.9199 19.23H12.2777V17.435H25.7475L22.2906 13.8452L23.5126 12.5762ZM29.5621 21.9224V23.7173H16.0924L19.5493 27.3072L18.3273 28.5762L11.9199 21.9224H29.5621Z" fill="#7586FF" />
                  <defs>
                    <linearGradient id="paint0_linear_1_6150" x1="40.9199" y1="8.17617" x2="-1.41297" y2="19.2907" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#51C0FF" />
                      <stop offset="1" stopColor="#9452FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className='lg:col-span-5 space-y-1' >
                <h3 className='text-su_secondary text-sm font-normal'>Cost:</h3>

                <div className='border-2 border-su_enable_bg py-3.5 px-4 rounded-md w-full'>
                  <p className='text-sm text-su_primary font-normal'>{chargesInEth ? chargesInEth : 0} ETH / {chargesInUsd} $</p>
                </div>
              </div>
            </div>

            <div className='flex justify-center' >
              <Button onClick={() => { setOpenPaymentSection(true); }}>Buy {subscriptionToken?.symbol} tokens</Button>
            </div>
          </div>
        }


        {openPaymentSection &&
          <div className='max-w-max space-y-6 mx-auto' >
            {!isSendingTokens &&
              <PayEmbed
                theme={defaults.thirdweb.getCustomTheme()}
                client={thirdWebClient}

                payOptions={{
                  ...defaults.thirdweb.getCustomPaymentOptions(false, 'Purchase Tokens'),

                  purchaseData: {
                    purchaseType: SUE_PURCHASE_TYPE.SUBSCRIPTION,
                    details: {
                      subscription: {
                        ownerAddress: wallet.address,
                        smartAccount: profile.details?.smartAccount || '',
                        tokenAddress: subscriptionToken?.address,
                        tokenAmount: Number(form.getValues('tokensToBuy')!),
                        message: `${wallet.address} user paid for subscription (10 subscription tokens must be transferred to his ${profile.details?.smartAccount} smart wallet)`
                      }
                    },
                    paymentTriggeredFrom: {
                      environmentId: Environment.ENVIRONMENT_ID,
                      environmentKey: Environment.ENVIRONMENT_KEY
                    }
                  } as SUI_PurchaseData,

                  onPurchaseSuccess: (tx) => {
                    handleSubscriptionTokenTransfer();
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
            }

            <LoadingDataset
              className='h-[200px] lg:h-[200px]'
              isLoading={isSendingTokens}
              title={`Transferring ${subscriptionToken?.symbol} tokens`}
              description={`Please wait for ${subscriptionToken?.symbol} token transfer to your wallet.`}
            />

            {/* <Button isLoading={isSendingTokens} disabled={isSendingTokens} className='w-full' onClick={() => { setOpenPaymentSection(false); }}>Back</Button> */}
          </div>
        }

      </aside>
    </section>
  );
};

export default MembershipStoreTabContent;