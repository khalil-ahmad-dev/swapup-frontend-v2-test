import LogoButton from "@/components/custom/landing-page/logo-button";
import LpNavbar from "@/components/custom/landing-page/lp-navbar";
import CryptoCard from "@/components/custom/services-page/crypto-card";
import InitiatorSteps from "@/components/custom/services-page/initiator-steps";
import nftsImageMapper from "@/components/custom/services-page/nft-mapper";
import PopularNftCard from "@/components/custom/services-page/popular-nft-card";
import WalletCard from "@/components/custom/services-page/wallet-card";
import CustomOutlineButton from "@/components/custom/shared/CustomOutlineButton";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chainsDataset } from "@/constants/data";
import { defaults } from "@/constants/defaults";
import {
	getDefaultNftImageOnError,
	getLastCharacters,
	getShortenWalletAddress,
} from "@/lib/utils";
import { SUI_OpenSwap, SUI_SwapToken } from "@/types/swap-market.types";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";

const ServicesPage = () => {
	const navigate = useNavigate();

	const sender1: SUI_SwapToken[] = [
		{
			id: "1",
			address: "0x1234567890abcdef",
			type: "Example Token 1",
			image_url: "/assets/services-page/nft1.png",
		},
		{
			id: "2",
			address: "0xabcdef1234567890",
			type: "Example Token 2",
			image_url: "/assets/services-page/nft2.png",
		},
		{
			id: "3",
			address: "0x7890abcdef123456",
			type: "Example Token 3",
			image_url: "/assets/services-page/nft3.png",
		},
		{
			id: "4",
			address: "0x7890abcdef123458",
			type: "Example Token 4",
			image_url: "/assets/services-page/nft4.png",
		},
		{
			id: "5",
			address: "0x7890abcdef123454",
			type: "Example Token 5",
			image_url: "/assets/services-page/nft5.png",
		},
	];

	const sender2: SUI_SwapToken[] = [
		{
			id: "1",
			address: "0x1234567890abcdef",
			type: "Example Token 1",
			image_url: "/assets/services-page/nft1.png",
		},
	];

	const sender3: SUI_SwapToken[] = [
		{
			id: "1",
			address: "0x1234567890abcdef",
			type: "Example Token 1",
			image_url: "/assets/services-page/nft1.png",
		},
		{
			id: "2",
			address: "0xabcdef1234567890",
			type: "Example Token 2",
			image_url: "/assets/services-page/nft2.png",
		},
		{
			id: "3",
			address: "0x7890abcdef123456",
			type: "Example Token 3",
			image_url: "/assets/services-page/nft3.png",
		},
		{
			id: "4",
			address: "0x7890abcdef123458",
			type: "Example Token 4",
			image_url: "/assets/services-page/nft4.png",
		},
		{
			id: "5",
			address: "0x7890abcdef123454",
			type: "Example Token 5",
			image_url: "/assets/services-page/nft5.png",
		},
		{
			id: "6",
			address: "0x7890abcdef123441",
			type: "Example Token 6",
			image_url: "https://example.com/token-image3.png",
		},
		{
			id: "7",
			address: "0x7890abcdef123432",
			type: "Example Token 7",
			image_url: "https://example.com/token-image3.png",
		},
	];

	const receiver1: SUI_SwapToken[] = [
		{
			id: "1",
			address: "0x1234567890abcdef",
			type: "Example Token 1",
			image_url: "/assets/services-page/nft1.png",
		},
		{
			id: "2",
			address: "0xabcdef1234567890",
			type: "Example Token 2",
			image_url: "/assets/services-page/nft2.png",
		},
		{
			id: "3",
			address: "0x7890abcdef123456",
			type: "Example Token 3",
			image_url: "/assets/services-page/nft3.png",
		},
	];

	const receiver2: SUI_SwapToken[] = [
		{
			id: "1",
			address: "0x1234567890abcdef",
			type: "Example Token 1",
			image_url: "/assets/services-page/nft1.png",
		},
		{
			id: "2",
			address: "0xabcdef1234567890",
			type: "Example Token 2",
			image_url: "/assets/services-page/nft2.png",
		},
		{
			id: "3",
			address: "0x7890abcdef123456",
			type: "Example Token 3",
			image_url: "/assets/services-page/nft3.png",
		},
		{
			id: "4",
			address: "0x7890abcdef123458",
			type: "Example Token 4",
			image_url: "/assets/services-page/nft4.png",
		},
		{
			id: "5",
			address: "0x7890abcdef123454",
			type: "Example Token 5",
			image_url: "/assets/services-page/nft5.png",
		},
		{
			id: "6",
			address: "0x7890abcdef123441",
			type: "Example Token 6",
			image_url: "https://example.com/token-image3.png",
		},
		{
			id: "7",
			address: "0x7890abcdef123432",
			type: "Example Token 7",
			image_url: "https://example.com/token-image3.png",
		},
	];

	const receiver3: SUI_SwapToken[] = [
		{
			id: "1",
			address: "0x1234567890abcdef",
			type: "Example Token 1",
			image_url: "/assets/services-page/nft1.png",
		},
		{
			id: "2",
			address: "0xabcdef1234567890",
			type: "Example Token 2",
			image_url: "/assets/services-page/nft2.png",
		},
		{
			id: "3",
			address: "0x7890abcdef123456",
			type: "Example Token 3",
			image_url: "/assets/services-page/nft3.png",
		},
		{
			id: "4",
			address: "0x7890abcdef123458",
			type: "Example Token 4",
			image_url: "/assets/services-page/nft4.png",
		},
	];

	const recentOpenSwapData: SUI_OpenSwap[] = [
		{
			id: " 2",
			metadata: {
				accept: {
					tokens: [],
				},
				init: {
					tokens: [
						{
							id: "3",
							address: "0xd580a62407b813f408ee58e26d1b4b81fc3dc486",
							type: "ERC721",
							image_url: "/assets/services-page/popular1.png",
						},
					],
				},
			},
			init_address: "0x27a53983e6d2a09fb0430705a7609b753376e690",
			init_sign: "",
			status: 1,
			trade_id: "",
			trading_chain: "84532",
			swap_mode: 0,
			offer_type: 0,
			accept_address: "",
			accept_sign: "",
			swap_preferences: {
				expiration_date: "2024-07-20T05:00:00Z",
				preferred_asset: {
					type: "currency",
					parameters: {
						preferred_currency: [
							{
								uuid: "aKzUVe4Hh_CON",
								name: "USDC",
								iconUrl: "https://cdn.coinranking.com/jkDf8sQbY/usdc.svg",
								amount: '',
								symbol: 'USDC',
								usdAmount: '1'
							},
						],
					},
				},
			},
			open_trade_id: "732d31ef-37da-4aab-85ba-60e41ae4528f",
			created_at: "2024-07-16T02:27:37.407Z",
			updated_at: "2024-07-16T02:27:37.407Z",
		},
		{
			id: " 3",
			metadata: {
				accept: {
					tokens: [],
				},
				init: {
					tokens: [
						{
							id: "6",
							address: "0xead705ebc963f5b8367b99a85638dc1619ca8215",
							type: "ERC721",
							image_url: "/assets/nfts/cool-cat.jpg",
						},
						{
							id: "3",
							address: "0xead705ebc963f5b8367b99a85638dc1619ca8215",
							type: "ERC721",
							image_url: "/assets/nfts/cool-turtle.jpg",
						},
					],
				},
			},
			init_address: "0xAA37a41513BCb3Ff2FF4B36910F24AeB40B00065",
			init_sign: "",
			status: 1,
			trade_id: "",
			trading_chain: "84532",
			swap_mode: 0,
			offer_type: 0,
			accept_address: "",
			accept_sign: "",
			swap_preferences: {
				expiration_date: "2024-07-29T19:00:00Z",
				preferred_asset: {
					type: "nft",
					parameters: {
						collection: "fragments-33",
						rank: {
							from: 101,
							to: 500,
						},
					},
				},
			},
			open_trade_id: "10080a9d-1a08-46ab-9656-d645fcc5d08b",
			created_at: "2024-07-28T01:05:23.779Z",
			updated_at: "2024-07-28T01:05:23.779Z",
		},
		{
			id: " 7",
			metadata: {
				accept: {
					tokens: [],
				},
				init: {
					tokens: [
						{
							id: "4",
							address: "0xd580a62407b813f408ee58e26d1b4b81fc3dc486",
							type: "ERC721",
							image_url: "/assets/nfts/cool-panda.jpg",
						},
					],
				},
			},
			init_address: "0x27A53983E6d2a09fb0430705a7609B753376e690",
			init_sign: "",
			status: 1,
			trade_id: "",
			trading_chain: "84532",
			swap_mode: 0,
			offer_type: 0,
			accept_address: "",
			accept_sign: "",
			swap_preferences: {
				expiration_date: "2024-07-31T05:00:00Z",
				preferred_asset: {
					type: "currency",
					parameters: {
						preferred_currency: [
							{
								uuid: "razxDUgYGNAdQ",
								name: "Ethereum",
								iconUrl: "https://cdn.coinranking.com/rk4RKHOuW/eth.svg",
								amount: '',
								symbol: 'ETH',
								usdAmount: '1'
							},
							{
								uuid: "aKzUVe4Hh_CON",
								name: "USDC",
								iconUrl: "https://cdn.coinranking.com/jkDf8sQbY/usdc.svg",
								amount: '',
								symbol: 'USDC',
								usdAmount: '1'
							},
						],
					},
				},
			},
			open_trade_id: "e0ea0da1-51ea-4267-97e8-0ad40b1c5470",
			created_at: "2024-07-30T02:44:11.237Z",
			updated_at: "2024-07-30T02:44:11.237Z",
		},
		{
			id: " 8",
			metadata: {
				accept: {
					tokens: [],
				},
				init: {
					tokens: [
						{
							id: "3",
							address: "0xd580a62407b813f408ee58e26d1b4b81fc3dc486",
							type: "ERC721",
							image_url: "/assets/nfts/cool-snake.jpg",
						},
					],
				},
			},
			init_address: "0x27a53983e6d2a09fb0430705a7609b753376e690",
			init_sign: "",
			status: 1,
			trade_id: "",
			trading_chain: "84532",
			swap_mode: 0,
			offer_type: 0,
			accept_address: "",
			accept_sign: "",
			swap_preferences: {
				expiration_date: "2024-07-20T05:00:00Z",
				preferred_asset: {
					type: "currency",
					parameters: {
						preferred_currency: [
							{
								uuid: "aKzUVe4Hh_CON",
								name: "USDC",
								iconUrl: "https://cdn.coinranking.com/jkDf8sQbY/usdc.svg",
								amount: '',
								symbol: 'USDC',
								usdAmount: '1'
							},
						],
					},
				},
			},
			open_trade_id: "732d31ef-37da-4aab-85ba-60e41ae4528f",
			created_at: "2024-07-16T02:27:37.407Z",
			updated_at: "2024-07-16T02:27:37.407Z",
		},
		{
			id: " 9",
			metadata: {
				accept: {
					tokens: [],
				},
				init: {
					tokens: [
						{
							id: "6",
							address: "0xead705ebc963f5b8367b99a85638dc1619ca8215",
							type: "ERC721",
							image_url: "/assets/nfts/cool-lion.jpg",
						},
						{
							id: "3",
							address: "0xead705ebc963f5b8367b99a85638dc1619ca8215",
							type: "ERC721",
							image_url: "/assets/nfts/cool-pigeon.jpg",
						},
					],
				},
			},
			init_address: "0xAA37a41513BCb3Ff2FF4B36910F24AeB40B00065",
			init_sign: "",
			status: 1,
			trade_id: "",
			trading_chain: "84532",
			swap_mode: 0,
			offer_type: 0,
			accept_address: "",
			accept_sign: "",
			swap_preferences: {
				expiration_date: "2024-07-29T19:00:00Z",
				preferred_asset: {
					type: "nft",
					parameters: {
						collection: "fragments-33",
						rank: {
							from: 101,
							to: 500,
						},
					},
				},
			},
			open_trade_id: "10080a9d-1a08-46ab-9656-d645fcc5d08b",
			created_at: "2024-07-28T01:05:23.779Z",
			updated_at: "2024-07-28T01:05:23.779Z",
		},
	];

	const nftsImageMapperForOpenTradeTable = (nfts: SUI_SwapToken[]) => {
		return nfts.map((nft, index) => {
			if (index < 3)
				return (
					<div className="relative w-8 h-8" key={nft.id}>
						<img
							className="w-full h-full object-cover rounded-xs border-[1.5px] border-white/20"
							src={nft.image_url}
							alt="nft"
							onError={getDefaultNftImageOnError}
						/>

						{index === 2 && nfts.length > 3 ? (
							<div className="absolute w-full h-full rounded-xs bg-black/50 top-0 flex justify-center items-center font-semibold">
								+{nfts.length - 3}
							</div>
						) : (
							""
						)}
					</div>
				);
		});
	};

	const closedSwapList = [
		{
			step: "Create",
			instruction: "Open a trade window and create a trade.",
		},
		{
			step: "Select",
			instruction: "Select a counter parties wallet and assets to trade.",
		},
		{
			step: "Confirm",
			instruction: "Confirm details of trade and send to the counter party for review.",
		},
		{
			step: "Counter Offer",
			instruction: "If any party wants to change swap details this can be done now.",
		},
		{
			step: "Accept",
			instruction: "Counterparty reviews trade details and accepts offer.",
		},
		{
			step: "Receive",
			instruction: "Assets are transferred securely to each wallet at the same time.",
		},
		{
			step: "Complete",
			instruction: "Congratulations, you now own your new assets!",
		},
	];

	const openSwapList = [
		{
			step: "Initiate",
			instruction: "Initiate an open trade in the dApp.",
		},
		{
			step: "Select",
			instruction: "Pick assets you are open to trade.",
		},
		{
			step: "Confirm",
			instruction: "Confirm open swap details.",
		},
		{
			step: "Share",
			instruction:
				"The trade will show in our marketplace for all users to view. You can also copy the link to your trade and share on social media or with your friends.",
		},
		{
			step: "Negotiate",
			instruction: "A counterparty will review your swap and propose a trade.",
		},
		{
			step: "Decide",
			instruction:
				"You can either counteroffer and continue negotiations, or accept the swap.",
		},
		{
			step: "Accept",
			instruction:
				"Push accept and the smart contracts will execute the trade for both parties",
		},
		{
			step: "Complete",
			instruction: "Congratulations, you now own your new assets!",
		},
	];

	return (
		<div>
			<div
				className="bg-cover  w-full"
				style={{
					backgroundImage: "url('/assets/landing-page/background1.png')",
				}}
			>
				{" "}
				{/* Section 1 */}
				<LpNavbar />
				<div className="container mx-auto mt-16 px-2 md:px-10">


					<div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between mt-4">
						<div className="max-w-[797px] md:mr-8 ">
							<p className="text-4xl font-Poppins md:text-6xl font-semibold text-left mt-12 text-su_primary">
								<span className="px-4 py-3 text-4xl md:text-6xl font-semi-bold font-Poppins rounded-full bg-su_light_pink text-black inline-block ml-2">
									Exchange
								</span>{" "}
								Assets{""}
							</p>
							<p className="text-su_primary_light mt-6 max-w-[450px] font-Urbanist text-base md:text-lg font-medium leading-relaxed text-left">
								Swap NFT's and Cryptocurrencies peer-to-peer with your friends or total strangers knowing assets will be traded securely.
							</p>
							<div className="mt-8">
								<Button
									className="text-md gap-8"
									onClick={() =>
										navigate(
											`${defaults.swapMarket.baseRoute}/${defaults.swapMarket.defaultActiveTab}`
										)
									}
								>
									Swap Now
								</Button>
							</div>
						</div>
						<div className="w-full max-w-[450px] mt-8 md:mt-0">
							<img
								src="/assets/landing-page/servicesheaderphoto.png"
								alt="photoroom"
								className="object-contain mx-auto"
							/>
						</div>
					</div>





					<div className="flex justify-start w-full mt-32 pb-16 overflow-x-auto md:justify-center">
						<div className="flex space-x-4 md:space-x-2">
							<LogoButton imgSrc="/assets/landing-page/thirdweb.png" />
							<LogoButton imgSrc="/assets/landing-page/base.png" />
							<LogoButton imgSrc="/assets/landing-page/alchemy.png" />
							{/* <LogoButton imgSrc="/assets/landing-page/solana.png" />
                                <LogoButton imgSrc="/assets/landing-page/polygon.png" /> */}
						</div>
					</div>
				</div>
			</div>
			<div>
				<div
					className="h-[auto] bg-cover  w-full"
					style={{
						backgroundImage: "url('/assets/landing-page/background2.png')",
					}}
				>
					{" "}
					{/* Section 2 */}
					<div className="container mx-auto px-2 md:px-10">
						<div className="flex flex-col md:flex-row items-center md:justify-center">
							<div className="max-w-[auto] mt-12">
								<p className="text-su_primary text-4xl font-Poppins md:text-5xl font-semibold text-center mt-12 ">
									Recent{""}
									<span className="px-3 py-1 rounded-full bg-su_tea_green text-black inline-block ml-2">
										Swaps
									</span>
								</p>
								<p className="text-su_primary_light mt-8 max-w-[650px] font-Urbanist text-center  md:text-lg font-medium leading-relaxed ">
									Experience the ultimate freedom of expression with our
									platform, meticulously crafted to empower users to swap NFTs
									according to their unique preferences and interests.
								</p>
							</div>
						</div>
						<div className="flex flex-col sm:flex-row items-center flex-wrap mt-14 bg-su_secondary_bg p-4 rounded-md w-full">
							<div className="flex-none w-full sm:w-[46%] p-2">
								<div className="w-full">{nftsImageMapper(sender1, 5, 4)}</div>
								<div className="flex justify-between w-full gap-2 mt-2">
									<CryptoCard
										title="Crypto added"
										imageUrl="/assets/services-page/Coins.png"
										amount="0.015 ETH"
									/>
									<WalletCard
										walletImage="/assets/services-page/Wallet.png"
										walletAddress="0x1431F...23f83"
										copy="/assets/services-page/copy.png"
									/>
								</div>
							</div>

							<div className="w-full h-full sm:w-[8%] p-2 flex justify-center items-center">
								<CustomOutlineButton className="p-3">
									<img src="/assets/services-page/Swap.png" />
								</CustomOutlineButton>
							</div>

							<div className="flex-none w-full sm:w-[46%] p-2">
								<div className="w-full">{nftsImageMapper(receiver1, 5, 4)}</div>
								<div className="flex justify-between w-full gap-2 mt-2">
									<CryptoCard
										title="Crypto added"
										imageUrl="/assets/services-page/Coins.png"
										amount="0.015 ETH"
									/>
									<WalletCard
										walletImage="/assets/services-page/Wallet.png"
										walletAddress="0x1431F...23f83"
										copy="/assets/services-page/copy.png"
									/>
								</div>
							</div>
						</div>
						<div className="flex flex-col sm:flex-row items-center flex-wrap mt-14 bg-su_secondary_bg p-4 rounded-md w-full">
							<div className="flex-none w-full sm:w-[46%] p-2">
								<div className="w-full">{nftsImageMapper(sender2, 5, 4)}</div>
								<div className="flex justify-between w-full gap-2 mt-2">
									<CryptoCard
										title="Crypto added"
										imageUrl="/assets/services-page/Coins.png"
										amount="0.015 ETH"
									/>
									<WalletCard
										walletImage="/assets/services-page/Wallet.png"
										walletAddress="0x1431F...23f83"
										copy="/assets/services-page/copy.png"
									/>
								</div>
							</div>

							<div className="w-full h-full sm:w-[8%] p-2 flex justify-center items-center">
								<CustomOutlineButton className="p-3">
									<img src="/assets/services-page/Swap.png" />
								</CustomOutlineButton>
							</div>

							<div className="flex-none w-full sm:w-[46%] p-2">
								<div className="w-full">{nftsImageMapper(receiver2, 5, 4)}</div>
								<div className="flex justify-between w-full gap-2 mt-2">
									<CryptoCard
										title="Crypto added"
										imageUrl="/assets/services-page/Coins.png"
										amount="0.015 ETH"
									/>
									<WalletCard
										walletImage="/assets/services-page/Wallet.png"
										walletAddress="0x1431F...23f83"
										copy="/assets/services-page/copy.png"
									/>
								</div>
							</div>
						</div>
						<div className="flex flex-col sm:flex-row items-center flex-wrap mt-14 bg-su_secondary_bg p-4 rounded-md w-full">
							<div className="flex-none w-full sm:w-[46%] p-2">
								<div className="w-full">{nftsImageMapper(sender3, 5, 4)}</div>
								<div className="flex justify-between w-full gap-2 mt-2">
									<CryptoCard
										title="Crypto added"
										imageUrl="/assets/services-page/Coins.png"
										amount="0.015 ETH"
									/>
									<WalletCard
										walletImage="/assets/services-page/Wallet.png"
										walletAddress="0x1431F...23f83"
										copy="/assets/services-page/copy.png"
									/>
								</div>
							</div>

							<div className="w-full h-full sm:w-[8%] p-2 flex justify-center items-center">
								<CustomOutlineButton className="p-3">
									<img src="/assets/services-page/Swap.png" />
								</CustomOutlineButton>
							</div>

							<div className="flex-none w-full sm:w-[46%] p-2">
								<div className="w-full">{nftsImageMapper(receiver3, 5, 4)}</div>
								<div className="flex justify-between w-full gap-2 mt-2">
									<CryptoCard
										title="Crypto added"
										imageUrl="/assets/services-page/Coins.png"
										amount="0.015 ETH"
									/>
									<WalletCard
										walletImage="/assets/services-page/Wallet.png"
										walletAddress="0x1431F...23f83"
										copy="/assets/services-page/copy.png"
									/>
								</div>
							</div>
						</div>
					</div>
					<div
						className="bg-cover bg-center w-full "
						style={{
							backgroundImage: "url('/assets/landing-page/background5.png')",
						}}
					>
						{" "}
						{/* Section 3 */}
						<div className="mt-12 container pr-0 pl-2 md:pl-10 space-y-20">
							<div className="flex flex-col md:flex-row items-center md:justify-center">
								<div className="flex flex-col items-center mt-12">
									<p className="text-su_primary text-4xl font-Poppins md:text-5xl font-semibold text-center mt-12  ">
										<span className="px-3 py-1 rounded-full bg-su_buttermilk text-black inline-block ">
											Popular
										</span>{" "}
										NFT's for Swap
									</p>
									<p className="text-su_primary_light mt-8 max-w-[650px] font-Urbanist text-center  md:text-lg font-medium leading-relaxed ">
										Discover the latest trends and hottest picks: popular nfts
										ready for seamless swapping.
									</p>
								</div>
							</div>

							<ScrollArea className="w-full mb-20 py-6">
								<div className="w-full flex justify-start overflow-x-auto space-x-5">
									<PopularNftCard
										imageSrc="/assets/services-page/popular1.png"
										title="Normilady #1982"
										currencyImageSrc="/assets/services-page/sol.png"
										currencyAmount="0.1678 SOL"
									/>

									<PopularNftCard
										imageSrc="/assets/services-page/popular2.png"
										title="Normilady #1982"
										currencyImageSrc="/assets/services-page/eth.png"
										currencyAmount="0.1678 ETH"
										ranking="10"
									/>

									<PopularNftCard
										imageSrc="/assets/services-page/popular3.png"
										title="Normilady #1982"
										currencyImageSrc="/assets/services-page/eth.png"
										currencyAmount="0.1678 ETH"
										ranking="2564"
									/>

									<PopularNftCard
										imageSrc="/assets/services-page/popular4.png"
										title="Normilady #1982"
										currencyImageSrc="/assets/services-page/eth.png"
										currencyAmount="0.1678 ETH"
										ranking="1154"
									/>
								</div>
								<ScrollBar orientation="horizontal" className=" h-2" />
							</ScrollArea>
						</div>
						<div
							className="h-[auto] bg-cover bg-center w-full"
							style={{
								backgroundImage: "url('/assets/landing-page/background3.png')",
							}}
						>
							{" "}
							{/* Section 4 */}
							<div className="container px-0 md:px-10 mx-auto mt-12  flex justify-center">
								<div className="w-full rounded-none md:rounded-3xl mt-14 bg-su_primary px-2 py-10 md:px-28 md:py-16 mb-10">
									<div className="flex justify-center max-w[850px]">
										<div className="max-w-[850px]  mt-0 md:mt-12">
											<p className="text-4xl text-start  font-Poppins md:text-5xl text-su_primary_bg font-semibold md:text-center mt-12 ">
												<span className="px-3 py-3 rounded-full bg-su_brand_week text-su_primary_bg inline-block">
													Open
												</span>{" "}
												Swaps Awaits Your Exploration
											</p>
											<p className="text-su_primary_black mt-8   font-Urbanist text-start md:text-center md:text-lg font-medium leading-relaxed ">
												Discover, engage, and offer your assets as an open swap
												so people can view and send you an offer.
											</p>
										</div>
									</div>

									<ScrollArea className="w-full px-10 mt-14">
										<Table className="min-w-full text-su_primary_black relative">
											<TableHeader>
												<TableRow>
													<TableHead className="align-top font-semibold min-w-[150px] text-su_primary_black">
														Assets
													</TableHead>
													{/* <TableHead className="align-top font-semibold line-clamp-1 h-1 min-w-[100px] pl-4" >Unique trade ID</TableHead> */}
													<TableHead className="align-top font-semibold px-4 min-w-[150px] text-su_primary_black">
														Owner's wallet
													</TableHead>
													<TableHead className="align-top font-semibold min-w-[130px] px-4 text-su_primary_black">
														Trading chain
													</TableHead>
													<TableHead className="align-top font-semibold min-w-[150px] px-4 text-su_primary_black">
														Open swap date
													</TableHead>
													<TableHead className="align-top font-semibold min-w-[130px] px-4 text-su_primary_black">
														Expiry date
													</TableHead>
													<TableHead className="align-top font-semibold min-w-[150px] px-4 text-su_primary_black">
														Swap Preferences
													</TableHead>
													<TableHead className="pr-2"></TableHead>
												</TableRow>
											</TableHeader>

											<TableBody className="divide-y">
												{recentOpenSwapData?.map((swap) => {
													const currentChain =
														chainsDataset.find(
															(chain) => chain.uuid === swap.trading_chain
														) || chainsDataset[1];
													return (
														<TableRow key={swap.open_trade_id}>
															<TableCell className="text-xs font-medium flex items-center gap-2">
																<div className="flex items-center gap-1">
																	{nftsImageMapperForOpenTradeTable(
																		swap.metadata.init.tokens
																	)}
																</div>
															</TableCell>

															<TableCell className="text-xs font-medium px-4">
																{getShortenWalletAddress(swap.init_address)}
															</TableCell>
															<TableCell className="text-xs font-medium px-4 flex justify-start">
																<span className="w-auto flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-su_enable_bg capitalize">
																	<img
																		className="w-4 h-4"
																		src={currentChain.iconUrl}
																		alt=""
																	/>

																	{currentChain.name}
																</span>
															</TableCell>
															<TableCell className="text-xs font-medium px-4">
																{moment
																	.utc(swap.created_at)
																	.format("MMM DD, YYYY")}
															</TableCell>
															<TableCell className="text-xs font-medium px-4">
																{moment
																	.utc(swap.swap_preferences.expiration_date)
																	.local()
																	.format("MMM DD, YYYY")}
															</TableCell>
															<TableCell className="text-xs font-medium px-4 capitalize">
																{swap.swap_preferences.preferred_asset.type ===
																	"any" && (
																		<span className="w-auto flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-su_enable_bg capitalize">
																			Any
																		</span>
																	)}

																{swap.swap_preferences.preferred_asset.type ===
																	"nft" && (
																		<div className="flex items-center gap-1 flex-wrap">
																			<span className="w-auto flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-su_enable_bg capitalize">
																				{
																					swap.swap_preferences.preferred_asset
																						.parameters.collection
																				}
																			</span>
																			/
																			<span className="w-auto flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-su_enable_bg capitalize">
																				{
																					swap.swap_preferences.preferred_asset
																						.parameters.rank?.from
																				}{" "}
																				-{" "}
																				{
																					swap.swap_preferences.preferred_asset
																						.parameters.rank?.to
																				}
																			</span>
																		</div>
																	)}

																{swap.swap_preferences.preferred_asset.type ===
																	"currency" && (
																		<div className="flex items-center gap-1">
																			<span className="w-auto flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-su_enable_bg capitalize">
																				Crypto currencies
																			</span>
																		</div>
																	)}
															</TableCell>
															<TableCell className="text-xs font-medium flex pr-8 justify-end">
																<svg
																	width="32"
																	height="32"
																	viewBox="0 0 32 32"
																	fill="none"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<rect
																		x="1"
																		y="1"
																		width="30"
																		height="30"
																		rx="15"
																		stroke="url(#paint0_linear_290_8928)"
																		strokeWidth="2"
																	/>
																	<path
																		d="M17.7284 11L22 15.1586H10.2385V14.0368H19.2184L16.9138 11.7931L17.7284 11ZM21.7615 16.8414V17.9632H12.7816L15.0862 20.2069L14.2716 21L10 16.8414H21.7615Z"
																		fill="#0D0D23"
																	/>
																	<defs>
																		<linearGradient
																			id="paint0_linear_290_8928"
																			x1="32"
																			y1="6.08"
																			x2="-1.86631"
																			y2="14.9716"
																			gradientUnits="userSpaceOnUse"
																		>
																			<stop stopColor="#51C0FF" />
																			<stop offset="1" stopColor="#9452FF" />
																		</linearGradient>
																	</defs>
																</svg>
															</TableCell>
														</TableRow>
													);
												})}
											</TableBody>
										</Table>
										<div
											className="absolute bottom-3 left-0 right-0 opacity-50 z-10 bg-white shadow-white"
											style={{
												height: "50px", // Adjust height as needed

												pointerEvents: "none",
											}}
										></div>
										<ScrollBar orientation="horizontal" className="h-2" />
									</ScrollArea>
									<p className="text-center text-su_primary_black mt-12 text-sm">
										Still haven't found what to swap? Let's explore more options
										together!
									</p>
									<div className="flex justify-center mt-8 mb-12">
										<CustomOutlineButton className="p-3">
											Explore Open Swaps
										</CustomOutlineButton>
									</div>
								</div>
							</div>
						</div>
						{/* Section 5 */}
						<div
							className="h-[auto] bg-cover  w-full  "
							style={{
								backgroundImage: "url('/assets/svgs/Background9.svg')",
							}}
						>
							<div className=" container mx-auto px-2  flex flex-col md:flex-row items-start justify-between py-24  ">
								<div className="w-full md:w-1/2 flex text-start md:text-start mt-10 align-text-top  ">
									<div className="w-full">
										<p className="text-su_primary  align-top text-4xl font-Poppins md:text-5xl font-semibold text-left md:text-left mt-12 ">
											How It
											<span className="px-3 py-1 rounded-full bg-su_light_pink text-black inline-block ml-2 ">
												Works
											</span>
										</p>
										<p className="text-su_primary_light mt-8 w-full md:max-w-[550px] font-Urbanist text-start md:text-left  md:text-lg font-medium leading-relaxed ">
											We have created 2 different trade types for users to take advantage of. Private Party trades between 2 known individuals, and Open Market trades which are crated by 1 user, and viewable to everyone on the platform.
											Depending on the type you select, there will be different processes.
										</p>
										<div className="mt-8">
											<Button
												className="text-md gap-8"
												onClick={() =>
													navigate(
														`${defaults.swapMarket.baseRoute}/${defaults.swapMarket.defaultActiveTab}`
													)
												}
											>
												Start Trading
											</Button>
										</div>
									</div>
								</div>

								<div className="flex text-start  md:text-start w-full md:w-1/2  mt-10">
									<div className="flex w-full flex-col font-Poppins h-auto text-start md:text-start space-x-0 lg:flex-row  ">
										<div className="text-start md:text-start w-full  ">

											<Tabs defaultValue={"private-party"} className='min-h-40'>
												<TabsList className="" >
													<TabsTrigger value={"private-party"} className='capitalize data-[state=active]:border-none relative group'>
														Private Party Swap
														<p className="group-data-[state=active]:bg-gradient-primary h-1 w-full bottom-[-2px] absolute" ></p>
													</TabsTrigger>
													<TabsTrigger value={"open-market"} className='capitalize data-[state=active]:border-none relative group'>
														Open Market Swap
														<p className="group-data-[state=active]:bg-gradient-primary h-1 w-full bottom-[-2px] absolute" ></p>
													</TabsTrigger>
												</TabsList>

												{/* Private party content */}
												<TabsContent value="private-party" className='py-2'>
													<div className="p-8 bg-su_least_bg rounded-2xl opacity-80">
														<h3 className="font-Urbanist font-semibold text-xl text-su_primary mb-3">
															Let's Start With the Initiator Steps for Private Party
														</h3>
														<InitiatorSteps list={closedSwapList} />
													</div>
												</TabsContent>

												{/* Open market */}
												<TabsContent value="open-market" className='py-2'>
													<div className="p-8 bg-su_least_bg rounded-2xl opacity-80">
														<h3 className="font-Urbanist font-semibold text-xl text-su_primary mb-3">
															Let's Start With the Initiator Steps for Open Market
														</h3>
														<InitiatorSteps list={openSwapList} />
													</div>
												</TabsContent>
											</Tabs>

										</div>
									</div>
								</div>
							</div>
						</div>
						{/* Section 6 */}
						<div
							className="h-[auto] bg-cover  w-full  "
							style={{
								backgroundImage: "url('/assets/svgs/Background9.svg')",
							}}
						>
							<div className=" container mx-auto px-2  flex flex-col md:flex-row items-start justify-between py-24  ">
								<div className="w-full md:w-1/2 flex text-start md:text-start mt-10 align-text-top  ">
									<div className="w-full">
										<p className="text-su_primary  align-top text-4xl font-Poppins md:text-5xl font-semibold text-left md:text-left mt-4 ">
											Enhanced {" "}
											Functionality With {" "}
											<span className="px-3 py-1 rounded-full bg-su_tea_green text-black inline-block  ">
												Subdomains
											</span>
										</p>
										<p className="text-su_primary_light mt-8 w-full md:max-w-[550px] font-Urbanist text-start md:text-left  md:text-lg font-medium leading-relaxed ">
											Explore the myriad possibilities of subdomains and elevate your membership with enhanced functionality.
											Discover how strategic subdomain can streamline user trades, boost your platform value, and amplify your rrewards.
										</p>
										<div className="mt-8">
											<CustomOutlineButton className="text-md px-4 py-3">
												Discover Subdomains
											</CustomOutlineButton>
										</div>
									</div>
								</div>
								<div className="flex text-start  md:text-start w-full md:w-1/2  mt-10">
									<div className="flex w-full flex-col font-Poppins h-auto text-start md:text-start space-x-0 lg:flex-row  ">
										<div className="text-start md:text-start w-full  ">
											<div className="w-full">
												<div className="p-8 bg-su_least_bg rounded-3xl opacity-80">
													<h3 className="font-Urbanist font-semibold text-xl text-su_primary mb-3">
														Mint Your Subdomain
													</h3>
													<div>
														<div className=" flex items-center mt-2 border rounded-sm p-4 border-1 border-solid border-su_disabled">
															<svg
																className="mr-2"
																width="16"
																height="16"
																viewBox="0 0 16 16"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M14 2H2V14H14V2ZM6 11.3333H4.66667V6.66667H6V11.3333ZM8.66667 11.3333H7.33333V4.66667H8.66667V11.3333ZM11.3333 11.3333H10V8.66667H11.3333V11.3333Z"
																	fill="#7586FF"
																/>
															</svg>
															<p>Reduced token trading fees</p>
														</div>
														<div className=" flex items-center mt-2 border rounded-sm p-4 border-1 border-solid border-su_disabled">
															<svg
																className="mr-2"
																width="16"
																height="16"
																viewBox="0 0 16 16"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M2.90909 1V2.85714H1V4.09524H2.90909V5.95238H4.18182V4.09524H6.09091V2.85714H4.18182V1H2.90909ZM7 2.85714V5H5V7H2.90909V12.7619C2.90909 13.0903 3.04318 13.4052 3.28186 13.6374C3.52055 13.8696 3.84427 14 4.18182 14H13.0909C13.7973 14 14.3636 13.449 14.3636 12.7619V12.1429H8.63636C8.29882 12.1429 7.97509 12.0124 7.73641 11.7802C7.49773 11.548 7.36364 11.2331 7.36364 10.9048V5.95238C7.36364 5.62402 7.49773 5.3091 7.73641 5.07692C7.97509 4.84473 8.29882 4.71429 8.63636 4.71429H14.3636V4.09524C14.3636 3.76687 14.2295 3.45196 13.9909 3.21977C13.7522 2.98758 13.4285 2.85714 13.0909 2.85714H7ZM8.63636 5.95238V10.9048H15V5.95238H8.63636ZM11.1818 7.5C11.71 7.5 12.1364 7.91476 12.1364 8.42857C12.1364 8.94238 11.71 9.35714 11.1818 9.35714C10.6536 9.35714 10.2273 8.94238 10.2273 8.42857C10.2273 7.91476 10.6536 7.5 11.1818 7.5Z"
																	fill="#7586FF"
																/>
															</svg>

															<p>Connect multiple wallets</p>
														</div>
														<div className=" flex items-center mt-2 border rounded-sm p-4 border-1 border-solid border-su_disabled">
															<svg
																className="mr-2"
																width="16"
																height="16"
																viewBox="0 0 16 16"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M12.6772 8.57554C11.6395 5.69977 7.78235 5.66648 9.24519 1C6.4508 2.33804 4.23779 5.77965 6.42579 10.3263C3.33133 8.94167 4.68789 5.47343 4.68789 5.47343C4.68789 5.47343 3 6.57848 3 9.92024C3.23755 13.6481 6.19449 14.7931 7.25723 14.9395C8.77633 15.1459 10.4205 14.8463 11.602 13.6947C12.9023 12.4099 13.3774 10.3596 12.6772 8.57554ZM6.87589 11.924C7.7761 11.691 8.23871 10.9987 8.36374 10.3862C8.57003 9.43428 7.7636 8.50232 8.30747 6.99786C8.51377 8.2427 10.3517 9.02156 10.3517 10.3796C10.4017 12.0638 8.68881 13.5083 6.87589 11.924Z"
																	fill="#7586FF"
																/>
															</svg>

															<p>No fees for NFT only trades</p>
														</div>
														<div className=" flex items-center mt-2 border rounded-sm p-4 border-1 border-solid border-su_disabled">
															<svg
																className="mr-2"
																width="16"
																height="16"
																viewBox="0 0 16 16"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M6.42241 4.37621C5.16765 5.78442 4.30654 7.80757 4.22658 7.9982L2 7.04504L4.95853 4.08719L6.42241 4.37621ZM7.64027 10.9253C7.64027 10.9253 9.94066 9.97215 11.2631 8.65003C14.5845 5.32937 14.0309 2.73433 13.8526 2.15013C13.2682 1.96565 10.6726 1.41836 7.35118 4.73903C6.02876 6.06114 5.07539 8.36101 5.07539 8.36101L7.64027 10.9253ZM11.626 9.57859C10.2174 10.8331 8.19384 11.694 8.00316 11.7739L8.95653 14L11.9151 11.0421L11.626 9.57859ZM6.30555 11.5402C6.30555 12.0506 6.09642 12.5118 5.76428 12.8439C5.03849 13.5695 2 14 2 14C2 14 2.43055 10.9622 3.15635 10.2366C3.48849 9.90451 3.9498 9.69543 4.46031 9.69543C5.48134 9.69543 6.30555 10.5194 6.30555 11.5402ZM8.76586 6.0058C8.76586 5.32937 9.31943 4.77592 9.99602 4.77592C10.6726 4.77592 11.2262 5.32937 11.2262 6.0058C11.2262 6.68223 10.6726 7.23568 9.99602 7.23568C9.31943 7.23568 8.76586 6.68223 8.76586 6.0058Z"
																	fill="#7586FF"
																/>
															</svg>

															<p>Qualify for more rewards</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* Section 7 */}
						<div
							className="h-[auto] bg-cover  w-full "
							style={{
								backgroundImage: "url('/assets/landing-page/background3.png')",
							}}
						>
							<div className=" container mx-auto px-2 flex-col md:flex-row  flex items-start justify-between py-32  ">
								<div className="w-full md:w-1/2 flex text-start md:text-start mt-10 align-text-top  ">
									<div className="w-full">
										<p className="text-su_primary  align-top text-4xl font-Poppins md:text-5xl font-semibold text-left md:text-left mt-12 ">
											<span className="px-3 py-1 rounded-full bg-su_buttermilk text-black inline-block ml-2 ">
												FAQ
											</span>{" "}
										</p>
										<p className="text-su_primary_light mt-8 max-w-[550px] font-Urbanist text-start md:text-left  md:text-lg font-medium leading-relaxed ">
											Common questions our community is asking about the trading
											platform and value we provide our community before the open market.
										</p>
									</div>
								</div>
								<div className="flex text-start  md:text-start w-full md:w-1/2  mt-10">
									<div className="flex w-full flex-col font-Poppins h-auto text-start md:text-start space-x-0 lg:flex-row  ">
										<div className="text-start md:text-start w-full  ">
											<div className="w-full">
												<Accordion type="single" collapsible>
													<AccordionItem value="item-1">
														<p className="text-su_primary_lighter font-Poppins text-base leading-10 mt-2">
															01
														</p>
														<AccordionTrigger className="text-start md:text-start ">
															Why should I use SwapUp?
														</AccordionTrigger>
														<AccordionContent className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
															We have built our platform to be the go to peer to peer trading platform.
															We built our smart contracts to execute trade agreements simultaneously to reduce scams and provide efficient and effective trades between 2 users. We continue to develop new applications
															for P2P trading and reward our community as we grow.
														</AccordionContent>
													</AccordionItem>
												</Accordion>
												<Accordion type="single" collapsible>
													<AccordionItem value="item-1">
														<p className="text-su_primary_lighter font-Poppins text-base leading-10 mt-2">
															02
														</p>
														<AccordionTrigger className="text-start md:text-start ">
															How is SwapUp innovative?
														</AccordionTrigger>
														<AccordionContent className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
															Not only are we concentrating on what future P2P2 marketplaces should look like, we also use the latest technology to create a more efficient trading process.
															<p className="h-6">{"   "}</p>
															Smart Accounts - Create a platform account and use SWPUP tokens to pay for transactions costs.
															<p className="h-6">{"   "}</p>
															No Gas - We aim to build a platform to onboard the next 100 million users. We believe this will challenge us to make Web3 feel like Web2. That means no annoying gas fees and seamless purchases processes.
															<p className="h-6">{"   "}</p>
															Subdomains - ENS is a critical infrastructure for Web3 and we’ve integrated it into our application. We want to build on top of ENS, allowing for cross chain value with 1 subdomain.
														</AccordionContent>
													</AccordionItem>
												</Accordion>
												<Accordion type="single" collapsible>
													<AccordionItem value="item-1">
														<p className="text-su_primary_lighter font-Poppins text-base leading-10 mt-2 ">
															03
														</p>
														<AccordionTrigger className="text-start md:text-start ">
															What can SWPUP tokens do?
														</AccordionTrigger>
														<AccordionContent className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
															SWPUP tokens provide a few benefits to both the company and the users. For buyers, we offer a 50% discount on trading fees to those who own them. Since they are held in a smart wallet, they can also be used to pay all transaction fees for both NFT’s and Cryptocurrency trades.
															<p className="h-6">{"   "}</p>
															From a business view, the sales of tokens allow us to continue building out more functionality for our customer base. We want to build world class P2P applications and this base token is helping us achieve those goals.
														</AccordionContent>
													</AccordionItem>
												</Accordion>
												<Accordion type="single" collapsible>
													<AccordionItem value="item-1">
														<p className="text-su_primary_lighter font-Poppins text-base leading-10 mt-2 ">
															04
														</p>
														<AccordionTrigger className="text-start md:text-start ">
															How do I become a member?
														</AccordionTrigger>
														<AccordionContent className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
															There are 3 levels of memberships
															<p className="h-2">{"   "}</p>
															<p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4  md:mt-2 mb-2">
																Level 1 - Create a Platform Account
															</p>
															<p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4  md:mt-2 mb-2">
																Level 2 - Buy SWPUP tokens
															</p>
															<p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4  md:mt-2 mb-2">
																Level 3 - Purchase your subdomain
															</p>

														</AccordionContent>
													</AccordionItem>
												</Accordion>
												<Accordion type="single" collapsible>
													<AccordionItem value="item-1">
														<p className="text-su_primary_lighter font-Poppins text-base leading-10 mt-2">
															05
														</p>
														<AccordionTrigger className="text-start md:text-start ">
															What value can members receive?
														</AccordionTrigger>
														<AccordionContent className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
															Our business model is to reward loyalty. Those who believe in us will reap the most rewards from helping us grow. Not only will they be rewarded with value driven utility tokens, but will also be the first ones eligible for future LP tokens, access to enhanced functionality before the open market, and receive exclusive benefits.
															Get involved, help us grow, and spread the word about the platform to gain the most value possible.
														</AccordionContent>
													</AccordionItem>
												</Accordion>

											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* Section 8 */}
						<div
							className="h-[auto] bg-cover w-full "
							style={{
								backgroundImage: "url('/assets/svgs/Background10.svg')",
							}}
						>
							<div className="container mx-auto   px-2 space-y-20 flex items-center justify-between">
								<div className="w-full mt-12 ">
									<div className="flex justify-normal w-full items-start mt-8 pb-8 overflow-x-auto  md:justify-center">
										<div className="flex space-x-0 md:space-x-0">
											<div className="w-full mt-12 ">
												<p className="w-full text-su_primary max-w-[550px] text-4xl font-Poppins md:text-5xl font-semibold text-center md:text-center md:justify-center mt-12 ">
													Join the{" "}
													<span className="px-3 py-1 rounded-full bg-su_brand_week text-black inline-block ml-2">
														Future
													</span>{" "}
													of Trading!
												</p>
												<p className=" w-full text-su_primary_light  mt-8 max-w-[650px] font-Urbanist items-center md:text-center md:text-lg font-medium leading-relaxed  md:justify-center ">
													Experience seamless transactions, unlock exclusive
													benefits, and dive into the world of Web3
												</p>
											</div>
										</div>
									</div>
									<div className="mt-8 mb-32 items-center md:justify-center   md:text-center md:text-lg ">
										<Button
											onClick={() =>
												navigate(
													`${defaults.swapMarket.baseRoute}/${defaults.swapMarket.defaultActiveTab}`
												)
											}
										>
											Go to dApp
										</Button>
									</div>

									<div className="flex justify-normal w-full mt-8 pb-8 overflow-x-auto  md:justify-center">
										<div className="flex space-x-0 md:space-x-0">
											<Link to={"https://x.com/Swapupdapp"} target="_blank">
												<span>
													<img
														src={"/assets/svgs/twiter.svg"}
														className="ml-0 md:ml-0  md:w-auto md:h-auto mb-0 md:mb-2"
														alt="icon"
													/>
												</span>
											</Link>
											<Link
												to={"https://warpcast.com/swapupdapp"}
												target="_blank"
											>
												<span>
													<img
														src={"/assets/svgs/Warpcast.svg"}
														className="ml-0 md:ml-0 w-4 h-5 md:w-auto md:h-auto mb-0 md:mb-2"
														alt="icon"
													/>
												</span>
											</Link>
											<Link
												to={"https://discord.gg/RCvDRY9dW3"}
												target="_blank"
											>
												<span>
													<img
														src={"/assets/svgs/Discord.svg"}
														className="ml-0 md:ml-0 w-4 h-5 md:w-auto md:h-auto mb-0 md:mb-2"
														alt="icon"
													/>
												</span>
											</Link>
											<Link to={"https://medium.com/@swapup"} target="_blank">
												<span>
													<img
														src={"/assets/svgs/Medium.svg"}
														className="ml-0 md:ml-0 w-4 h-5 md:w-auto md:h-auto mb-0 md:mb-2"
														alt="icon"
													/>
												</span>
											</Link>
										</div>
									</div>

									<div className="w-full flex items-center gap-3 lg:gap-6 mb-10  md:justify-center">
										<Link to={"/"} className="font-semibold">
											Legal Terms
										</Link>
										<span
											className="font-semibold"
											onClick={() => navigate("/privacy-policy")}
										>
											Privacy Policy
										</span>
									</div>
									<div className="flex items-center gap-3 lg:gap-6 mb-10  md:justify-center">
										<p className="text-su_secondary">
											Copyright © 2024 SwapUp, All Rights Reserved.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ServicesPage;
