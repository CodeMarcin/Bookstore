import checkUserAccesToSite from "@salesforce/apex/UserAccessController.checkUserAccesToSite";

// const adminProfileId = "00eIY000000e1fXYAQ";
const adminProfileId = "00eIY000000OeKjYAK";


export function checkIsUserAdmin() {
	return new Promise((resolve, reject) => {
		checkUserAccesToSite({ portalAdminProfileId: adminProfileId })
			.then((result) => {
				resolve(result);
			})
			.catch((error) => {
				reject(error);
			});
	});
}
