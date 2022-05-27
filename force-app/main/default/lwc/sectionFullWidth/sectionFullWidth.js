import { LightningElement, api } from "lwc";

/**
 * @slot
 */

export default class SectionFullWidth extends LightningElement {
	@api bgColor = "#fff";

	renderedCallback() {
		const wrapper = this.template.querySelector(".sectionFullWidthWrapper");
		wrapper.style.backgroundColor = this.bgColor;
	}
}
