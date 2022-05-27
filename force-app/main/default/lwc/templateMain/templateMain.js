import { LightningElement } from "lwc";
import { loadStyle } from "lightning/platformResourceLoader";
import styleOverrider from "@salesforce/resourceUrl/styleOverrider";

/**
 * @slot
 */

export default class TemplateMain extends LightningElement {

	connectedCallback() {
		loadStyle(this, styleOverrider);
		//you can add a .then().catch() if you'd like, as loadStyle() returns a promise
	}
}
