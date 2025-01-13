import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import BuyCryptoTabContent from './BuyCryptoTabContent';
import SellCryptoTabContent from './SellCryptoTabContent';

interface IProp {
  className?: string;
}

type TradeCryptoTabsType = 'buy' | 'sell';

interface ITradeCryptoTabItem {
  key: TradeCryptoTabsType;
  title: string;
}

const tradeCryptoTabs: ITradeCryptoTabItem[] = [
  {
    key: 'buy',
    title: 'Buy Crypto'
  },
  {
    key: 'sell',
    title: 'Sell Crypto'
  }
];

const TradeCryptoSection = ({ className }: IProp) => {
  const [activeTab, setActiveTab] = useState<TradeCryptoTabsType>('buy');

  return (
    <section className={cn(
      "w-full relative grid grid-cols-1 lg:grid-cols-2 gap-6 pt-10",
      className
    )}>
      <aside>
        <h1 className='text-3xl lg:text-4.5xl font-semibold leading-loose'>Trade Crypto </h1>
        <p className='text-xl lg:text-3xl font-normal text-su_primary/60'>Buy crypto directly from individual sellers with no lockup period using Credit Card or Crypto.</p>
      </aside>

      <aside className='relative z-10 bg-gradient-primary rounded-3xl p-[1px] mr-6 lg:mr-10 min-h-[456px]' >
        <div className='w-full h-full rounded-3xl bg-su_primary_bg' >

          <Tabs defaultValue={activeTab} className='pt-3'>
            <TabsList className='py-0' >
              {tradeCryptoTabs.map(tab => (
                <TabsTrigger
                  className='capitalize w-1/2 text-base font-bold py-0 h-full'
                  key={tab.key}
                  value={tab.key}
                  onClick={() => { setActiveTab(tab.key); }}
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Buy crypto tab section */}
            <TabsContent value='buy' className='mt-0 p-2 lg:p-6'>
              <BuyCryptoTabContent />
            </TabsContent>

            {/* Sell crypto tab section */}
            <TabsContent value='sell' className='mt-0 p-2 lg:p-6'>
              <SellCryptoTabContent />
            </TabsContent>
          </Tabs>

        </div>
      </aside>

      <img className='w-full h-full object-cover absolute left-0 top-0 z-0' src="/assets/svgs/TradeCryptoBg.svg" alt="" />
    </section>
  );
};

export default TradeCryptoSection;