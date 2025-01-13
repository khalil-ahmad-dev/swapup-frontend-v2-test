import { Card, CardContent } from "@/components/ui/card";

interface IProp {
  cardType?: "totalwalletvalue" | "cryptostored" | "NFTs";
  value: number;
  description: string;
}

const WalletOverviewCard = ({ cardType, value, description }: IProp) => {

  return (
    <Card className="h-[90px] w-full border-none bg-card  dark:bg-su_secondary_bg p-3 " >
      <CardContent className={`p-2 flex flex-col gap-2`}>
        <h2 className="text-sm font-semibold" >{cardType === 'NFTs' ? value : `$ ${value.toFixed(2)}`}</h2>
        <p className="dark:text-su_ternary text-xs">{description}</p>
      </CardContent>
    </Card>
  );
};

export default WalletOverviewCard;