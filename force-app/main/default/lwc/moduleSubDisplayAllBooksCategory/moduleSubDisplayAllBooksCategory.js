import { LightningElement, wire } from "lwc";

import getAllCategory from "@salesforce/apex/DisplayBookController.getAllCategory";

import categoryLabel from "@salesforce/label/c.categorytext";

export default class ModuleSubDisplayAllBooksCategory extends LightningElement {
	categoryText = categoryLabel;
	categoryData;
	error;

	@wire(getAllCategory)
	wiredGetAllCategory({ error, data }) {
		if (data) {
			this.categoryData = data;
			this.error = undefined;
			console.log(data, "categorty");
		} else if (error) {
			this.categoryData = undefined;
			this.error = error;
			console.log(error);
		}
	}

	get categoryItems() {
		return this.categoryData?.map((el) => ({
			id: el.Id,
			name: el.Name,
			dispatchEventChangeCategory: () => {
				this.dispatchEvent(new CustomEvent("changecategory", { detail: { categoryId: el.Id } }));
			}
		}));
	}

	dispatchEventChangeCategoryForAll() {
		this.dispatchEvent(new CustomEvent("changecategory", { detail: { categoryId: 'ALL' } }));
	}
}
