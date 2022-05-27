import { LightningElement, track, wire } from "lwc";

import basePath from "@salesforce/community/basePath";

import getUsersOrdersApex from "@salesforce/apex/AdminController.getUsersOrders";
import changeOrderStatusApex from "@salesforce/apex/AdminController.changeOrderStatus";

import noItemsToDisplayLabel from "@salesforce/label/c.NoItemsToDisplayText";

import detailsIconResource from "@salesforce/resourceUrl/DetailsIcon";

export default class ModuleSubAdminOrdersAll extends LightningElement {
	noItemsToDisplayText = noItemsToDisplayLabel;

	detailsIcon = detailsIconResource;
	@track ordersData;
	ordersDataExists;

	loadingNewData = false;

	ordersStatusArray = [
		{ statusName: "All", active: true },
		{ statusName: "New", active: false },
		{ statusName: "In progress", active: false },
		{ statusName: "Completed", active: false },
		{ statusName: "Canceled", active: false }
	];

	statusPicklist = [
		{ value: "New", active: false },
		{ value: "In progress", active: false },
		{ value: "Completed", active: false },
		{ value: "Canceled", active: false }
	];

	get orders() {
		return this.ordersData?.map((el) => ({
			orderId: el.Id,
			orderNumber: el.Name,
			orderDateTime: this.recreateDate(el.Order_Date_Time__c),
			orderStatus: el.Status__c,
			orderStatusPicklist: this.createPickList(el.Status__c),
			orderStatusColor: "statusColor__" + this.createStatusColor(el.Status__c),
			orderTotalPrice: (el.Total_Order_Price__c * 1).toFixed(2),
			orderHref: basePath + "/order-detail?orderId=" + el.Id,
			orderChange: (event) => {
				this.loadingNewData = true;
				changeOrderStatusApex({ orderId: el.Id, newStatus: event.target.value }).then(() => {
					getUsersOrdersApex({ orderStatus: "All" })
						.then((result) => {
							this.ordersData = result;
							this.changeActiveMenuItem("All");
							this.checkIfDataExists();
							this.loadingNewData = false;
						})
						.catch((error) => {
							console.log(error);
						});
				});
			}
		}));
	}

	createPickList(orderStatus) {
		const tmpPickList = [];
		let tmpObj;
		this.statusPicklist.forEach((el) => {
			if (el.value === orderStatus) {
				tmpObj = { value: el.value, active: true };
			} else {
				tmpObj = { value: el.value, active: false };
			}
			tmpPickList.push(tmpObj);
		});

		return tmpPickList.map((el) => ({
			value: el.value,
			active: el.active
		}));
	}

	connectedCallback() {
		getUsersOrdersApex({ orderStatus: "All" })
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
		getUsersOrdersApex({ orderStatus: statusName })
			.then((result) => {
				this.ordersData = result;
				this.changeActiveMenuItem(statusName);
				this.checkIfDataExists();
				this.loadingNewData = false;
			})
			.catch((error) => {
				console.log(error);
			});
	}

	checkIfDataExists() {
		if (this.ordersData.length > 0) {
			this.ordersDataExists = true;
		} else {
			this.ordersDataExists = false;
		}
		console.log(this.propertyOrFunctions, "obsasj info");
	}

	changeActiveMenuItem(statusName) {
		const currentActive = this.ordersStatusArray.findIndex((el) => el.active === true);
		this.ordersStatusArray[currentActive].active = false;
		const newActive = this.ordersStatusArray.findIndex((el) => el.statusName === statusName);
		this.ordersStatusArray[newActive].active = true;
	}

	recreateDate(dataToRecreate) {
		const dataToReturn = dataToRecreate.slice(0, 10).replaceAll("-", "/");
		const timeToReturn = dataToRecreate.slice(11, 16);
		return dataToReturn + " " + timeToReturn;
	}

	createStatusColor(statusName) {
		return statusName.replaceAll(" ", "_");
	}
}
