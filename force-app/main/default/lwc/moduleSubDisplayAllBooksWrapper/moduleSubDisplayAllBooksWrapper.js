import { LightningElement } from "lwc";

export default class ModuleSubDisplayAllBooksWrapper extends LightningElement {
	categoryIdFromDispatch;
	handleChangeCategory(event) {
		this.categoryIdFromDispatch = event.detail.categoryId;
	}
}
