public with sharing class DisplayBookController {
	public DisplayBookController() {
	}

	private static Integer rand(Integer count) {
		return Math.floor(Math.random() * count).intValue();
	}

	@AuraEnabled(cacheable=true)
	public static List<Category__c> getAllCategory() {
		try {
			return [
				SELECT Category__c.Name
				FROM Category__c
				WITH SECURITY_ENFORCED
				ORDER BY Category__c.Name ASC
			];
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled(cacheable=true)
	public static List<Book__c> getAllBooks(Integer limitValue, String categoryId) {
		
		// Database.query(query)

		if (categoryId == 'ALL') {
			return [
				SELECT
					Book__c.Id,
					Book__c.Author__c,
					Book__c.Category__c,
					Book__c.Discount_price__c,
					Book__c.Image__c,
					Book__c.Price__c,
					Book__c.Title__c,
					Author__r.Name,
					Category__r.Name
				FROM Book__c
				WITH SECURITY_ENFORCED
				ORDER BY Book__c.CreatedDate DESC
				LIMIT :limitValue
			];
		} else {
			return [
				SELECT
					Book__c.Id,
					Book__c.Author__c,
					Book__c.Category__c,
					Book__c.Discount_price__c,
					Book__c.Image__c,
					Book__c.Price__c,
					Book__c.Title__c,
					Author__r.Name,
					Category__r.Name
				FROM Book__c
				WHERE Book__c.Category__c = :categoryId
				WITH SECURITY_ENFORCED
				ORDER BY Book__c.CreatedDate DESC
				LIMIT :limitValue
			];
		}
	}

	@AuraEnabled(cacheable=true)
	public static Book__c getLastArrival() {
		return [
			SELECT Book__c.Id, Book__c.Title__c, Book__c.Image__c, Author__r.Name, Category__r.Name
			FROM Book__c
			WHERE Book__c.Amount__c > 0
			WITH SECURITY_ENFORCED
			ORDER BY Book__c.CreatedDate DESC
			LIMIT 1
		];
	}

	@AuraEnabled(cacheable=true)
	public static Book__c getRandomBestseller() {
		Integer count = [
			SELECT COUNT()
			FROM Book__c
			WHERE Book__c.Amount__c > 0 AND Book__c.Bestseller__c = TRUE
			WITH SECURITY_ENFORCED
		];

		Integer randValue = rand(count);

		return [
			SELECT Book__c.Id, Book__c.Title__c, Book__c.Image__c, Author__r.Name, Category__r.Name
			FROM Book__c
			WHERE Book__c.Amount__c > 0 AND Book__c.Bestseller__c = TRUE
			WITH SECURITY_ENFORCED
			ORDER BY CreatedDate DESC
			LIMIT 1
			OFFSET :randValue
		];
	}

	// @AuraEnabled(cacheable=true)
	// public static List<Book__c> getBestseller() {
	// 	return [
	// 		SELECT Id, Title__c, Author__c
	// 		FROM Book__c
	// 		WHERE Book__c.Amount__c > 0 AND Book__c.Bestseller__c = TRUE
	// 		WITH SECURITY_ENFORCED
	// 		ORDER BY Book__c.Title__c ASC
	// 		LIMIT 1
	// 	];
	// }

	@AuraEnabled(cacheable=true)
	public static List<Book__c> getDiscountBook(Integer limitValue) {
		return [
			SELECT Book__c.Id, Book__c.Title__c, Book__c.Image__c, Book__c.Price__c, Book__c.Discount_price__c
			FROM Book__c
			WHERE Book__c.Amount__c > 0 AND Book__c.Discount_price__c != NULL
			WITH SECURITY_ENFORCED
			ORDER BY Book__c.CreatedDate DESC
			LIMIT :limitValue
		];
	}

	@AuraEnabled(cacheable=true)
	public static Book__c getBookDetail(String bookId) {
		return [
			SELECT
				Book__c.Id,
				Book__c.Amount__c,
				Book__c.Author__c,
				Book__c.Description__c,
				Book__c.ISBN__c,
				Book__c.Image__c,
				Book__c.Price__c,
				Book__c.Discount_price__c,
				Book__c.Title__c,
				Author__r.Id,
				Author__r.Name
			FROM Book__c
			WHERE Book__c.Id = :bookId
			WITH SECURITY_ENFORCED
			LIMIT 1
		];
	}
}
