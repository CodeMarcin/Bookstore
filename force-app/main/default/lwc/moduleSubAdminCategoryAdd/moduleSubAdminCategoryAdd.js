import { LightningElement, track } from "lwc";

import basePath from "@salesforce/community/basePath";

import addCategoryApex from "@salesforce/apex/AdminController.addCategory";

import adminCategoryAddLabel from "@salesforce/label/c.adminCategoryAddText";

import FIELD_CANNOT_BE_EMPTY_ERROR from "@salesforce/label/c.FIELD_CANNOT_BE_EMPTY_ERROR";

export default class ModuleSubAdminCategoryAdd extends LightningElement {
	adminCategoryAddText = adminCategoryAddLabel;

	inputsArray = [];
	inputsValue = {};
	@track inputsError = {};

	isAssignInputsValueError = false;

	successText;

	renderedCallback() {
		if (!this.isAssignInputsValueError) {
			this.assignInputsValue();
			this.isAssignInputsValueError = true;
		}
	}

	assignInputsValue() {
		const wrapper = this.template.querySelector(".adminAddCategoryWrapper");
		const inputsText = wrapper.querySelectorAll("input[type='text']");
		this.inputsArray = [...inputsText];
		this.inputsArray.forEach((element) => {
			const attributeName = element.getAttribute("name");
			this.inputsValue = { ...this.inputsValue, [attributeName]: "" };
			this.inputsError = { ...this.inputsError, [attributeName]: "" };
		});
	}

	checkAddCategoryInputs(event, inputName = event.target.getAttribute("name"), inputValue = event.target.value) {
		this.inputsValue = { ...this.inputsValue, [inputName]: inputValue };

		switch (inputName) {
			case "categoryName":
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

	submitAddCategory() {
		if (this.checkIfNoError()) {
			addCategoryApex({ categoryName: this.inputsValue.categoryName })
				.then(() => {
					window.open(basePath + "/admin-category-edit", "_self");
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
					this.checkAddCategoryInputs("", keyEntries, value);
				}
				return false;
			}
		}
		return true;
	}
}
