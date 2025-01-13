import { Environment } from "@/config";
import { SUI_CreateTweetOnBehalfOfUserReqParams } from "@/types/third-party.types";

interface SUI_TwitterPostContent extends Pick<SUI_CreateTweetOnBehalfOfUserReqParams, 'appLink' | 'hashtags' | 'mentions' | 'postTitle' | 'postDescription'> {
  imageTitle: string;
}

export const twitterPostContent: SUI_TwitterPostContent = {
  imageTitle: "I am trading",
  appLink: "https://www.swapup.io/",
  postTitle: "Check out my recent swap",
  hashtags: ["SWAPUP"],
  mentions: ["Swapupdapp"],
  postDescription: 'Here is some description',
};

export const warpcastFrameUrl = `${Environment.WARPCAST_FRAME_BASE_URL}/swaps/`;