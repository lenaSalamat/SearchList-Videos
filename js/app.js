$(function() {
	var searchField = $ ('#query');
	var icon = $ ('#search-btn');


	$(searchField).on('focus', function() {
       $(this).animate({
       	width: '55%'
       },400);
       $(icon).animate({
       	right: '10px'
       },400);
	});

    $(searchField).on('blur', function(){
    	if(searchField.val() == '') {
    		$(searchField).animate({
    			width: '45%'
    		},400,function(){});
    		$(icon).animate({
    			right: '360px'
    		},400,function(){});
    	}
    });	
    $('#search-form').submit(function(e){
    	e.preventDefault();
    });
})

//the search function ;
function search(){
	$('#results').html('');
	$('#buttons').html('');
    q = $('#query').val();

//the http req to the youtube to get the videos data;
   $.get(
     "https://www.googleapis.com/youtube/v3/search",{
     	part: "snippet ,id",
        // type: "video",
        q: q,
     	key: 'AIzaSyD-4TKS8Rn7-o2SRA13RsELbf6NPEqR13Y'
     },
     function(data) {
     	var nextPageToken = data.nextPageToken;
     	var prevPageToken = data.prevPageToken;
     	console.log("lolo",data);
//to loop through and to display the video list;
     	$.each(data.items, function(i, item){
     		var output = getOutput(item);
     		$('#results').append(output);
     	});
        //to desplay the buttons
     	var buttons = getButtons(prevPageToken, nextPageToken);
     	$('#buttons').append(buttons);
     }
   );
}
//to go to the next page;
function nextPage() {
	var token = $('#next-button').data('token');
	var q = $('#next-button').data('query');

	$('#results').html('');
	$('#buttons').html('');
    q = $('#query').val();

//the http req to the youtube to get the videos data;
   $.get(
     "https://www.googleapis.com/youtube/v3/search",{
     	part: "snippet ,id",
        type: "video",
        q: q,
        pageToken: token,
     	key: 'AIzaSyD-4TKS8Rn7-o2SRA13RsELbf6NPEqR13Y'
     },
     function(data) {
     	var nextPageToken = data.nextPageToken;
     	var prevPageToken = data.prevPageToken;
     	console.log("lolo",data);
         //to loop through and to display the video list;
     	$.each(data.items, function(i, item){
     		var output = getOutput(item);
     		$('#results').append(output);
     	});
         //to desplay the buttons
     	var buttons = getButtons(prevPageToken, nextPageToken);
     	$('#buttons').append(buttons);
     }
   );
}

// to go to the prev page;
function prevPage() {
	var token = $('#prev-button').data('token');
	var q = $('#prev-button').data('query');

	$('#results').html('');
	$('#buttons').html('');
   
    q = $('#query').val();

   $.get(
     "https://www.googleapis.com/youtube/v3/search",{
     	part: "snippet ,id",
        type: "video",
        q: q,
        pageToken: token,
     	key: 'AIzaSyD-4TKS8Rn7-o2SRA13RsELbf6NPEqR13Y'
     },
     function(data) {
     	var nextPageToken = data.nextPageToken;
     	var prevPageToken = data.prevPageToken;
     	console.log("lolo",data);

     	$.each(data.items, function(i, item){
     		var output = getOutput(item);
     		$('#results').append(output);
     	});

     	var buttons = getButtons(prevPageToken, nextPageToken);
     	$('#buttons').append(buttons);
     }
   );
}

//to get the result on the screen;
function getOutput(item) {
	var videoId = item.id.videoId;
	var title = item.snippet.title;
	var description = item.snippet.description;
	var thumb = item.snippet.thumbnails.high.url;
	var channelTitle = item.snippet.channelTitle;
	var videoData = item.snippet.publishedAt;

	var output = '<li>' +
	'<div class="list-left">'+
    '<img src="'+thumb+'">'+
	'</div>'+
	'<div class="list-right">'+
    //to go to the video for specific url;
	'<h3><a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/'+videoId+'">'+title+'</a></h3>'+
	'<small>By <span class="cTitle">'+channelTitle+'</span> On '+videoData+'</small>'+
	'<p>'+description+'</p>'+'</div>'+'</li>'+'';

	return output;
}

//to get the buttons to work;
function getButtons(prevPageToken,nextPageToken) {
	if(!prevPageToken) {
		var btnoutput = '<div class="button-container">'+
		'<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
		'onclick="nextPage();">Next Page</button></div>';
	} else {
		var btnoutput = '<div class="button-container">'+
		'<button id="prev-button" class="paging-button" data-token="'+prevPageToken+'" data-query="'+q+'"' +
		'onclick="prevPage();">Prev Page</button>'+
		'<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
		'onclick="nextPage();">Next Page</button></div>';
	}
	return btnoutput;
}