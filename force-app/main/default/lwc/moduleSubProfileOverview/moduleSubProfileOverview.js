/* eslint-disable @lwc/lwc/no-inner-html */
import { LightningElement, track } from "lwc";

import isGuest from "@salesforce/user/isGuest";
import Id from "@salesforce/user/Id";

import getProfileOverviewApex from "@salesforce/apex/UserInfoController.getProfileOverview";
import updateBasicProfileInfoApex from "@salesforce/apex/UserInfoController.updateBasicProfileInfo";
import updateAddresProfileInfo from "@salesforce/apex/UserInfoController.updateAddresProfileInfo";

import basicInfoLabel from "@salesforce/label/c.basicinfotext";
import firstNameLabel from "@salesforce/label/c.firstnametext";
import lastNameLabel from "@salesforce/label/c.lastnametext";
import emailLabel from "@salesforce/label/c.emailtext";
import phoneLabel from "@salesforce/label/c.phonetext";
import addressInfoLabel from "@salesforce/label/c.addressinfotext";
import streetLabel from "@salesforce/label/c.streettext";
import cityLabel from "@salesforce/label/c.citytext";
import postalCodeLabel from "@salesforce/label/c.postalcodetext";
import stateLabel from "@salesforce/label/c.statetext";

import FIELD_CANNOT_BE_EMPTY_ERROR from "@salesforce/label/c.FIELD_CANNOT_BE_EMPTY_ERROR";
import EMAIL_FIELD_NOT_VALID_ERROR from "@salesforce/label/c.EMAIL_FIELD_NOT_VALID_ERROR";
import PHONE_FIELD_VALID_ERROR from "@salesforce/label/c.PHONE_FIELD_VALID_ERROR";
import POSTAL_CODE_VALID_ERROR from "@salesforce/label/c.POSTAL_CODE_VALID_ERROR";

import editIconStaticResource from "@salesforce/resourceUrl/editicon";
import saveIconStaticResource from "@salesforce/resourceUrl/saveicon";

export default class ModuleSubProfileOverview extends LightningElement {
	grantAccess = isGuest ? false : true;
	loggedUserId;

	@track userData;

	editIcon = editIconStaticResource;
	saveIcon = saveIconStaticResource;

	basicInfoText = basicInfoLabel;
	firstNameText = firstNameLabel;
	lastNameText = lastNameLabel;

	emailText = emailLabel;
	phoneText = phoneLabel;
	addressInfoText = addressInfoLabel;
	streetText = streetLabel;
	cityText = cityLabel;
	postalCodeText = postalCodeLabel;
	stateText = stateLabel;

	editBasicInfo = false;
	editAddressInfo = false;

	inputsValue = {};
	inputsError = {};

	get userInfo() {
		return this.userData?.map((el) => ({
			id: el.Id,
			firstName: el.FirstName,
			lastName: el.LastName,
			email: el.Email,
			phone: el.Phone,
			street: "street",
			city: "city",
			postalCode: "postCodal",
			state: "state",
			// street: el.Contact.MailingStreet,
			// city: el.Contact.MailingCity,
			// postalCode: el.Contact.MailingPostalCode,
			// state: el.Contact.MailingState
		}));
	}

	connectedCallback() {
		if (this.grantAccess) {
			this.loggedUserId = Id;
			this.getProfileOverview();
		}
	}

	getProfileOverview() {
		getProfileOverviewApex({ userId: this.loggedUserId })
			.then((result) => {
				this.userData = result;
				this.assignInputValueError();
			})
			.catch((error) => {
				console.log(error);
			});
	}

	assignInputValueError() {
		for (const [key, value] of Object.entries(this.userInfo[0])) {
			const upperKey = "user" + key.charAt(0).toUpperCase() + key.slice(1);
			this.inputsValue = { ...this.inputsValue, [upperKey]: value };
			this.inputsError = { ...this.inputsError, [upperKey]: "" };
		}
	}

	toogleEditBasicInfo() {
		if (this.editBasicInfo) {
			this.assignInputValueError();
		}
		this.editBasicInfo = !this.editBasicInfo;
	}

	toogleEditAddressInfo() {
		if (this.editAddressInfo) {
			this.assignInputValueError();
		}
		this.editAddressInfo = !this.editAddressInfo;
	}

	checkEditInputs(event) {
		const inputName = event.target.getAttribute("name");
		const inputValue = event.target.value;

		this.inputsValue = { ...this.inputsValue, [inputName]: inputValue };

		switch (inputName) {
			case "userFirstName":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "userLastName":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "userEmail":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.inputsValue[inputName])) {
					this.addInputError(inputName, EMAIL_FIELD_NOT_VALID_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "userPhone":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else if (!/^[0-9]*$/.test(this.inputsValue[inputName])) {
					this.addInputError(inputName, PHONE_FIELD_VALID_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;
			case "userStreet":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "userCity":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "userPostalCode":
				if (inputValue.length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else if (!/^[0-9]{2}-[0-9]{3}$/.test(inputValue)) {
					this.addInputError(inputName, POSTAL_CODE_VALID_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "userState":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			default:
				break;
		}
	}

	addInputError(inputName, textError) {
		this.inputsError = { ...this.inputsError, [inputName]: textError };
	}

	deleteInputError(inputName) {
		this.inputsError = { ...this.inputsError, [inputName]: "" };
	}

	updateBasicInfo() {
		const basicInputs = ["userFirstName", "userLastName", "userEmail", "userPhone"];
		if (this.checkIfNoErrors(basicInputs)) {
			const dataToUpdate = this.assignDataToUpdate(basicInputs);
			updateBasicProfileInfoApex({ basicInfo: dataToUpdate, userId: this.loggedUserId })
				.then(() => {
					this.getProfileOverview();
					this.editBasicInfo = false;
				})
				.catch((error) => {
					console.log(error, "ERRO");
				});
		}
	}

	updateAddresInfo() {
		const basicInputs = ["userStreet", "userCity", "userPostalCode", "userState"];
		if (this.checkIfNoErrors(basicInputs)) {
			const dataToUpdate = this.assignDataToUpdate(basicInputs);
			updateAddresProfileInfo({ addressInfo: dataToUpdate, userId: this.loggedUserId })
				.then(() => {
					this.getProfileOverview();
					this.editAddressInfo = false;
				})
				.catch((error) => {
					console.log(error, "ERRO");
				});
		}
	}

	checkIfNoErrors(inputsArray) {
		for (const el of inputsArray) {
			if (this.inputsError[el].length > 0) {
				return false;
			}
		}
		return true;
	}

	assignDataToUpdate(inputsArray) {
		let dataToUpdate = {};

		for (const el of inputsArray) {
			for (const inputsValueKey in this.inputsValue) {
				if (inputsValueKey === el)
					dataToUpdate = { ...dataToUpdate, [inputsValueKey]: this.inputsValue[inputsValueKey] };
			}
		}

		return dataToUpdate;
	}
}
