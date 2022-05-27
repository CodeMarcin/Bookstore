public with sharing class URLController {
	public URLController() {
	}

	@AuraEnabled(cacheable=true)
	public static String getBaseURL() {
		Site mySite = [SELECT Id FROM Site WHERE Name = 'iBookstore'];
		String siteBaseURL = [SELECT SecureURL FROM SiteDetail WHERE DurableId = :mySite.Id].SecureURL;

		return siteBaseURL;
	}

	@AuraEnabled(cacheable=true)
	public static String getSecureBaseURL() {
		Site mySite = [SELECT Id FROM Site WHERE Name = 'iBookstore1'];
		String siteBaseURL = [SELECT SecureURL FROM SiteDetail WHERE DurableId = :mySite.Id].SecureURL;

		return siteBaseURL;
	}
}
