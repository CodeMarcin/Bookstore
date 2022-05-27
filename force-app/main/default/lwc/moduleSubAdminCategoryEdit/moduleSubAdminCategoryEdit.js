import { LightningElement, track, wire } from "lwc";

import { CurrentPageReference } from "lightning/navigation";

import basePath from "@salesforce/community/basePath";

import getAllCategoryApex from "@salesforce/apex/AdminController.getAllCategory";
import getSingleCategoryApex from "@salesforce/apex/AdminController.getSingleCategory";
import editSingleCategoryApex from "@salesforce/apex/AdminController.editSingleCategory";

import adminCategoryEditLabel from "@salesforce/label/c.adminCategoryEditText";

import editIconResource from "@salesforce/resourceUrl/DetailsIcon";

import FIELD_CANNOT_BE_EMPTY_ERROR from "@salesforce/label/c.FIELD_CANNOT_BE_EMPTY_ERROR";

export default class ModuleSubAdminCategoryEdit extends LightningElement {
	adminCategoryEditText = adminCategoryEditLabel;

	globalCategoryId;

	singleCategoryEdit = false;

	allCategoryData;
	singleCategoryData;

	editIcon = editIconResource;

	inputsArray = [];
	inputsValue = {};
	@track inputsError = {};

	isAssignInputsValueError = false;

	successText;

	
	get allCategory() {
		return this.allCategoryData?.map((el) => ({
			categoryId: el.Id,
			categoryName: el.Name,
			categoryHref: basePath + "/admin-category-edit?categoryId=" + el.Id
		}));
	}

	get singleCategory() {
		return this.singleCategoryData?.map((el) => ({
			categoryName: el.Name
		}));
	}

	renderedCallback() {
		if (this.singleCategoryEdit) {
			if (!this.isAssignInputsValueError) {
				this.assignInputsValue();
				this.isAssignInputsValueError = true;
			}
		}
	}

	@wire(CurrentPageReference)
	getStateParameters(currentPageReference) {
		if (currentPageReference) {
			if (!currentPageReference.state.categoryId) {
				getAllCategoryApex()
					.then((result) => {
						this.allCategoryData = result;
						console.log(this.allCategoryData);
					})
					.catch((error) => {
						console.log(error);
					});
			} else if (currentPageReference.state.categoryId) {
				this.globalCategoryId = currentPageReference.state.categoryId;
				getSingleCategoryApex({ categoryId: this.globalCategoryId })
					.then((result) => {
						this.singleCategoryEdit = true;
						this.singleCategoryData = result;
		
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
	}


	assignInputsValue() {
		for (const [key, value] of Object.entries(this.singleCategory[0])) {
			this.inputsValue = { ...this.inputsValue, [key]: value };
			this.inputsError = { ...this.inputsError, [key]: "" };
		}

	}

	checkEditCategoryInputs(event, inputName = event.target.getAttribute("name"), inputValue = event.target.value) {
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

	submitEditCategory() {
		if (this.checkIfNoError()) {
			editSingleCategoryApex({ categryId: this.globalCategoryId, categoryName: this.inputsValue.categoryName })
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
					this.checkEditCategoryInputs("", keyEntries, value);
				}
				return false;
			}
		}
		return true;
	}
}
