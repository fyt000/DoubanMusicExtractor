chrome.runtime.onMessage.addListener(function(request,sender,response){
	if (request.method=="getSource"){
		message.innerHTML=generateHTML(getSongJSON(request.data));
	}
});

function generateHTML(json){
	var html=[];
	html.push("Right click and save link as... to download");
	html.push("<ul>");
	//html.push("<li>"+json.length+"</li>");
	for (var i=0;i<json.length;i++){
		html.push('<li><a href="'+json[i].rawUrl+'">'+json[i].name+'</li>');
	}
	html.push("</ul>");
	html=html.join("");
	return html;
}

function getSongJSON(source){
	var patternS=/song_records = \[{(.)*\]/g;
	var matches=patternS.exec(source);
	var json=[];
	
	//find all matches
	while(matches!=null){
		var jsonStr=matches[0];
		patternN=/\[{(.)*}\]/; //take out the array part
		var matched=patternN.exec(jsonStr);
		var data=JSON.parse(matched[0]); //parse into array
		json=json.concat(data);
		matches=patternS.exec(source);	//goto next matching
	}
	return json;
}

document.addEventListener("DOMContentLoaded", function(event) {
	var message = document.querySelector('#message');
	chrome.tabs.executeScript(
		null, 
		{code: "chrome.runtime.sendMessage({method: 'getSource',data: document.documentElement.innerHTML});"}, 
		function(){
			if (chrome.runtime.lastError) {
				message.innerText='Error fetching source:\n' + chrome.runtime.lastError.message;
			}
		}
	);
});