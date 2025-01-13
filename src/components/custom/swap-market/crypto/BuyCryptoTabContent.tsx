import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { chainsDataset } from '@/constants/data';
import { Schema_OpenMarketBuyCrypto } from '@/schema';
import { SUI_SwapCurrencyItem } from '@/types/swap-market.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CurrencySelectCombobox from '../../shared/CurrencySelectCombobox';
import { Button } from '@/components/ui/button';

const BuyCryptoTabContent = () => {
  const currenciesDataset: SUI_SwapCurrencyItem[] = [... new Set(chainsDataset.map(coin => ({ uuid: coin.uuid, name: coin.name, iconUrl: coin.iconUrl, amount: '1', usdAmount: coin.price, symbol: coin.symbol })))];

  const form = useForm<z.infer<typeof Schema_OpenMarketBuyCrypto>>({
    resolver: zodResolver(Schema_OpenMarketBuyCrypto),
    defaultValues: {
      currenciesToBuy: [],
      currenciesToOffer: [],
    }
  });

  const onSubmit = async (data: z.infer<typeof Schema_OpenMarketBuyCrypto>) => {
    console.log("buy crypto form data: ", data);
  };

  return (
    <div>
      <Form {...form} >
        <form className="h-full pb-4 " onSubmit={form.handleSubmit(onSubmit)}>

          <div className="space-y-4 mr-3 mt-3 mb-4 ml-1">
            <FormField
              control={form.control}
              name="currenciesToBuy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-su_secondary text-sm font-semibold">Buy</FormLabel>
                  <CurrencySelectCombobox
                    currencies={currenciesDataset}
                    value={field.value || []}
                    onChange={field.onChange}
                    className="bg-su_enable_bg"
                    placeholder='What crypto do you want to buy?'
                    placeholderClassName='text-su_ternary'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currenciesToOffer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-su_secondary text-sm font-semibold">Payment</FormLabel>
                  <CurrencySelectCombobox
                    currencies={currenciesDataset}
                    value={field.value || []}
                    onChange={field.onChange}
                    className="bg-su_enable_bg"
                    placeholder='What currency do you want to offer?'
                    placeholderClassName='text-su_ternary'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className='w-full mt-10' variant={"default"} type="submit" >View offer</Button>
        </form>
      </Form>
    </div>
  );
};

export default BuyCryptoTabContent;   