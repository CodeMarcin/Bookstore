import { LightningElement, api } from "lwc";

/**
 * @slot
 */

export default class UtilitiesModalFullSite extends LightningElement {
	@api modalData;

	dispatchCloseModal() {
		this.dispatchEvent(new CustomEvent("closemodalevent"));
	}
}
