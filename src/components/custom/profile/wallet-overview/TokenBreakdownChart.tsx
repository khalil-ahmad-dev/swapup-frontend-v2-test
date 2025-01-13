import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Pie, PieChart } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { SUI_TokenBreakdownChartItem } from '@/types/profile.types';
import { useQuery } from '@tanstack/react-query';
import { useProfileStore } from '@/store/profile';
import { getTokenBreakdownByWalletIdApi } from '@/service/api';

import { useGlobalStore } from '@/store/global-store';
import LoadingDataset from '../../shared/LoadingDataset';
import { handleShowNotificationToast } from '@/lib/helpers';
import EmptyDataset from '../../shared/EmptyDataset';
import { cn, getDefaultNftImageOnError } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TokenBreakdownChart = () => {
  const [availableCurrencies, subscriptionToken] = useGlobalStore(state => [state.availableCurrencies, state.subscriptionToken]);
  const [wallet, walletTokenBreakdownData, setWalletTokenBreakdownData] = useProfileStore(state => [
    state.profile.wallet,
    state.overviewTab.walletTokenBreakdownData,
    state.overviewTab.setWalletTokenBreakdownData,
  ]);

  const { isLoading, isSuccess } = useQuery({
    queryKey: [`getTokenBreakdownByWalletIdApi-key${wallet.address}`],
    queryFn: async () => {
      try {
        if (wallet.address && wallet.isConnected) {
          const response = await getTokenBreakdownByWalletIdApi(wallet.address);
          const responseTokens: SUI_TokenBreakdownChartItem[] = response.data;

          let computedRes: SUI_TokenBreakdownChartItem[] = [];
          let totalUsdAmount = 0;

          responseTokens.forEach(token => {
            const foundToken = availableCurrencies.find(currency => currency.symbol === token.network.symbol);
            let usdAmount = 0;

            if (!foundToken) {
              if (subscriptionToken && (token.network.contract.toLocaleLowerCase() === (subscriptionToken.address || "").toLocaleLowerCase())) {
                usdAmount = Number(subscriptionToken.usdAmount) * (token.balance || 0);
                token.network.iconUrl = subscriptionToken.iconUrl;
              }
            } else {
              usdAmount = Number(foundToken?.price || 0) * (token.balance || 0);
              if (!token.network.iconUrl) {
                token.network.iconUrl = foundToken.iconUrl;
              }
            }

            totalUsdAmount = totalUsdAmount + usdAmount;

            const computedTokenObject: SUI_TokenBreakdownChartItem = {
              ...token,
              usdAmount: parseFloat(usdAmount.toFixed(4)),
            };

            computedRes.push(computedTokenObject);
          });

          computedRes = computedRes.map(token => {
            if (token.usdAmount && totalUsdAmount) {
              return ({ ...token, percentage: parseFloat(((token.usdAmount / totalUsdAmount) * 100).toFixed(4)) });
            }
            return ({ ...token, percentage: 0 });
          }).filter(token => token.usdAmount > 0);

          setWalletTokenBreakdownData(computedRes, totalUsdAmount);
          return response.data;
        }

        return null;
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

  const generateColor = (index: number, total: number) => {
    const hue = (index * (360 / total)) % 360; // Distribute hues evenly
    const saturation = 40; // Keep saturation consistent (40%)
    const lightness = 50;  // Keep lightness consistent (50%)

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const pieChartData = walletTokenBreakdownData.map((item, index) => ({
    cryptoToken: item.key.toLowerCase(),
    tokens: item.percentage,
    fill: generateColor(index + 1, walletTokenBreakdownData.length)
  }));

  const chartConfig = walletTokenBreakdownData.reduce((config, item, index) => {
    config[item.key.toLowerCase()] = {
      label: item.network.name,
      color: generateColor(index + 1, walletTokenBreakdownData.length),
    };
    return config;
  }, {
    tokens: {
      label: "Token percentage",
    }
  } as ChartConfig);

  return (
    <div>
      <h2 className='text-sm font-semibold' >Token breakdown for connected account</h2>
      {walletTokenBreakdownData.length > 0 &&
        <div className='grid grid-cols-1 lg:grid-cols-5'>

          <div className='col-span-1 lg:col-span-3 pt-6'>
            <Table className='min-w-full' >
              <TableBody>
                {
                  walletTokenBreakdownData.map((item, index) => (
                    <TableRow className='group text-sm' key={item.key} >
                      <TableCell className='py-1.5 lg:py-1.5 max-w-[150px] lg:max-w-max' >
                        <div className='flex items-center gap-2 text-su_secondary group-hover:text-su_primary font-normal pr-1' >
                          <span className='min-w-2 min-h-2 rounded-[2px]' style={{ background: `${generateColor(index + 1, walletTokenBreakdownData.length)}` }} ></span>
                          <img
                            src={item.network.iconUrl}
                            className='w-4 h-4'
                            alt=""
                            loading="lazy"
                            onError={(e: any) => {
                              e.currentTarget.className = "w-4 h-4 rounded-full object-cover";
                              getDefaultNftImageOnError(e);
                            }}
                          />

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className='line-clamp-1' >{item.network.name} ({item.network.symbol})</TooltipTrigger>
                              <TooltipContent className='!bg-black space-y-1' >
                                <p className='flex items-center gap-2 text-sm' >
                                  <span className='min-w-2 min-h-2 rounded-[2px]' style={{ background: `${generateColor(index + 1, walletTokenBreakdownData.length)}` }} ></span>
                                  <img
                                    src={item.network.iconUrl}
                                    className='w-3 h-3'
                                    alt=""
                                    loading="lazy"
                                    onError={(e: any) => {
                                      e.currentTarget.className = "w-4 h-4 rounded-full object-cover";
                                      getDefaultNftImageOnError(e);
                                    }}
                                  />
                                  <span>{item.network.name} ({item.network.symbol})</span>
                                </p>

                                <p className='flex items-center justify-between text-xs text-su_secondary gap-2' >
                                  <span>$ {item.usdAmount}</span>
                                  <span>{item.percentage} %</span>
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                        </div>
                      </TableCell>

                      <TableCell
                        className={cn(
                          'py-1.5 lg:py-1.5 font-semibold text-su_primary',
                          item.usdAmount === 0 && "text-su_ternary"
                        )}
                      >
                        {(item.usdAmount === 0) ? "N/A" : `$ ${item.usdAmount}`}
                      </TableCell>

                      <TableCell className='py-1.5 lg:py-1.5 font-semibold text-su_primary' >
                        {item.percentage}%
                      </TableCell>
                    </TableRow>
                  ))
                }

              </TableBody>
            </Table>
          </div>

          <ChartContainer
            config={chartConfig}
            className="aspect-square col-span-1 lg:col-span-2"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => {
                  const item = pieChartData.find((token) => (token.cryptoToken as string).toLowerCase() === name);

                  const tooltip = <div className='flex items-center justify-between w-full text-su_secondary gap-2' >
                    <div className={`w-2 h-2 rounded-[2px]`} style={{ backgroundColor: `${item?.fill}` }}></div>
                    <span className='capitalize'>{(item?.cryptoToken as string).replace("-", ' ')}</span>
                    <span className='text-su_ternary font-semibold'>{value}%</span>
                  </div>;

                  return tooltip;
                }}
              />
              <Pie
                data={pieChartData}
                dataKey="tokens"
                nameKey="cryptoToken"
                innerRadius={75}
                paddingAngle={2.5}
                cornerRadius={5}
              />
              {/* <ChartLegend content={<ChartLegendContent nameKey="cryptoToken" />} /> */}
            </PieChart>
          </ChartContainer>
        </div>
      }

      {isLoading &&
        <div className='flex items-center justify-center w-full h-full' >
          <LoadingDataset
            isLoading={isLoading}
            title="Loading token beakdown data."
          />
        </div>
      }

      {(walletTokenBreakdownData.length === 0 && isSuccess) &&
        <EmptyDataset
          showBackgroundPicture={false}
          title='No token data found.'
          description='No token data found for the connected account.'
          className='h-[100px] lg:h-[200px]'
        />
      }
    </div>
  );
};

export default TokenBreakdownChart;