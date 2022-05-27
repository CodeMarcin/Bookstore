import { LightningElement, api } from "lwc";

export default class ModuleSubShoppingCartItem extends LightningElement {
	@api item;

	dispatchEventFunction(event) {
		const selectedEvent = new CustomEvent("handleclickevent", { detail: event.target.dataset.label });
		this.dispatchEvent(selectedEvent);
	}
}
