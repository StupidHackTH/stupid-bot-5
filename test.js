var Airtable = require('airtable')
var base = new Airtable({ apiKey: 'keyV6RKmuFQZo4e0s' }).base(
	'appcdTNn9wG70x4Lj'
)

base('Team')
	.select({
		view: 'Grid view',
	})
	.eachPage(
		function page(records, fetchNextPage) {
			// This function (`page`) will get called for each page of records.

			records.forEach(function (record) {
				console.log(record)
			})

			// To fetch the next page of records, call `fetchNextPage`.
			// If there are more records, `page` will get called again.
			// If there are no more records, `done` will get called.
			fetchNextPage()
		},
		function done(err) {
			if (err) {
				console.error(err)
				return
			}
		}
	)
