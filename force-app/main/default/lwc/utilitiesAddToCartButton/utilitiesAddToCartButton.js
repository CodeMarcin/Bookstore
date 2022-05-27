import { LightningElement } from 'lwc';

import addToCartLabel from "@salesforce/label/c.addtocarttext";

export default class UtilitiesAddToCartButton extends LightningElement {
    addToCartText = addToCartLabel;
}