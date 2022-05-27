import { LightningElement, api } from 'lwc';
import shopNow from "@salesforce/label/c.ShopNow";

export default class UtilitiesBigBookPanel extends LightningElement {
    @api key;
    @api image;
    @api label;
    @api author;
    @api title;
    @api category;
    @api hrefurl;

    shopNowLabel = shopNow;
}