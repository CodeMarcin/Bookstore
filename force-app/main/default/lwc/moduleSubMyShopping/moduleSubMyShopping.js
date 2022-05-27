import { LightningElement, track } from "lwc";

import isGuest from "@salesforce/user/isGuest";
import userId from "@salesforce/user/Id";
import basePath from "@salesforce/community/basePath";

import getUserOrdersApex from "@salesforce/apex/BookController.getUserOrders";

import noItemsToDisplayLabel from "@salesforce/label/c.NoItemsToDisplayText";

import detailsIconResource from "@salesforce/resourceUrl/DetailsIcon"

export default class ModuleSubMyShopping extends LightningElement {
	grantAccess = isGuest ? false : true;

    noItemsToDisplayText = noItemsToDisplayLabel;

    detailsIcon = detailsIconResource;

	ordersStatusArray = [
		{ statusName: "All", active: true },
		{ statusName: "New", active: false },
		{ statusName: "In progress", active: false },
		{ statusName: "Completed", active: false },
		{ statusName: "Canceled", active: false }
	];

	@track ordersData;
    ordersDataExists;

    loadingNewData = false;

	get orders() {
		return this.ordersData?.map((el) => ({
			orderId: el.Id,
			orderNumber: el.Name,
			orderDateTime: this.recreateDate(el.Order_Date_Time__c),
			orderStatus: el.Status__c,
            orderStatusColor: "statusColor__" + this.createStatusColor(el.Status__c),
			orderTotalPrice: (el.Total_Order_Price__c * 1).toFixed(2),
			orderHref: basePath + "/order-detail?orderId=" + el.Id
		}));
	}

	connectedCallback() {
		getUserOrdersApex({ userId: userId, status: "All" })
			.then((result) => {
				this.ordersData = result;
                this.checkIfDataExists();
			})
			.catch((error) => {
				console.log(error);
			});
	}

	changeDisplayOrdersStatus(event) {
		const statusName = event.target.getAttribute("name");
        this.loadingNewData = true;
		getUserOrdersApex({ userId: userId, status: statusName })
			.then((result) => {
				this.ordersData = result;
				this.changeActiveMenuItem(statusName);
                this.checkIfDataExists();
                this.loadingNewData = false;
				console.log(JSON.parse(JSON.stringify(this.ordersData)), "AFTER UPDATE");
			})
			.catch((error) => {
				console.log(error);
			});
	}

	changeActiveMenuItem(statusName) {
		const currentActive = this.ordersStatusArray.findIndex((el) => el.active === true);
		this.ordersStatusArray[currentActive].active = false;
		const newActive = this.ordersStatusArray.findIndex((el) => el.statusName === statusName);
		this.ordersStatusArray[newActive].active = true;
	}

    checkIfDataExists() {
        if(this.ordersData.length > 0) {
            this.ordersDataExists = true;
        } else {
            this.ordersDataExists = false;
        }
    }

    recreateDate(dataToRecreate) {
        const dataToReturn = dataToRecreate.slice(0, 10).replaceAll('-', '/');
        const timeToReturn = dataToRecreate.slice(11, 16);
        return dataToReturn + " " + timeToReturn;
    }

    createStatusColor(statusName) {
        return statusName.replaceAll(" ", "_")
    }
}
