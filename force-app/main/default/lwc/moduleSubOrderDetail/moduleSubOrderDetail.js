import { LightningElement, wire } from "lwc";

import { CurrentPageReference } from "lightning/navigation";
import { checkIsUserAdmin } from "c/utilitiesCheckUserAccessToSite";

import globalUserId from "@salesforce/user/Id";
import basePath from "@salesforce/community/basePath";

import getUserOrderDetailsApex from "@salesforce/apex/BookController.getUserOrderDetails";
import getGuestOrderDetailsApex from "@salesforce/apex/BookController.getGuestOrderDetails";

import clockWhiteIconResource from "@salesforce/resourceUrl/ClockWhiteIcon";
import calendarWhiteIconResource from "@salesforce/resourceUrl/CalendarWhiteIcon";

import titleLabel from "@salesforce/label/c.titletext";
import priceLabel from "@salesforce/label/c.pricetext";
import quantityLabel from "@salesforce/label/c.quantitytext";
import totalPriceLabel from "@salesforce/label/c.totalpricetext";

import firstNameLabel from "@salesforce/label/c.FirstNameText";
import lastNameLabel from "@salesforce/label/c.LastNameText";
import emailLabel from "@salesforce/label/c.EmailText";
import phoneLabel from "@salesforce/label/c.PhoneText";
import streetLabel from "@salesforce/label/c.StreetText";
import postalCodeLabel from "@salesforce/label/c.PostalCodeText";
import cityLabel from "@salesforce/label/c.CityText";
import stateLabel from "@salesforce/label/c.StateText";

export default class ModuleSubOrderDetail extends LightningElement {
	globalOrderId;
	grantAccessToOrder;

	isAdmin;

	clockWhiteIcon = clockWhiteIconResource;
	calendarWhiteIcon = calendarWhiteIconResource;

	titleText = titleLabel;
	priceText = priceLabel;
	quantityText = quantityLabel;
	totalPriceText = totalPriceLabel;

	firstNameText = firstNameLabel;
	lastNameText = lastNameLabel;
	emailText = emailLabel;
	phoneText = phoneLabel;
	streetText = streetLabel;
	postalCodeText = postalCodeLabel;
	cityText = cityLabel;
	stateText = stateLabel;

	orderData;

	get orderInfo() {
		return this.orderData?.map((el) => ({
			orderId: el.Id,
			orderName: el.Name,
			orderStatus: el.Status__c,
			orderStatusColor: "statusColor__" + this.createStatusColor(el.Status__c),
			orderCustomerFirstName: el.Customer_First_Name__c,
			orderCustomerLastName: el.Customer_Last_Name__c,
			orderCustomerEmail: el.Customer_Email__c,
			orderCustomerPhone: el.Customer_Phone__c,
			orderCustomerCity: el.Customer_City__c,
			orderCustomerStreet: el.Customer_Street__c,
			orderCustomerPostalCode: el.Customer_Postal_Code__c,
			orderCustomerState: el.Customer_State__c,
			orderDate: this.createDate(el.Order_Date_Time__c),
			orderTime: this.createTime(el.Order_Date_Time__c),
			orderTotalPrice: (el.Total_Order_Price__c * 1).toFixed(2),
			orderItemsArray: el.Books_Orders_Items__r?.map((elItemsArray) => ({
				bookId: elItemsArray.Book__c,
				bookPrice: elItemsArray.Price__c,
				bookItemsTotalPrice: (elItemsArray.Total_Price__c * 1).toFixed(2),
				bookQuantity: elItemsArray.Quantity__c,
				bookTitle: elItemsArray.Book__r.Title__c,
				bookImage: elItemsArray.Book__r.Image__c,
				bookHref: basePath + "/book-detail?Id=" + elItemsArray.Book__c
			}))
		}));
	}
	connectedCallback() {}

	@wire(CurrentPageReference)
	getStateParameters(currentPageReference) {
		if (currentPageReference) {
			checkIsUserAdmin()
				.then((result) => {
					this.isAdmin = result;
				})
				.then(() => {
					this.globalOrderId = currentPageReference.state.orderId;
					this.globalGuestPIN = currentPageReference.state.guestPIN;
					if (this.globalOrderId && !this.globalGuestPIN) {
						getUserOrderDetailsApex({ orderId: this.globalOrderId })
							.then((result) => {
								if (this.isAdmin) {
									this.grantAccessToOrder = true;
									this.orderData = result;
								} else {
									const ownerId = result[0].Customer__c;
									this.grantAccessToOrder = this.checkIsOwner(ownerId);
									if (this.grantAccessToOrder) {
										this.orderData = result;
									}
								}
							})
							.catch((error) => {
								console.log(error);
							});
					} else if (this.globalOrderId && this.globalGuestPIN) {
						getGuestOrderDetailsApex({ orderId: this.globalOrderId, guestPIN: this.globalGuestPIN })
							.then((result) => {
								if (result.length > 0) {
									this.grantAccessToOrder = true;
									this.orderData = result;
								}
								console.log(this.isAdmin);
							})
							.catch((error) => {
								console.log(error);
							});
					}
				})
				.catch((error) => console.log(error));
		}
	}

	checkIsOwner(userId) {
		return globalUserId !== userId ? false : true;
	}

	createStatusColor(statusName) {
		return statusName.replaceAll(" ", "_");
	}

	createTime(dataToRecreate) {
		return dataToRecreate.slice(11, 16);
	}

	createDate(dataToRecreate) {
		return dataToRecreate.slice(0, 10).replaceAll("-", "/");
	}
}
