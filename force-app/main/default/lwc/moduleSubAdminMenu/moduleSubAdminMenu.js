import { LightningElement } from "lwc";

import basePath from "@salesforce/community/basePath";

import adminBasicLabel from "@salesforce/label/c.adminBasicText";
import adminSummaryLabel from "@salesforce/label/c.adminSummaryText";

import adminAuthorsLabel from "@salesforce/label/c.adminAuthorsText";
import adminAuthorAddLabel from "@salesforce/label/c.adminAuthorAddText";
import adminAuthorEditLabel from "@salesforce/label/c.adminAuthorEditText";

import adminCategoriesLabel from "@salesforce/label/c.adminCategoriesText";
import adminCategoryAddLabel from "@salesforce/label/c.adminCategoryAddText";
import adminCategoryEditLabel from "@salesforce/label/c.adminCategoryEditText";

import adminBooksLabel from "@salesforce/label/c.adminBooksText";
import adminBookAddLabel from "@salesforce/label/c.adminBookAddText";
import adminBookEditLabel from "@salesforce/label/c.adminBookEditText";

import adminOrdersLabel from "@salesforce/label/c.adminOrdersText"
import adminOrdersAllLabel from "@salesforce/label/c.adminOrdersAllText"

export default class ModuleSubAdminMenu extends LightningElement {
	adminBasicText = adminBasicLabel;
	adminSummaryText = adminSummaryLabel;

	adminAuthorsText = adminAuthorsLabel;
	adminAuthorAddText = adminAuthorAddLabel;
	adminAuthorEditText = adminAuthorEditLabel;

	adminCategoriesText = adminCategoriesLabel;
	adminCategoryAddText = adminCategoryAddLabel;
	adminCategoryEditText = adminCategoryEditLabel;

	adminBooksText = adminBooksLabel;
	adminBookAddText = adminBookAddLabel;
	adminBookEditText = adminBookEditLabel;

	adminOrdersText = adminOrdersLabel;
	adminOrdersAllText = adminOrdersAllLabel

	adminMenuItems = [
		{ label: this.adminBasicText, link: false },
		{ label: this.adminSummaryText, link: true, href: basePath + "/admin-summary" },

		{ label: this.adminAuthorsText, link: false },
		{ label: this.adminAuthorAddText, link: true, href: basePath + "/admin-author-add" },
		{ label: this.adminAuthorEditText, link: true, href: basePath + "/admin-author-edit" },

		{ label: this.adminCategoriesText, link: false },
		{ label: this.adminCategoryAddText, link: true, href: basePath + "/admin-category-add" },
		{ label: this.adminCategoryEditText, link: true, href: basePath + "/admin-category-edit" },

		{ label: this.adminBooksText, link: false },
		{ label: this.adminBookAddText, link: true, href: basePath + "/admin-book-add" },
		{ label: this.adminBookEditText, link: true, href: basePath + "/admin-book-edit" },

		{ label: this.adminOrdersText, link: false },
		{ label: this.adminOrdersAllText, link: true, href: basePath + "/admin-orders-all" }
	];
}
