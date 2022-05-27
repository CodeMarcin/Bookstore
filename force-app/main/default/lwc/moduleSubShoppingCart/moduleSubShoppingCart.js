import { LightningElement, track } from "lwc";

import isGuest from "@salesforce/user/isGuest";
import basePath from "@salesforce/community/basePath";
import { checkIsUserAdmin } from "c/utilitiesCheckUserAccessToSite";

import lockIcon from "@salesforce/resourceUrl/LockIcon";
import userIcon from "@salesforce/resourceUrl/UserIcon";
import shoppingCartIcon from "@salesforce/resourceUrl/ShoppingCartIcon";
import adminIcon from "@salesforce/resourceUrl/AdminIcon";

import loginRegister from "@salesforce/label/c.login_register";
import userProfile from "@salesforce/label/c.user_profile";
import shoppingCart from "@salesforce/label/c.shopping_cart";
import adminPanel from "@salesforce/label/c.admin_panel";

export default class ModuleSubShoppingCart extends LightningElement {
	showLoginRegisterModal = false;
	showUserProfilePanel = false;
	
	isAdmin;

	@track shoppingCartIcons = [
		{
			label: shoppingCart,
			icon: shoppingCartIcon,
			link: true,
			href: basePath + '/shopping-cart'
		}
	];

	connectedCallback() {

		checkIsUserAdmin()
			.then((result) => {
				this.isAdmin = result;
				this.setIcons();
			})
			.catch((error) => (this.isAdmin = error));
	}

	setIcons() {
		const userGuestIcon = isGuest
			? { label: loginRegister, icon: lockIcon, link: false, href: null }
			: { label: userProfile, icon: userIcon, link: false, href: null};
		this.shoppingCartIcons.push(userGuestIcon);

		if (this.isAdmin) this.shoppingCartIcons.push({ label: adminPanel, icon: adminIcon, link: true, href: basePath + '/admin-summary' });
	}

	handleClickEvent(event) {
		console.log(event.detail," event datail")
		switch (event.detail) {
	
			case loginRegister:
				this.showLoginRegisterModal = true;
				break;

			case userProfile:
				this.showAdminMenuPanel = false;
				this.showUserProfilePanel = !this.showUserProfilePanel;
				break;

			default:
				break;
		}
	}

	handleCloseModal() {
		this.showLoginRegisterModal = false;
	}

	handleCloseUserProfilePanel() {
		this.showUserProfilePanel = false;
	}

}
