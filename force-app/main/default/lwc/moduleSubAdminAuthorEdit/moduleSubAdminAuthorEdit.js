import { LightningElement, track, wire } from "lwc";

import { CurrentPageReference } from "lightning/navigation";

import basePath from "@salesforce/community/basePath";

import getAllAuthorsApex from "@salesforce/apex/AdminController.getAllAuthors";
import getSingleAuthorApex from "@salesforce/apex/AdminController.getSingleAuthor";
import editSingleAuthorApex from "@salesforce/apex/AdminController.editSingleAuthor";

import adminAuthorEditLabel from "@salesforce/label/c.adminAuthorEditText";

import editIconResource from "@salesforce/resourceUrl/DetailsIcon";

import FIELD_CANNOT_BE_EMPTY_ERROR from "@salesforce/label/c.FIELD_CANNOT_BE_EMPTY_ERROR";

export default class ModuleSubAdminAuthorEdit extends LightningElement {
	adminAuthorEditText = adminAuthorEditLabel;

	globalAuthorId;

	singleAuthorEdit = false;

	allAuthorsData;
	singleAuthorData;

	editIcon = editIconResource;

	inputsArray = [];
	inputsValue = {};
	@track inputsError = {};

	isAssignInputsValueError = false;

	successText;

	get allAuthors() {
		return this.allAuthorsData?.map((el) => ({
			authorId: el.Id,
			authorFullName: el.Name,
			authorHref: basePath + "/admin-author-edit?bookId=" + el.Id
		}));
	}

	get singleAuthor() {
		return this.singleAuthorData?.map((el) => ({
			authorFullName: el.Name
		}));
	}

	renderedCallback() {
		if (this.singleAuthorEdit) {
			if (!this.isAssignInputsValueError) {
				this.assignInputsValue();
				this.isAssignInputsValueError = true;
			}
		}
	}

	@wire(CurrentPageReference)
	getStateParameters(currentPageReference) {
		if (currentPageReference) {
			if (!currentPageReference.state.bookId) {
				getAllAuthorsApex()
					.then((result) => {
						this.allAuthorsData = result;
						console.log(this.allAuthorsData);
					})
					.catch((error) => {
						console.log(error);
					});
			} else if (currentPageReference.state.bookId) {
				this.globalAuthorId = currentPageReference.state.bookId;
				getSingleAuthorApex({ authorId: this.globalAuthorId })
					.then((result) => {
						this.singleAuthorEdit = true;
						this.singleAuthorData = result;

					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
	}

	assignInputsValue() {
		for (const [key, value] of Object.entries(this.singleAuthor[0])) {
			this.inputsValue = { ...this.inputsValue, [key]: value };
			this.inputsError = { ...this.inputsError, [key]: "" };
		}
	}

	checkEditAuthorInputs(event, inputName = event.target.getAttribute("name"), inputValue = event.target.value) {
		this.inputsValue = { ...this.inputsValue, [inputName]: inputValue };

		switch (inputName) {
			case "authorFullName":
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

	submitEditAuthor() {
		if (this.checkIfNoError()) {
			editSingleAuthorApex({ authorId: this.globalAuthorId, authorName: this.inputsValue.authorFullName })
				.then(() => {
					window.open(basePath + "/admin-author-edit", "_self");
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
					this.checkEditAuthorInputs("", keyEntries, value);
				}
				return false;
			}
		}
		return true;
	}
}
