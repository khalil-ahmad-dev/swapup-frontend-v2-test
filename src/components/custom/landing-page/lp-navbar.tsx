import { DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, Drawer, } from "@/components/ui/drawer";
import { getIsActiveNav, } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { landingPageNavData } from "@/constants/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const LpNavbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const { pathname, hash } = useLocation();

	const navigate = useNavigate();

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<div className={`sticky top-0 z-10 w-full p-4 flex justify-between items-center lg:justify-start lg:gap-16 ${isScrolled ? 'bg-black/10' : 'bg-transparent'}`}>
			<img
				onClick={() => navigate("/swap-up/swap-market")}
				src="/assets/logos/swapup-logo-white.svg"
				alt="SwapUp"
				className="h-6 lg:h-7	 cursor-pointer"
			/>

			{/* Desktop LpNavbar */}
			<div className="w-full hidden lg:flex items-center justify-between">
				<ol className="flex gap-4 items-center">
					{landingPageNavData.map((navItem, index) => {
						let navigationLinkItem;

						if (navItem.key.includes("services")) {
							navigationLinkItem = (navItem.key === "services") ?
								<DropdownMenu>
									<DropdownMenuTrigger className={`nav-link flex items-center gap-2 font-semibold text-sm ${getIsActiveNav(navItem.path + navItem.hash, pathname + hash, 'swapup') ? "active" : ""}`}>
										Services

										<svg className="w-3" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M10 2L6 6L2 2" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
										</svg>
									</DropdownMenuTrigger>

									<DropdownMenuContent className="dark:bg-su_least_bg rounded-md min-w-full px-2 py-4 mt-1 flex flex-col gap-2 z-50">

										<Link to={navItem.path + "#nft"} key={navItem.key + "#nft" + index}>
											<p className="min-w-32 text-sm font-semibold flex items-center gap-4 cursor-pointer hover:bg-su_enable_bg py-2 px-4 rounded-md">
												NFTs
											</p>
										</Link>

										<Link to={navItem.path + "#crypto"} key={navItem.key + "#crypto" + index}>
											<p className="min-w-32 text-sm font-semibold flex items-center gap-4 cursor-pointer hover:bg-su_enable_bg py-2 px-4 rounded-md">
												Crypto
											</p>
										</Link>

									</DropdownMenuContent>
								</DropdownMenu>
								: "";

						} else {
							navigationLinkItem = <Link to={navItem.path + navItem.hash} key={navItem.key}>
								<li
									className={`nav-link font-semibold text-sm ${getIsActiveNav(navItem.path + navItem.hash, pathname + hash, 'website') ? "active" : ""}`}
								>
									{navItem.title}
								</li>
							</Link>;
						}

						return (navigationLinkItem);
					})}
				</ol>

				<div className="flex items-center gap-4">
					<Button onClick={() => navigate("/swap-up/swap-market")} >Start Trading</Button>
				</div>
			</div>

			{/* Mobile LpNavbar */}
			<div className="lg:hidden flex items-center gap-7" >
				<svg className="lg:hidden w-4" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M7 16C7.53043 16 8.03914 15.7893 8.41421 15.4142C8.78929 15.0392 9 14.5305 9 14.0001H5C5 14.5305 5.21071 15.0392 5.58579 15.4142C5.96086 15.7893 6.46957 16 7 16ZM7.995 1.09981C8.00896 0.960776 7.99362 0.820356 7.94997 0.687611C7.90632 0.554865 7.83533 0.432741 7.74158 0.329115C7.64783 0.225489 7.5334 0.142662 7.40567 0.0859748C7.27794 0.0292879 7.13975 0 7 0C6.86026 0 6.72206 0.0292879 6.59433 0.0859748C6.4666 0.142662 6.35217 0.225489 6.25842 0.329115C6.16467 0.432741 6.09368 0.554865 6.05003 0.687611C6.00638 0.820356 5.99104 0.960776 6.005 1.09981C4.87455 1.32935 3.85823 1.94268 3.12831 2.83585C2.39839 3.72902 1.99977 4.84708 2 6.00055C2 7.09849 1.5 12.0002 0 13.0002H14C12.5 12.0002 12 7.09849 12 6.00055C12 3.58068 10.28 1.56079 7.995 1.09981Z" fill="white" />
				</svg>

				<Drawer open={isOpen} direction="left" onClose={() => setIsOpen(false)}>
					<DrawerTrigger
						onClick={() => setIsOpen(true)}
					>
						<div className="relative w-10 h-10 rounded-full flex justify-center items-center bg-gradient-primary" >
							<span className="absolute w-9 h-9 rounded-full flex justify-center items-center bg-su_primary_bg" >
								<svg className="w-3" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M0 6.00015V4.33349H12V6.00015H0ZM0.000162601 1.66682V0.000152588H12.0002V1.66682H0.000162601Z" fill="white" />
								</svg>
							</span>
						</div>

					</DrawerTrigger>

					<DrawerContent
						className="h-screen w-9/12 lg:w-1/3 left-0 bg-transparent"
					>
						<DrawerClose
							className="bg-transparent fixed top-0 right-[-30%] h-screen w-[25vw]"
							onClose={() => setIsOpen(false)}
						></DrawerClose>

						<div className="rounded-sm h-full w-full bg-su_secondary_bg flex flex-col gap-6 py-4 px-6" >
							<DrawerTitle className="flex justify-between" >
								<img src="/assets/logos/swapup-logo-white.svg" alt="SwapUp" className="h-5" />

								<DrawerClose onClick={() => setIsOpen(false)}>
									<svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
										<path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
									</svg>
								</DrawerClose>
							</DrawerTitle>

							<div className="h-full flex flex-col justify-between" >

								<ol className="flex flex-col gap-4" >
									{landingPageNavData.map((navItem, index) => {
										let navigationLinkItem;

										if (navItem.key.includes("services")) {
											navigationLinkItem = (navItem.key === "services") ?
												<DropdownMenu>
													<DropdownMenuTrigger className={`nav-link flex items-center gap-2 font-semibold text-sm ${getIsActiveNav(navItem.path + navItem.hash, pathname + hash, 'swapup') ? "active" : ""}`}>
														Services

														<svg className="w-3" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M10 2L6 6L2 2" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
														</svg>
													</DropdownMenuTrigger>

													<DropdownMenuContent className="dark:bg-su_least_bg rounded-md min-w-full px-2 py-4 mt-1 flex flex-col gap-2 z-50">

														<Link to={navItem.path + "#nft"} key={navItem.key + "#nft" + index}>
															<p className="min-w-32 text-sm font-semibold flex items-center gap-4 cursor-pointer hover:bg-su_enable_bg py-2 px-4 rounded-md">
																NFTs
															</p>
														</Link>

														<Link to={navItem.path + "#crypto"} key={navItem.key + "#crypto" + index}>
															<p className="min-w-32 text-sm font-semibold flex items-center gap-4 cursor-pointer hover:bg-su_enable_bg py-2 px-4 rounded-md">
																Crypto
															</p>
														</Link>

													</DropdownMenuContent>
												</DropdownMenu>
												: "";

										} else {
											navigationLinkItem = <Link to={navItem.path + navItem.hash} key={navItem.key}>
												<li
													className={`nav-link font-semibold text-sm ${getIsActiveNav(navItem.path + navItem.hash, pathname + hash, 'website') ? "active" : ""}`}
												>
													{navItem.title}
												</li>
											</Link>;
										}

										return (navigationLinkItem);
									})}
								</ol>


								<div className="flex items-center justify-between" >
									<svg className="w-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0ZM8.8 13.6H7.2V12H8.8V13.6ZM10.456 7.4L9.736 8.136C9.16 8.72 8.8 9.2 8.8 10.4H7.2V10C7.2 9.12 7.56 8.32 8.136 7.736L9.128 6.728C9.424 6.44 9.6 6.04 9.6 5.6C9.6 4.72 8.88 4 8 4C7.12 4 6.4 4.72 6.4 5.6H4.8C4.8 3.832 6.232 2.4 8 2.4C9.768 2.4 11.2 3.832 11.2 5.6C11.2 6.304 10.912 6.944 10.456 7.4Z" fill="white" />
									</svg>

									<Button onClick={() => navigate("/swap-up/swap-market")} >Start Trading</Button>
								</div>
							</div>
						</div>
					</DrawerContent>
				</Drawer >
			</div>
		</div>
	);
};

export default LpNavbar;
