// Initialize Parse
Parse.initialize("kbdfN6OIoBIzwzuR7ir8Ke9J5hF79C5lDhbMHH8n", "saRvD5ZMtMWl8tBFMA1Cc9s0J7RZcaTZEyaczHrA");

// Creating new sub-class
var Review = Parse.Object.extend('Review')
var sushirrito = new Review();

var totalStar = 0;
var count = 0;
var average = 0;

// Funtion initiated via submit, and creates objects
var submission = function () {

	var starCount = parseInt($('#userRating').raty('score'));

	sushirrito.set('title', $('#title').val());
	sushirrito.set('userOpinion', $('#userOpinion').val());
	sushirrito.set('userRating', starCount);
	sushirrito.set('numberOfLikes', 0)
	sushirrito.set('totalLikes', 0)

	$('#title').val('')
	$('#userOpinion').val('')
	$('#userRating').raty({ score: 0 })

	sushirrito.save()
}

// Funtion to get data from Parse
var getData = function() {
	var query = new Parse.Query(Review);

	query.notEqualTo('userRating', 0)
	query.notEqualTo('title', '')
	query.notEqualTo('userOpinion', '')

	query.find({
		success:function(results) {
			buildReview(results)
		}
	})
}

// Funtion to initiate the build of the reviews
var buildReview = function(data) {
	$('eachReview').empty()

	data.forEach(function(d) {
		addItem(d);
	})

	average = totalStar /= count;
	$('#averageRating').raty({ readOnly: true, halfShow: false, score: average })
}

// Function that is responsible for the building of each compnent of the review
var addItem = function(item) {
	count++;
	var givenStar = item.get('userRating')
	var givenTitle = item.get('title')
	totalStar += givenStar;

	var div = $('<div class="addedReview"></div>')
	var rating = $(document.createElement('span')).raty({ readOnly: true, score: givenStar })
	var title = $('<p class="titleLine">' + givenTitle + '</p>')
	var description = $('<p>' + item.get('userOpinion') + '</p>')
	var thumbsUp = $('<i class="fa fa-thumbs-o-up"></i>')
	var thumbsDown = $('<i class="fa fa-thumbs-o-down"></i>')
	var button = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>')
	var foundHelpful = $(document.createElement('p')).text(item.get('numberOfLikes') + ' out of ' + item.get('totalLikes') + ' found this review helpful.' )

	thumbsUp.click(function() {
		item.increment('numberOfLikes')
		item.increment('totalLikes')
		item.save()
	})

	thumbsDown.click(function() {
		item.increment('totalLikes')
		item.save()
	})

	button.click(function() {
		item.destroy( {
		})
	})

	rating.appendTo(div)
	div.append(title)
	div.append(thumbsDown)
	div.append(thumbsUp)
	div.append(description)
	description.append(foundHelpful)
	div.append(button)
	$('.eachReview').append(div)
}

// Calling functions when page is loaded
window.onload = function() {
	$('#userRating').raty();
	$('form').submit(function() {
		submission();
		return false
	})
	getData();
}
