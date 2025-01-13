import React, { useEffect, useState } from 'react';
import WalletOverviewCard from '../../swap-market/WalletOverviewCard';
import { Card } from '@/components/ui/card';
import TokenBreakdownChart from './TokenBreakdownChart';
import CollectionDetailsSection from './CollectionDetailsSection';
import SubDomainMintingSection from './subdomain/SubDomainMintingSection';
import { useQuery } from '@tanstack/react-query';
import { getCurrenciesByChainIdApi } from '@/service/api';
import { SUI_CurrencyChainItem } from '@/types/global.types';
import { useGlobalStore } from '@/store/global-store';
import LoadingDataset from '../../shared/LoadingDataset';
import { useProfileStore } from '@/store/profile';
import { handleShowNotificationToast } from '@/lib/helpers';
import { generateRandomKey } from '@/lib/utils';
import PlatformWalletSection from './PlatformWalletSection';

const ProfileWalletOverviewTabContent = () => {
  const [subnameMintSectionKey, setSubnameMintSectionKey] = useState(generateRandomKey(6));

  const [setAvailableCurrencies] = useGlobalStore(state => [state.setAvailableCurrencies]);
  const [totalWalletValue, totalNftsOwned, wallet] = useProfileStore(state => [state.overviewTab.totalWalletValue, state.overviewTab.totalNftsOwned, state.profile.wallet]);
  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: [`getCurrenciesByChainIdApi`],
    queryFn: async () => {
      try {
        const response = await getCurrenciesByChainIdApi();
        setAvailableCurrencies(response.data.data as SUI_CurrencyChainItem[]);
        return response.data.data;
      } catch (error: any) {
        handleShowNotificationToast(
          "error",
          `Request failed!`,
          `${error.message}`
        );

        throw error;
      }
    },
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    enabled: (wallet.address && wallet.isConnected) ? true : false
  });


  const handleSubnameMintSectionReload = () => {
    setSubnameMintSectionKey(generateRandomKey(6));
  };

  useEffect(() => {
    if (wallet && wallet.isConnected) {
      handleSubnameMintSectionReload();
    }

  }, [wallet]);

  return (
    <>
      {
        isSuccess &&
        <section className='space-y-4' >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4' >
            <WalletOverviewCard cardType="totalwalletvalue" value={totalWalletValue} description="Total Wallet Value" />
            <WalletOverviewCard cardType="NFTs" value={totalNftsOwned} description="NFTs Owned" />
          </div>

          {/* Charts section */}
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2' >
            <Card className='border-none bg-card  dark:bg-su_secondary_bg p-4 lg:p-6 rounded-md'>
              <TokenBreakdownChart />
            </Card>

            <Card className='border-none bg-card  dark:bg-su_secondary_bg p-4 lg:p-6 rounded-md'>
              <PlatformWalletSection />
            </Card>
          </div>

          <CollectionDetailsSection />
          <SubDomainMintingSection key={subnameMintSectionKey} handleSubnameMintSectionReload={handleSubnameMintSectionReload} subnameMintSectionKey={subnameMintSectionKey} />
        </section>
      }

      {isLoading &&
        <div className='w-full h-[60vh] flex items-center justify-center' >
          <LoadingDataset
            isLoading={isLoading}
            title="Loading currencies data."
          />
        </div>
      }
    </>
  );
};

export default ProfileWalletOverviewTabContent;