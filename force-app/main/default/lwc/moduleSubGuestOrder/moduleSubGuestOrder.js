import { LightningElement } from "lwc";
import checkGuestOrderApex from "@salesforce/apex/BookController.checkGuestOrder";

import basePath from "@salesforce/community/basePath";
export default class ModuleSubGuestOrder extends LightningElement {
	orderIdInput;
	orderPINInput;

	loadingData;
	showErrorMsg;

	handleInputs(event) {
		const inputName = event.target.getAttribute("name");
		switch (inputName) {
			case "orderId":
				this.orderIdInput = event.target.value;
				break;

			case "orderPIN":
				this.orderPINInput = event.target.value;
				break;

			default:
				break;
		}
	}

	checkIsOrderExsist() {
		this.showErrorMsg = false;
		this.loadingData = true;
		checkGuestOrderApex({ orderId: this.orderIdInput, orderPIN: this.orderPINInput })
			.then((result) => {
				this.loadingData = false;
				if (result === true) {
					window.open(
						basePath + "/order-detail?orderId=" + this.orderIdInput + "&guestPIN=" + this.orderPINInput,
						"_self"
					);
				} else {
					this.showErrorMsg = true;
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}
}
