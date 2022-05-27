import { LightningElement, track } from "lwc";
import isGuest from "@salesforce/user/isGuest";

import registerNewUserApex from "@salesforce/apex/UserAuthController.registerNewUser";
import checkIsEmailExistApex from "@salesforce/apex/UserAuthController.checkIsEmailExist";

import basePath from "@salesforce/community/basePath";

import basicInfoLabel from "@salesforce/label/c.basicinfotext";
import addressInfoLabel from "@salesforce/label/c.addressinfotext";

import FIELD_CANNOT_BE_EMPTY_ERROR from "@salesforce/label/c.FIELD_CANNOT_BE_EMPTY_ERROR";
import MINIMUM_LENGTH_8_CHARACTERS_ERROR from "@salesforce/label/c.MINIMUM_LENGTH_8_CHARACTERS_ERROR";
import PASSWORD_AND_CONFIRM_PASSWORD_NOT_EQUAL_ERROR from "@salesforce/label/c.PASSWORD_AND_CONFIRM_PASSWORD_NOT_EQUAL_ERROR";
import EMAIL_FIELD_NOT_VALID_ERROR from "@salesforce/label/c.EMAIL_FIELD_NOT_VALID_ERROR";
import EMAIL_EXIST_ERROR from "@salesforce/label/c.EMAIL_EXIST_ERROR";
import PHONE_FIELD_VALID_ERROR from "@salesforce/label/c.PHONE_FIELD_VALID_ERROR";
import POSTAL_CODE_VALID_ERROR from "@salesforce/label/c.POSTAL_CODE_VALID_ERROR";

export default class ModuleSubRegisterUser extends LightningElement {
	grantAccess = isGuest ?? false;

	basicInfoText = basicInfoLabel;
	addressInfoText = addressInfoLabel;

	inputsArray = [];
	inputsValue = {};
	@track inputsError = {};

	isAssignInputsValueError = false;

	renderedCallback() {
		if (!this.isAssignInputsValueError) {
			this.assignInputsValue();
			this.isAssignInputsValueError = true;
		}
	}

	assignInputsValue() {
		const wrapper = this.template.querySelector(".registerUser__wrapper");
		const inputsText = wrapper.querySelectorAll("input[type='text']");
		const inputsPassword = wrapper.querySelectorAll("input[type='password']");
		this.inputsArray = [...inputsText, ...inputsPassword];
		this.inputsArray.forEach((element) => {
			const attributeName = element.getAttribute("name");
			this.inputsValue = { ...this.inputsValue, [attributeName]: "" };
			this.inputsError = { ...this.inputsError, [attributeName]: "" };
		});
	}

	checkRegisterInputs(event, inputName = event.target.getAttribute("name"), inputValue = event.target.value) {
		this.inputsValue = { ...this.inputsValue, [inputName]: inputValue };

		switch (inputName) {
			case "registerFirstName":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "registerLastName":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;
			case "registerPassword":
				if (this.inputsValue[inputName].length < 8) {
					this.addInputError(inputName, MINIMUM_LENGTH_8_CHARACTERS_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;
			case "registerConfirmPassword":
				if (this.inputsValue[inputName].length < 8) {
					this.addInputError(inputName, MINIMUM_LENGTH_8_CHARACTERS_ERROR);
				} else if (this.inputsValue.registerPassword !== this.inputsValue.registerConfirmPassword) {
					this.addInputError(inputName, PASSWORD_AND_CONFIRM_PASSWORD_NOT_EQUAL_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;

			case "registerPhone":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else if (!/^[0-9]*$/.test(this.inputsValue[inputName])) {
					this.addInputError(inputName, PHONE_FIELD_VALID_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;
			case "registerEmail":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.inputsValue[inputName])) {
					this.addInputError(inputName, EMAIL_FIELD_NOT_VALID_ERROR);
				} else {
					checkIsEmailExistApex({ email: this.inputsValue[inputName] })
						.then((result) => {
							if (result === true) {
								this.addInputError(inputName, EMAIL_EXIST_ERROR);
							} else {
								this.deleteInputError(inputName);
							}
						})
						.catch((error) => {
							console.log(error);
						});
				}

				break;
			case "registerState":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;
			case "registerCity":
				if (this.inputsValue[inputName].length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;
			case "registerPostalCode":
				if (inputValue.length < 1) {
					this.addInputError(inputName, FIELD_CANNOT_BE_EMPTY_ERROR);
				} else if (!/^[0-9]{2}-[0-9]{3}$/.test(inputValue)) {
					this.addInputError(inputName, POSTAL_CODE_VALID_ERROR);
				} else {
					this.deleteInputError(inputName);
				}
				break;
			case "registerStreet":
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
		if (inputName in this.inputsError) {
			delete this.inputsError[inputName];
		}
	}

	registerNewUser() {
		if (this.checkIfNoError()) {
			registerNewUserApex({ userData: this.inputsValue })
				.then((result) => {
					window.open(result, "_self");
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}

	checkIfNoError() {
		for (const key of Object.keys(this.inputsValue)) {
			if (key in this.inputsError) {
				for (const [keyEntries, value] of Object.entries(this.inputsValue)) {
					this.checkRegisterInputs("", keyEntries, value);
				}
				return false;
			}
		}
		return true;
	}
}
