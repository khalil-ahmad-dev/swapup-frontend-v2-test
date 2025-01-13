import EmptyDataset from '../../../shared/EmptyDataset';
import LoadingDataset from '../../../shared/LoadingDataset';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import CreateNewSubdomainProcess from './CreateNewSubdomainProcess';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfileStore } from '@/store/profile';
import SubnameListItem from './SubnameListItem';
import SubdomainRecordsTabContent from './SubdomainRecordsTabContent';
import { useQuery } from '@tanstack/react-query';
import { SUI_SubnameItem } from '@/types/profile.types';
import { handleShowNotificationToast } from '@/lib/helpers';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getSubnameListedOnL2Api } from '@/service/api';
import { SUI_NamespaceListedSubnameItem } from '@/types/third-party.types';
import moment from 'moment';


interface IProp {
  handleSubnameMintSectionReload: () => void;
  subnameMintSectionKey: string;
}

const SubDomainMintingSection = ({ handleSubnameMintSectionReload, subnameMintSectionKey }: IProp) => {
  const [isMinting, setIsMinting] = useState(false);

  const [startCreateSubdomainProcess, setStartCreateSubdomainProcess] = useState(false);

  const [wallet, activeTab, subdomainSectionTabs, setActiveTab, filteredAvailableSubnames, setAvailableSubnames] = useProfileStore(state => [
    state.profile.wallet,
    state.overviewTab.subdomainSection.activeTab,
    state.overviewTab.subdomainSection.subdomainSectionTabs,
    state.overviewTab.subdomainSection.setActiveTab,
    state.overviewTab.subdomainSection.filteredAvailableSubnames,
    state.overviewTab.subdomainSection.setAvailableSubnames
  ]);

  const { isLoading, isError, isSuccess } = useQuery({
    queryKey: [`getSubnameListedOnL2Api-key${wallet.address}-${subnameMintSectionKey}`],
    queryFn: async () => {
      try {

        if (wallet.address && wallet.isConnected) {
          const response = await getSubnameListedOnL2Api();
          const responseData: SUI_NamespaceListedSubnameItem[] = response.data.items;

          const formattedSubnamesDataset = responseData
            .filter(item => item.owner.toLowerCase() === wallet.address.toLowerCase())
            .map((resSubname, index) => {
              const parentName = resSubname.name ? resSubname.name.replace(`${resSubname.label}.`, "") : "";

              const formattedSubnameItem: SUI_SubnameItem = {
                id: resSubname.namehash,
                expiry: resSubname.expiry ? moment(resSubname.expiry).format("MMM DD, YYYY") : "No expiry",
                isPrimary: index === 0 ? true : false,
                manager: parentName,
                ownerAddress: resSubname.owner,
                parent: parentName,
                subnameLabel: resSubname.label,
                fullName: resSubname.name
              };
              return formattedSubnameItem;
            });

          setAvailableSubnames(formattedSubnamesDataset);
          return response.data;
        }

        return null;
      } catch (error: any) {
        // handleShowNotificationToast(
        //   "error",
        //   `Request failed!`,
        //   `${error.message}`
        // );

        throw error;
      }
    },
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    enabled: (wallet.address && wallet.isConnected) ? true : false
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-between" >

        <div className="flex items-center lg:justify-between gap-4" >
          <h2 className="text-1.5xl font-medium" >Subdomains</h2>
        </div>

        <div className='w-full lg:w-2/5 flex items-center gap-2' >

          <Input
            className={`w-full lg:w-[65%] bg-su_enable_bg text-su_secondary !p-3.5 mr-1 ${filteredAvailableSubnames.length === 0 ? "opacity-0" : "opacity-100"}`}
            disabled={filteredAvailableSubnames.length === 0}
            placeholder="Search by subname"
            icon={
              <svg className="w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 14.6154L11.2277 9.84231C11.9968 8.78544 12.4105 7.5117 12.4092 6.20462C12.4092 2.78346 9.62577 0 6.20462 0C2.78346 0 0 2.78346 0 6.20462C0 9.62577 2.78346 12.4092 6.20462 12.4092C7.5117 12.4105 8.78544 11.9968 9.84231 11.2277L14.6154 16L16 14.6154ZM6.20462 10.4496C5.36493 10.4497 4.54407 10.2008 3.84586 9.7343C3.14765 9.26784 2.60345 8.60481 2.28208 7.82905C1.96071 7.05329 1.8766 6.19965 2.0404 5.37609C2.2042 4.55253 2.60854 3.79604 3.20229 3.20229C3.79604 2.60854 4.55253 2.2042 5.37609 2.0404C6.19965 1.8766 7.05329 1.96071 7.82905 2.28208C8.60481 2.60345 9.26784 3.14765 9.7343 3.84586C10.2008 4.54407 10.4497 5.36493 10.4496 6.20462C10.4483 7.33005 10.0006 8.40902 9.20482 9.20482C8.40902 10.0006 7.33005 10.4483 6.20462 10.4496Z" fill="#868691" />
              </svg>
            }
          />

          <Button onClick={() => { setStartCreateSubdomainProcess(true); }} >Mint subdomain</Button>
        </div>
      </div>

      <LoadingDataset
        isLoading={isLoading}
        title="Loading mint subdomain"
        description='Minted subdomains data is being loaded...'
      />

      {/* Creating new subname */}
      <CreateNewSubdomainProcess setStartCreateSubdomainProcess={setStartCreateSubdomainProcess} startCreateSubdomainProcess={startCreateSubdomainProcess} />

      {filteredAvailableSubnames.length > 0 &&
        <Tabs defaultValue={activeTab} className='min-h-40'>
          <TabsList>
            {subdomainSectionTabs.map(tab => (
              <TabsTrigger key={tab} value={tab} className='capitalize' onClick={() => { setActiveTab(tab); }} >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Subname tab section */}
          <TabsContent
            value={subdomainSectionTabs[subdomainSectionTabs.findIndex(tab => tab === 'subnames')]}
            className='py-2'
          >
            <ScrollArea className={cn(
              '',
              filteredAvailableSubnames.length > 3 && "h-[calc(100vh_-_100px)] lg:h-[calc(100vh_-_200px)] pr-3"
            )}
            >

              <div className='space-y-2' >
                {filteredAvailableSubnames.map((subname) => (
                  <SubnameListItem key={subname.id} subname={subname} handleSubnameMintSectionReload={handleSubnameMintSectionReload} />
                ))}
              </div>

              <ScrollBar orientation='vertical' />
            </ScrollArea>
          </TabsContent>

          {/* Records tab section */}
          <TabsContent
            value={subdomainSectionTabs[subdomainSectionTabs.findIndex(tab => tab === 'records')]}
            className="grid grid-cols-1 lg:grid-cols-2 py-2"
          >
            <SubdomainRecordsTabContent />
          </TabsContent>
        </Tabs>
      }


      {((isError || isSuccess) && (filteredAvailableSubnames.length === 0)) &&
        <EmptyDataset
          title="Subdomains not found"
          description={`Consider obtaining a subdomain to enhance your identity across web3, consolidate all <br/> your crypto addresses under one name.`}
        >
          <Button onClick={() => { setStartCreateSubdomainProcess(true); }} >Mint subdomain</Button>
        </EmptyDataset>
      }

    </div >
  );
};

export default SubDomainMintingSection;