import { LightningElement } from "lwc";
import facebookIcon from "@salesforce/resourceUrl/FacebookIcon";
import twitterIcon from "@salesforce/resourceUrl/TwitterIcon";
import instagramIcon from "@salesforce/resourceUrl/InstagramIcon";

export default class ModuleSubSocialMedia extends LightningElement {
	socialMedia = [
		{ label: "Facebook", icon: facebookIcon, url: "Some Url" },
		{ label: "Twitter", icon: twitterIcon, url: "Some Url" },
		{ label: "Instagram", icon: instagramIcon, url: "Some Url" }
	];
}
