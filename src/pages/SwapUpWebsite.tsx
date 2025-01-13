import { Button } from "@/components/ui/button";
import LogoButton from "@/components/custom/landing-page/logo-button";
import CommunityCard from "@/components/custom/landing-page/community-card";
import VerticalDivider from "@/components/custom/landing-page/vertical-divider";
import HorizontalDivider from "@/components/custom/landing-page/horizontal-divider";
import LpNavbar from "@/components/custom/landing-page/lp-navbar";
import { communityCardDetails } from "@/constants/data";
import CarousalCard from "@/components/custom/landing-page/carousal-card";
import Testimonial from "@/components/custom/landing-page/testimonial";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomOutlineButton from "@/components/custom/shared/CustomOutlineButton";
import { defaults } from "@/constants/defaults";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";


const SwapUpPage = () => {
	const navigate = useNavigate();


	const location = useLocation();

	useEffect(() => {
		// This will run whenever the location changes
		if (location.hash) {
			const section = document.querySelector(location.hash);
			if (section) {
				section.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}, [location]);

	return (

		<div className="relative" id="home">
			<LpNavbar />

			<div className="relative top-0 h-full w-full" >
				<img
					className="absolute bottom-0 h-[calc(100%_+_6rem)] w-full"
					src="/assets/landing-page/background1-new.png"
					alt=""
				/>

				{/* Section 1 */}
				<div className="relative container mx-auto px-2 md:px-10" >
					<div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between mt-4">
						<div className="max-w-[797px] md:mr-8 ">
							<p className="text-4xl font-Poppins md:text-7xl font-semibold text-left mt-12 text-su_primary">
								Secure Way To Trade{" "}
								<span className="px-3 py-1 rounded-full bg-su_tea_green text-black inline-block ml-2">
									Assets
								</span>{" "}
								Digitally
							</p>
							<p className="text-su_primary_light mt-8 max-w-[450px] font-Urbanist text-base md:text-lg font-medium leading-relaxed text-left">
								SwapUp is a decentralized application using blockchain and smart
								contract technology to allow users to engage in peer-to-peer
								agreements with others locally and worldwide.
							</p>
							<div className="mt-8">
								<Button onClick={() => navigate(`${defaults.swapMarket.baseRoute}/${defaults.swapMarket.defaultActiveTab}`)} >Start Trading</Button>
							</div>
						</div>
						<div className="w-full max-w-[450px] mt-8 md:mt-0">
							<img
								src="/assets/landing-page/photoroom2.png"
								alt="photoroom"
								className="object-contain mx-auto"
							/>
						</div>
					</div>

					<div className="flex justify-start w-full mt-16 pb-16 overflow-x-auto md:justify-center">
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
					className="h-[auto] bg-cover bg-center w-full"
					style={{
						backgroundImage: "url('/assets/landing-page/background2-new.png')",
					}}
				> {/* Section 2 */}
					<div className="container mx-auto px-2 md:px-10"  >
						<div className="flex flex-col md:flex-row items-center md:justify-center" >
							<div className="max-w-[auto] mt-12" >
								<p className="text-su_primary text-4xl font-Poppins md:text-5xl font-semibold text-center mt-12 ">
									Empowering{""}
									<span className="px-3 py-1 rounded-full bg-su_buttermilk text-black inline-block ml-2">
										Diversity
									</span>
								</p>
								<p className="text-su_primary_light mt-8 max-w-[650px] font-Urbanist text-center  md:text-lg font-medium leading-relaxed ">
									Our platform is tailored to serve a diverse community of users
									with a wide range of use cases. Swap what you want, how you
									want..
								</p>
							</div>
						</div>
						<div className="flex justify-center w-full mt-16 mb-16">
							<div className="flex flex-col lg:flex-row md:space-y-0 md:space-x-4 ">
								<CommunityCard
									number="01"
									title="Traders"
									description={
										"Trade assets on multiple blockchains and diversify your NFT exposure. Trade up to 20 tokens at once. Private and Open Market trading. Trade and buy with any cryptocurrency"
									}
								/>
								<CommunityCard
									number="02"
									title="Collectors"
									description={
										"Collect your forever NFTs and grow the collections you love."
									}
								/>
								<CommunityCard
									number="03"
									title="Projects"
									comingSoon
									description={
										"Showcase your project, gain new followers, and grow your community using our platform."
									}
								/>
								<CommunityCard
									number="04"
									title="Commerce"
									comingSoon
									description={
										"Use our innovative applications for all your personal commerce needs."
									}
								/>
							</div>
						</div>
						{/*Section 3*/}
						<div className="w-full mt-12 mb-20 flex flex-col lg:flex-row justify-between lg:justify-start" id="we-are-growing">

							<div className="w-full ">
								<p className="text-su_primary text-4xl font-Poppins md:text-5xl font-semibold text-center mt-12 lg:text-left">
									We are{" "}
									<span className="px-3 py-1 rounded-full bg-su_brand_week text-su_primary_bg inline-block">
										Growing!
									</span>
								</p>
								<p className="text-su_primary_light mt-6 max-w-[482px] font-Urbanist text-center  lg:text-left text-md font-medium leading-relaxed ">
									Be part of our community and help us grow a secure ecosystem
									for peer-to-peer transactions.
								</p>
							</div>

							<div className="flex justify-center items-center mt-4  w-full">
								<div className=" flex flex-col max-w-[680px] mt-10 h-auto justify-between space-x-16 lg:flex-row md:mt-0">

									<div className="text-center max-w-[194px]">
										<p className="font-Poppins text-5xl font-semibold">7500</p>
										<p className="font-Urbanist text-xs mt-4">
											Smart Wallets Created
										</p>
									</div>

									<div className="hidden md:block">
										<VerticalDivider />
									</div>

									<div className="h-px w-40 mt-4 mb-4 block lg:hidden">
										<HorizontalDivider />
									</div>

									<div className="h-px w-40 mt-4 mb-4 block lg:hidden">
										<HorizontalDivider />
									</div>

									<div className="h-px w-40 mt-4 mb-4 block lg:hidden">
										<HorizontalDivider />
									</div>
									<div className="text-center max-w-[194px]">
										<p className="font-Poppins text-5xl font-semibold">$</p>
										<p className="font-Urbanist text-xs mt-4">
											SWPUP Tokens Minted
										</p>
									</div>

									<div className="hidden md:block">
										<VerticalDivider />
									</div>

									<div className="h-px w-40 mt-4 mb-4 block lg:hidden">
										<HorizontalDivider />
									</div>

									<div className="h-px w-40 mt-4 mb-4 block lg:hidden">
										<HorizontalDivider />
									</div>

									<div className="h-px w-40 mt-4 mb-4 block lg:hidden">
										<HorizontalDivider />
									</div>

									<div className="text-center max-w-[194px]">
										<p className="font-Poppins text-5xl font-semibold">550</p>
										<p className="font-Urbanist text-xs mt-4">
											Members
										</p>
									</div>

								</div>
							</div>

						</div>
					</div>
				</div>
			</div>

			{/* <div className="text-center max-w-[194px]">
				<p className="font-Poppins text-5xl font-semibold">550</p>
				<p className="font-Urbanist text-xs mt-4">
					Number of active users
				</p>
			</div>				 */}

			<div
				className="h-[auto] bg-cover bg-center w-full"
				style={{
					backgroundImage: "url('/assets/landing-page/background3.png')",
				}}
			> {/* Section 3 */}
				<div className="container px-0 md:px-10 mx-auto mt-12 flex justify-center">
					<div className="w-full rounded-none md:rounded-3xl bg-su_primary px-2 py-10 md:px-28 md:py-16 mb-10">
						<div className="flex justify-center max-w[850px]">
							<div className="max-w-[850px]  mt-0 md:mt-12">
								<p className="text-4xl text-start  font-Poppins md:text-5xl text-su_primary_bg font-semibold md:text-center mt-12 ">
									<span className="px-3 py-3 rounded-full bg-su_light_pink text-su_primary_bg inline-block">
										Unlocking
									</span>{" "}
									Platform Potential
								</p>
								<p className="text-su_primary_black mt-8 max-w-[700px]  font-Urbanist text-start md:text-center md:text-lg font-medium leading-relaxed ">
									We are always building useful technology to expand peer to
									peer trading. Stay informed on the functionality our
									application currently offers, and more to come in the future.
								</p>
							</div>
						</div>
						<ScrollArea>
							<div className="mt-16 mb-16 w-full flex justify-start overflow-x-auto">
								<div className="flex space-x-2 md:space-x-10">
									<CarousalCard
										imageSrc="/assets/landing-page/exchange-nfts.png"
										title="Exchange NFT's and Crypto On Multiple Networks"
										description="Create the perfect trade between you and your peers using a customizable swap agreement to pick the right amount of NFT's and crypto to make a fair trade."
										buttonText="Find out more"
									/>
									<CarousalCard
										imageSrc="/assets/landing-page/project-hub.png"
										title="Project Hub"
										description="A place for projects to enhance community engagement and reach a wider audience using our core smart contracts and application functionality."
										buttonText="Coming Soon"
										comingSoon
										onClick={() => { }}
									/>
									<CarousalCard
										imageSrc="/assets/landing-page/community-rewards.png"
										title="Community Rewards"
										description="Establish a DAO to reward users and Projects who help grow the community and promote a safe platform for users to trade assets."
										buttonText="Coming Soon"
										comingSoon
										onClick={() => { }}
									/>
								</div>
							</div>
							<ScrollBar orientation="horizontal" className="h-2" />
						</ScrollArea>
					</div>
				</div>
			</div>
			<div
				className="h-[auto] bg-cover bg-center min-w-full"
				style={{
					backgroundImage: "url('/assets/landing-page/background4-testnew.png')",
				}}
			> {/* Section 4 */}
				<div className="container mx-auto px-2 md:px-10" id="tech-stack" >
					<div className="flex flex-col md:flex-row items-center md:justify-center">
						<div className="max-w-[auto] mt-12">
							<p className="text-su_primary text-4xl font-Poppins md:text-5xl font-semibold text-start md:text-center mt-12 ">
								Foundations of Our
								<span className="px-3 py-1 rounded-full bg-su_tea_green text-black inline-block ml-2">
									Success
								</span>
							</p>
							<p className="text-su_primary_light mt-8 max-w-[650px] font-Urbanist text-start md:text-center  md:text-lg font-medium leading-relaxed ">
								Empowering progress with cutting-edge solutions: discover the
								technologies behind our platform's success.
							</p>
						</div>
					</div>
					<div className="w-full mt-12 mb-14">
						<div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 mb-0 md:mb-5">
							{communityCardDetails
								.slice(0, 3)
								.map((communityCardDetail, index) => (
									<CommunityCard
										key={index}
										icon={communityCardDetail.src}
										title={communityCardDetail.title}
										description={communityCardDetail.desc}
									/>
								))}
						</div>
						<div className="grid grid-cols-1 md:grid-cols-4 md:gap-5 mb-0 md:mb-5">
							{communityCardDetails
								.slice(3, 7)
								.map((communityCardDetail, index) => (
									<CommunityCard
										key={index}
										icon={communityCardDetail.src}
										title={communityCardDetail.title}
										description={communityCardDetail.desc}
									/>
								))}
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 md:gap-5">
							{communityCardDetails
								.slice(7, 10)
								.map((communityCardDetail, index) => (
									<CommunityCard
										key={index}
										icon={communityCardDetail.src}
										title={communityCardDetail.title}
										description={communityCardDetail.desc}
									/>
								))}
						</div>
					</div>
				</div>
			</div>
			<div
				className="h-[auto] bg-cover bg-center w-full "
				style={{
					backgroundImage: "url('/assets/landing-page/background5-testnew.png')",
				}}
			> {/* Section 5 */}
				<div className="container mx-auto px-2 md:px-10 space-y-20">
					<div className="flex flex-col md:flex-row items-center md:justify-center">
						<div className="max-w-[auto] mt-12">
							<p className="text-su_primary text-4xl font-Poppins md:text-5xl font-semibold text-start md:text-center mt-12 ">
								Celebrating
								<span className="px-3 py-1 rounded-full bg-su_buttermilk text-black inline-block ml-2">
									Success
								</span>{" "}
								Stories
							</p>
							<p className="text-su_primary_light mt-8 max-w-[650px] font-Urbanist text-start md:text-center  md:text-lg font-medium leading-relaxed ">
								Step into the world of SwapUp through the eyes of our users.
								Discover their experiences, insights, and the impact SwapUp has
								made on their lives and businesses.
							</p>
						</div>
					</div>

					<ScrollArea className="w-full mb-20 py-6">
						<div className="w-full flex justify-center space-x-5">
							<Testimonial
								rating={5}
								text="Swapup has been an integral part of one of the main holder perks of Stone Nomads NFT, the ability to “swap up” your Stone Nomads for higher ranked Stone Nomads from the vault. The process is smooth, secure and minimizes gas fees. Swapup is a trusted partner in a trustless ecosystem and we’re looking forward to seeing what features are added to the Swapup dapp as the Stone Nomads wander the blockchain!"
								author="StoneNomads NFT Project"
								containerClasses="w-[340px]"
							/>

							{/* <div>
								<VerticalDivider />
							</div> */}

						</div>
						<ScrollBar orientation="horizontal" className=" h-2" />
					</ScrollArea>

					{/* <p className="font-Urbanist text-sm text-su_primary_lighter text-center">
						Ready to share your experience?
						<span className="font-Urbanist text-sm text-su_primary">
							{"  "}Leave your feedback
						</span>
					</p> */}
				</div>



			</div >

			<div
				className="h-[auto] bg-cover bg-center min-w-full"
				style={{
					backgroundImage: "url('/assets/landing-page/background6-testnew.png')",
				}}
			>

				{/* Section 6 */}
				<div className="container px-0 md:px-10 mx-auto mt-12 flex justify-center" id="roadmap-section" >
					<div className="w-full rounded-none md:rounded-3xl bg-su_primary px-2 py-6 md:px-28 md:py-16 mb-10">
						<div className="flex justify-center max-w[850px]">
							<div className="max-w-[850px]  mt-0 md:mt-2">
								<p className="text-4xl text-start  font-Poppins md:text-5xl text-su_primary_bg font-semibold md:text-center mt-12 ">
									Key Development{" "}
									<span className="px-3 py-1 rounded-full bg-su_brand_week text-su_primary_bg inline-block">
										Roadmap
									</span>
								</p>
								<p className="text-su_primary_black mt-8 max-w-[700px]  font-Urbanist text-start md:text-center md:text-lg font-medium leading-relaxed ">
									Discover the exciting journey ahead with our comprehensive
									roadmap, tailored to elevate your experience.
								</p>
							</div>
						</div>
						<ScrollArea>
							<div className="mt-2 mb-2 w-full flex justify-center p-10 overflow-x-auto">

								<div className="w-full relative" >
									<img src={"/assets/svgs/Map-Updated2.svg"} alt="horse" className="p-4 w-full h-30 object-cover rounded-sm" />
								</div>
							</div>
							<div className="w-full relative" >
								<img src={"/assets/svgs/Banner.svg"} alt="horse" className="p-10 w-full h-30 object-cover rounded-sm" />
							</div>
							<ScrollBar orientation="horizontal" className="h-2" />
						</ScrollArea>
					</div>
				</div>
			</div>
			{/* <div
				className="h-[auto] bg-cover  w-full "
				style={{
					backgroundImage: "url('/assets/svgs/Background7.svg')",
				}}
			> */}
			<div
				className="h-[auto] bg-cover bg-center min-w-full"
				style={{
					backgroundImage: "url('/assets/landing-page/background7-testnew.png')",
				}}
			>
				{/* Section 7 */}
				{/* <div className="container mx-auto px-2 md:px-10 space-y-20">
					<div className="flex flex-col md:flex-row items-center md:justify-center">
						<div className="max-w-[auto] mt-12">
							<p className="text-su_primary text-4xl font-Poppins md:text-5xl font-semibold text-start md:text-center mt-12 ">
								Knowledge {" "}
								<span className="px-3 py-1 rounded-full bg-su_light_pink text-black inline-block ml-2">
									Hub
								</span>

							</p>
							<p className="text-su_primary_light mt-8 max-w-[650px] font-Urbanist text-start md:text-center  md:text-lg font-medium leading-relaxed ">
								Don't forget to explore our Educational Repository for insightful
								articles and resources
							</p>
						</div>


					</div>
					<ScrollArea>
						<div className="mt-4 mb-4 w-full flex justify-center overflow-x-auto">
							<div className="flex space-x-2 md:space-x-16">


								<div className={`w-auto md:w-[461px]`}>
									<div className="relative">
										<img
											className={`w-[300px] h-[300px] object-contain rounded-3xl md:object-cover md:w-full`}
											src="/assets/svgs/Knowlegehub.svg"
											alt="Card Image"
										/>

									</div>
									<p className={`w-[300px] text_bg-su_primary font-semibold font-Urbanist text-lg md:w-[401px] md:text-2xl mt-4`}>
										How to trade NFTs on Swapup
									</p>
									<p className={`w-[300px] mb-2 text_bg-su_primary font-Urbanist font-normal text-xs md:text-sm mt-1 md:w-[401px]`}>
										Trading NFTs is a nerve racking experience. You don't know if you are on the right site.
										You wonder if your trade will execute properly and even more important "is it safe.."
									</p>
									<p className={`w-[300px] mb-2 text_bg-su_primary font-Urbanist font-normal text-xs md:text-sm mt-1 md:w-[401px]`}>
										Read More
									</p>

								</div>

								<div className={`w-auto md:w-[461px]`}>
									<div className="relative">
										<img
											className={`w-[300px] h-[300px] object-contain rounded-3xl md:object-cover md:w-full`}
											src="/assets/svgs/Knowlegehub.svg"
											alt="Card Image"
										/>

									</div>
									<p className={`w-[300px] text_bg-su_primary font-semibold font-Urbanist text-lg md:w-[401px] md:text-2xl mt-4`}>
										How to trade NFTs on Swapup
									</p>
									<p className={`w-[300px] mb-2 text_bg-su_primary font-Urbanist font-normal text-xs md:text-sm mt-1 md:w-[401px]`}>
										Trading NFTs is a nerve racking experience. You don't know if you are on the right site.
										You wonder if your trade will execute properly and even more important "is it safe.."
									</p>
									<p className={`w-[300px] mb-2 text_bg-su_primary font-Urbanist font-normal text-xs md:text-sm mt-1 md:w-[401px]`}>
										Read More
									</p>
								</div>



							</div>
						</div>
						<ScrollBar orientation="horizontal" className="h-2" />
					</ScrollArea>



				</div> */}
				{/* </div> */}
			</div>

			{/* Section 8 */}
			<div
				className="h-[auto] bg-cover  w-full "
				style={{
					backgroundImage: "url('/assets/landing-page/background8-testnew.png')",
				}}
			>


				<div className=" container mx-auto px-2 space-y-20 flex items-center justify-between">
					<div className="mt-8 px-10  ">
						<p className="text-su_primary  text-4xl font-Poppins md:text-5xl font-semibold text-start md:text-left mt-12 ">
							Join Our {" "}
							<span className="px-3 py-1 rounded-full bg-su_tea_green text-black inline-block ml-2">
								Community
							</span>

						</p>
						<p className="text-su_primary_light mt-8 max-w-[650px] font-Urbanist text-start md:text-left  md:text-lg font-medium leading-relaxed ">
							For our community members, we look to have places they can rely on for help. hang out with other swappers,
							and get value out of our exclusive memberships.
						</p>
						<div className="flex justify-normal w-full mt-8 pb-8 overflow-x-auto md:justify-left">
							<div className="flex space-x-0 md:space-x-0">

								<Link to={"https://x.com/Swapupdapp"} target="_blank" ><span >
									<img src={'/assets/svgs/twiter.svg'} className="ml-0 md:ml-0  md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
								</span></Link>
								<Link to={"https://warpcast.com/swapupdapp"} target="_blank" ><span >
									<img src={'/assets/svgs/Warpcast.svg'} className="ml-0 md:ml-0 w-4 h-5 md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
								</span></Link>
								<Link to={"https://discord.gg/RCvDRY9dW3"} target="_blank" ><span >
									<img src={'/assets/svgs/Discord.svg'} className="ml-0 md:ml-0 w-4 h-5 md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
								</span></Link>
								<Link to={"https://medium.com/@swapup"} target="_blank" ><span >
									<img src={'/assets/svgs/Medium.svg'} className="ml-0 md:ml-0 w-4 h-5 md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
								</span></Link>

							</div>
						</div>
					</div>
					<div className="flex text-start  md:text-start w-1/2  mt-10">
						<img
							src="/assets/svgs/website-keywordicons.svg"
							alt="photoroom"
							className="object-contain mx-auto"
						/>
					</div>

				</div>

			</div>

			{/* Section 9 */}
			<div
				className="h-[auto] bg-cover  w-full "
				style={{
					backgroundImage: "url('/assets/landing-page/background9-testnew.png')",
				}}
			>


				<div className=" container mx-auto px-2  flex items-start justify-between  " id="faq">
					<div className="w-1/2 flex text-start md:text-start mt-10 align-text-top  ">
						<div className="w-full">
							<p className="text-su_primary  align-top text-4xl font-Poppins md:text-5xl font-semibold text-left md:text-left mt-12 ">
								<span className="px-3 py-1 rounded-full bg-su_buttermilk text-black inline-block ml-2 ">
									FAQ
								</span>

							</p>
							<p className="text-su_primary_light mt-8 max-w-[550px] font-Urbanist text-start md:text-left  md:text-lg font-medium leading-relaxed ">
								You all have questions, we have answers. Here are a few we hear our community ask often, but are by
								no means all the questions you have. Join our community and ask any questions left unanswered.
							</p>
						</div>
					</div>
					<div className="flex text-start  md:text-start w-1/2  mt-10">
						<div className="flex w-full flex-col font-Poppins h-auto text-start md:text-start space-x-0 lg:flex-row  ">
							<div className="text-start md:text-start w-full  ">
								<div className="w-full">
									<Accordion type="single" collapsible>
										<AccordionItem value="item-1">
											<p className="text-su_primary_lighter font-Poppins text-base leading-10 mt-2">
												01
											</p>
											<AccordionTrigger className="text-start md:text-start ">What is SwapUp?</AccordionTrigger>
											<AccordionContent className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
												SwapUp is a decentralized application that facilitates peer to peer transactions on multiple blockchains.
												We want to make transacting with anyone, anywhere, more accessible to the masses.
												Whether it be digital or physical, we want to be the go to application for these interactions.
											</AccordionContent>
										</AccordionItem>
									</Accordion>
									<Accordion type="single" collapsible>
										<AccordionItem value="item-1">
											<p className="text-su_primary_lighter font-Poppins text-base leading-10 mt-2">
												02
											</p>
											<AccordionTrigger className="text-start md:text-start ">Why build SwapUp?</AccordionTrigger>
											<AccordionContent className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
												Blockchain technology is fundamentally built to be a self serving,
												worldwide engaging solution anyone can use. With this more direct and open framework,
												there is a layer of anonymity users appreciate, but leads to more risks than needed.
												We strive to build an ecosystem using blockchain technology that propels indirect user interoperability forward,
												allowing any diverse set of people to interact safely and securely.
											</AccordionContent>
										</AccordionItem>
									</Accordion>
									<Accordion type="single" collapsible>
										<AccordionItem value="item-1">
											<p className="text-su_primary_lighter font-Poppins text-base leading-10 mt-2">
												03
											</p>
											<AccordionTrigger className="text-start md:text-start ">Who is the team building the application?</AccordionTrigger>
											<AccordionContent className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
												SwapUp is owned by solopreneur Terin Guerra who has been
												fortunate enough to connect with a few great developers over the
												past few years who contribute to the development of this project.
												The team is currently a mix of individuals from many parts of the world: USA, Dubai, Brazil, Ukraine. The team has a
												combined 40+years of experience launching large scale IT projects for large companies.
											</AccordionContent>
										</AccordionItem>
									</Accordion>
									<Accordion type="single" collapsible>
										<AccordionItem value="item-1">
											<p className="text-su_primary_lighter font-Poppins text-base leading-10 mt-2 ">
												04
											</p>
											<AccordionTrigger className="text-start md:text-start ">What use cases does SwapUp fulfill?</AccordionTrigger>
											<AccordionContent className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
												When you think SwapUp, you will think personal escrow
												<p className="h-2">{"   "}</p>
												<p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4  md:mt-2 mb-2" >
													• {"   "}  Trade any combination of Cryptocurrencies or NFTs
												</p>
												<p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4  md:mt-2 mb-2" >
													• {"   "}  Escrow earnest money to show interest for something you want
												</p>
												<p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4  md:mt-2 mb-2" >
													• {"   "}  Escrow payment for in-game assets.
												</p>
												<p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4  md:mt-2 mb-2" >
													•  {"   "} Want to bet your friend a pizza he couldn’t eat a whole ghost pepper? Put it on the blockchain so he can’t skip the tab.
												</p>
												<p className="text-su_primary_lighter font-Urbanist text-sm pb-0 md:pb-0  ml-4  md:mt-2 mb-2" >
													•{"   "}   Did someone agree to sell you 3 tires get 1 free, but pick up the free one next week. You like the deal, but don’t know how to keep them accountable. You can send them a swapup trade and make payment due on delivery of the tire.
												</p>

												<p className="h-6">{"   "}</p>
												And on, and on, and on. There are so many use cases, we are just getting started
											</AccordionContent>
										</AccordionItem>
									</Accordion>

									<Accordion type="single" collapsible>
										<AccordionItem value="item-1">
											<p className="text-su_primary_lighter font-Poppins text-base leading-10 mt-2">
												05
											</p>
											<AccordionTrigger className="text-start md:text-start ">Does SwapUp have a token?</AccordionTrigger>
											<AccordionContent className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
												Yes, we own the Rune SWAPUP•DAPP•TOKEN. Those who own this token are considered owners of the company. Each owner has the right to sell their tokens at any time, and rewards tied to ownership will transfer to the new owner.
												<p className="h-6">{"   "}</p>
												As our platform grows, we will look to expand our services and utility to our members. Whether that be a token or some other form of utility, that will be determined at another time, and communicated appropriately.
												<p className="h-6">{"   "}</p>
												Please be wary of any fake token launches claiming to be ours.
											</AccordionContent>
										</AccordionItem>
									</Accordion>
									<Accordion type="single" collapsible>
										<AccordionItem value="item-1">
											<p className="text-su_primary_lighter font-Poppins text-base leading-10 mt-2">
												06
											</p>
											<AccordionTrigger className="text-start md:text-start ">Where can I reach out with questions?</AccordionTrigger>
											<AccordionContent className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2 mb-10">
												Our main point of contact is our email, info@swapup.trade. You can also reach us on any of our connected social media accounts.e.

											</AccordionContent>
										</AccordionItem>
									</Accordion>

								</div>
							</div>

						</div>
					</div>
				</div>

			</div>

			{/* Section 10 */}
			<div
				className="h-[auto] bg-cover w-full "
				style={{
					backgroundImage: "url('/assets/landing-page/background10-testnew.png')",
				}}
			>


				<div className="container mx-auto   px-2 space-y-20 flex items-center justify-between">
					<div className="w-full mt-12 ">


						<div className="flex justify-normal w-full items-start mt-8 pb-8 overflow-x-auto  md:justify-center">
							<div className="flex space-x-0 md:space-x-0">
								<div className="w-full mt-12 ">
									<p className="w-full text-su_primary max-w-[550px] text-4xl font-Poppins md:text-5xl font-semibold text-center md:text-center md:justify-center mt-12 ">
										Join the 	{" "}
										<span className="px-3 py-1 rounded-full bg-su_brand_week text-black inline-block ml-2">
											Future
										</span>
										{" "} of Trading!
									</p>
									<p className=" w-full text-su_primary_light  mt-8 max-w-[650px] font-Urbanist items-center md:text-center md:text-lg font-medium leading-relaxed  md:justify-center ">
										Experience seamless transactions, unlock exclusive benefits, and dive into the world of Web3
									</p>
								</div>
							</div>
						</div>
						<div className="mt-8 mb-32 items-center md:justify-center   md:text-center md:text-lg ">
							<Button onClick={() => navigate(`${defaults.swapMarket.baseRoute}/${defaults.swapMarket.defaultActiveTab}`)} >Start Trading</Button>
						</div>

						<div className="flex justify-normal w-full mt-8 pb-8 overflow-x-auto  md:justify-center">
							<div className="flex space-x-0 md:space-x-0">

								<Link to={"https://x.com/Swapupdapp"} target="_blank" ><span >
									<img src={'/assets/svgs/twiter.svg'} className="ml-0 md:ml-0  md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
								</span></Link>
								<Link to={"https://warpcast.com/swapupdapp"} target="_blank" ><span >
									<img src={'/assets/svgs/Warpcast.svg'} className="ml-0 md:ml-0 w-4 h-5 md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
								</span></Link>
								<Link to={"https://discord.gg/RCvDRY9dW3"} target="_blank" ><span >
									<img src={'/assets/svgs/Discord.svg'} className="ml-0 md:ml-0 w-4 h-5 md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
								</span></Link>
								<Link to={"https://medium.com/@swapup"} target="_blank" ><span >
									<img src={'/assets/svgs/Medium.svg'} className="ml-0 md:ml-0 w-4 h-5 md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
								</span></Link>

							</div>
						</div>

						<div className="w-full flex items-center gap-3 lg:gap-6 mb-10  md:justify-center" >
							<Link to={'/'} className="font-semibold">Legal Terms</Link>
							<span className="font-semibold" onClick={() => navigate("/privacy-policy")} >Privacy Policy</span>
						</div>
						<div className="flex items-center gap-3 lg:gap-6 mb-10  md:justify-center" >
							<p className="text-su_secondary">Copyright © 2024 SwapUp, All Rights Reserved.</p>
						</div>

					</div>

				</div>

			</div>


		</div >
	);
};

export default SwapUpPage;
