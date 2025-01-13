import { cn, generateRandomTradeId, isValidWalletAddress } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import CustomOutlineButton from "../../shared/CustomOutlineButton";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "@/store/profile";
import { useGlobalStore } from "@/store/global-store";
import { useEffect, useState } from "react";
import { handleShowNotificationToast } from "@/lib/helpers";
import { SUI_NamespaceListedSubnameItem, SUI_SubnameMintTransaction } from "@/types/third-party.types";
import { getSubnameListedOnL2Api } from "@/service/api";
import { Environment } from "@/config";
import LoadingDataset from "../../shared/LoadingDataset";
import ToastLookCard from "../../shared/ToastLookCard";
import { getDefaultProvider, resolveAddress } from "ethers";
import { currentChain } from "@/lib/thirdWebClient";

const formSchema = z.object({
  counterPartyAddress: z.string()
    .min(1, {
      message: "Counterparty address is required.",
    })
});

interface IProp {
  children?: any;
  className?: string;
}


const CreatePrivateSwapDialog = ({ children, className }: IProp) => {
  const [isResolvingSubname, setIsResolvingSubname] = useState(false);
  const [resolvedSubname, setResolvedSubname] = useState<SUI_NamespaceListedSubnameItem | null>(null);

  const navigate = useNavigate();
  const wallet = useProfileStore(state => state.profile.wallet);
  const [allSubnamesMintedOnL2SwapupEns, setAllSubnamesMintedOnL2SwapupEns] = useGlobalStore(state => [state.allSubnamesMintedOnL2SwapupEns, state.setAllSubnamesMintedOnL2SwapupEns]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      counterPartyAddress: "",
    },
  });

  const refetchListedSubname = async () => {
    try {
      const response = await getSubnameListedOnL2Api();
      setAllSubnamesMintedOnL2SwapupEns(response.data.items as SUI_NamespaceListedSubnameItem[]);
    } catch (error: any) {
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.message}`
      );
    }
  };

  const handleResolvePlatformSubname = async (nameToBeResolved: string) => {
    try {
      setIsResolvingSubname(true);
      // Refetch all subnames data when not found in store
      if (allSubnamesMintedOnL2SwapupEns.length === 0) {
        await refetchListedSubname();
      }

      const foundSubname = allSubnamesMintedOnL2SwapupEns.find(item => item.name.toLowerCase() === nameToBeResolved.toLowerCase());

      if (foundSubname) {
        setResolvedSubname(foundSubname);
        form.clearErrors("counterPartyAddress");
      } else {
        form.setError("counterPartyAddress", { message: "ENS is not resolved. Please try a valid address, ENS or subname listed on SWAPUP." });
        setResolvedSubname(null);
      }

    } catch (error) {
      console.log("Error while resolving ENS:", error);
      form.setError("counterPartyAddress", { message: "Error accord while resolving ENS. Please try valid address, ENS or subname listed on SWAPUP." });
      setResolvedSubname(null);
    } finally {
      setIsResolvingSubname(false);
    }
  };

  const handleResolveEns = async (nameToBeResolved: string) => {
    try {
      setIsResolvingSubname(true);
      const provider = getDefaultProvider("mainnet");
      const foundAddress = await resolveAddress(nameToBeResolved, provider);

      if (foundAddress) {
        const resolvedSubnameObj: SUI_NamespaceListedSubnameItem = {
          addresses: { "60": foundAddress },
          name: nameToBeResolved,
          chainId: currentChain.id,
          expiry: 0,
          label: nameToBeResolved,
          owner: foundAddress,
          mintTransaction: {} as SUI_SubnameMintTransaction,
          namehash: '',
          parentNamehash: '',
          texts: [],
        };

        setResolvedSubname(resolvedSubnameObj);
        form.clearErrors("counterPartyAddress");
      } else {
        form.setError("counterPartyAddress", { message: "ENS is not resolved. Please try a valid address, ENS or subname listed on SWAPUP." });
        setResolvedSubname(null);
      }
    } catch (error) {
      console.log("Error while resolving ENS:", error);
      form.setError("counterPartyAddress", { message: "Error accord while resolving ENS. Please try valid address, ENS or subname listed on SWAPUP." });
      setResolvedSubname(null);
    } finally {
      setIsResolvingSubname(false);
    }
  };

  const handleCounterPartyAddressValidation = async (counterPartyAddress: string) => {
    // Step-1: Check if the address is valid
    const isValid = isValidWalletAddress(counterPartyAddress);

    // Step-2: Check if the address is not valid && ends with Swapup Listed ENS
    if (!isValid && counterPartyAddress.endsWith("." + Environment.NAMESPACE_LISTED_ENS_NAME)) {
      await handleResolvePlatformSubname(counterPartyAddress);
    } else if (!isValid) {
      // Step-3: Check for ENS resolution if it ends with a Native ENS TLD (.eth) or Non-Native DNS TLD
      const ensOrDnsRegex = /\.(eth|[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)$/;
      if (ensOrDnsRegex.test(counterPartyAddress)) {
        await handleResolveEns(counterPartyAddress); // Call ENS resolution
        return; // Exit early to avoid further error handling
      }

      // Step-4: If the address is still not valid, throw an error
      form.setError("counterPartyAddress", { message: "Invalid counter party address" });
      setResolvedSubname(null);
    }

    // Step-5: Clear Errors when the address is valid
    if (isValid) form.clearErrors();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { counterPartyAddress } = values;
    const resolvedCounterPartyAddress = resolvedSubname ? resolvedSubname.owner : counterPartyAddress;

    await handleCounterPartyAddressValidation(resolvedCounterPartyAddress);

    if (resolvedCounterPartyAddress.toLowerCase() === wallet.address.toLowerCase()) {
      form.setError('counterPartyAddress', {
        message: "Counter party and connected wallet can't be same!"
      });
      return;
    }

    if (form.getFieldState('counterPartyAddress').error) return;

    const uniqueTradeId = generateRandomTradeId();
    if (uniqueTradeId && resolvedCounterPartyAddress) {
      navigate(`/swap-up/swap-market/private-swap/create/${resolvedCounterPartyAddress}/${uniqueTradeId}`);
    }
  };

  const DEBOUNCE_DELAY = 500;

  useEffect(() => {
    const counterPartyAddress = form.watch('counterPartyAddress');
    let debounceTimeout: NodeJS.Timeout;

    const handleCounterPartyValidationProcess = async (nameToBeResolved: string) => {
      await handleCounterPartyAddressValidation(nameToBeResolved);
    };

    if (counterPartyAddress) {
      debounceTimeout = setTimeout(() => {
        handleCounterPartyValidationProcess(counterPartyAddress);
      }, DEBOUNCE_DELAY);
    } else {
      setResolvedSubname(null);
    }

    // Cleanup timeout on unmount or input change
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [form.watch('counterPartyAddress')]);


  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "",
          className
        )}
      >
        {children}
      </DialogTrigger>

      <DialogContent className="w-[400px] p-4 px-6" >
        <div className="space-y-3" >
          {/* header */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-xl pt-3" >Private party trade</h2>

              <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </DialogClose>
            </div>

            <p className="text-base font-medium text-secondary dark:text-su_secondary">Input counterparty wallet to create a private swap room.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="counterPartyAddress"
                render={({ field }) => (
                  <FormItem className="space-y-2" >
                    <FormLabel className="text-su_secondary text-sm font-semibold">Counterparty wallet address</FormLabel>
                    <FormControl>
                      <Input
                        icon={
                          <svg className="w-4" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.6667 8.5C11.0478 8.5 10.4543 8.74583 10.0168 9.18342C9.57917 9.621 9.33333 10.2145 9.33333 10.8333C9.33333 11.4522 9.57917 12.0457 10.0168 12.4832C10.4543 12.9208 11.0478 13.1667 11.6667 13.1667H16V16.5H0V5.16667H16V8.5H11.6667ZM12.3333 11.8333H11.6667C11.4015 11.8333 11.1471 11.728 10.9596 11.5404C10.772 11.3529 10.6667 11.0985 10.6667 10.8333C10.6667 10.5681 10.772 10.3138 10.9596 10.1262C11.1471 9.93869 11.4015 9.83333 11.6667 9.83333H12.3333C12.5985 9.83333 12.8529 9.93869 13.0404 10.1262C13.228 10.3138 13.3333 10.5681 13.3333 10.8333C13.3333 11.0985 13.228 11.3529 13.0404 11.5404C12.8529 11.728 12.5985 11.8333 12.3333 11.8333ZM10.6667 0.5L13.3333 3.83333H5.33333L10.6667 0.5Z" fill="#868691" />
                          </svg>
                        }
                        className="!bg-su_enable_bg py-3.5 px-4"
                        placeholder="Enter counterparty wallet address"
                        error={!!form.formState.errors.counterPartyAddress}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Showing resolved subname */}
              {(!isResolvingSubname && resolvedSubname) &&
                <ToastLookCard
                  className="animate-bounce-once"
                  descriptionClasses="break-all"
                  variant="success"
                  hideCloseButton={true}
                  icon={
                    <svg className="w-4" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.83268 12.3333L13.7077 6.45833L12.541 5.29166L7.83268 10L5.45768 7.625L4.29102 8.79167L7.83268 12.3333ZM8.99935 16.8333C7.84657 16.8333 6.76324 16.6144 5.74935 16.1767C4.73546 15.7389 3.85352 15.1453 3.10352 14.3958C2.35352 13.6464 1.75991 12.7644 1.32268 11.75C0.885461 10.7356 0.666572 9.65222 0.666017 8.5C0.665461 7.34778 0.88435 6.26444 1.32268 5.25C1.76102 4.23555 2.35463 3.35361 3.10352 2.60416C3.85241 1.85472 4.73435 1.26111 5.74935 0.823331C6.76435 0.385553 7.84768 0.166664 8.99935 0.166664C10.151 0.166664 11.2343 0.385553 12.2493 0.823331C13.2643 1.26111 14.1463 1.85472 14.8952 2.60416C15.6441 3.35361 16.238 4.23555 16.6768 5.25C17.1157 6.26444 17.3344 7.34778 17.3327 8.5C17.331 9.65222 17.1121 10.7356 16.676 11.75C16.2399 12.7644 15.6463 13.6464 14.8952 14.3958C14.1441 15.1453 13.2621 15.7392 12.2493 16.1775C11.2366 16.6158 10.1532 16.8344 8.99935 16.8333Z" fill="#75FFC1" />
                    </svg>
                  }
                  subtitle={"ENS connected to "}
                  description={`${resolvedSubname.owner} wallet address`}
                />
              }

              <LoadingDataset
                className='h-[100px] lg:h-[100px]'
                isLoading={isResolvingSubname}
                title='Resolving ENS'
                description='Please wait while we resolve ENS for you.'
              />

              <div className="w-full grid grid-cols-2 gap-4 py-2" >
                <div className="relative" >
                  <DialogClose type="button" className="absolute top-0 left-0 w-full h-full bg-transparent z-10" ></DialogClose>
                  <CustomOutlineButton containerClasses="w-full h-full" >Cancel</CustomOutlineButton>
                </div>

                <Button
                  variant={"default"}
                  type="submit"
                >
                  Create room
                </Button>
              </div>
            </form>
          </Form>

        </div>
      </DialogContent>
    </Dialog >
  );
};

export default CreatePrivateSwapDialog;