var lastNotificationCount;
var counter = 0;
chrome.runtime.onMessageExternal.addListener(
	function(request, sender, sendResponse){
		if(sender.url.indexOf("https://www.khanacademy.org/") <= -1){
			return;
		}
		if(request.newNotificationCount&&request.newNotificationCount != lastNotificationCount||request.isDifference == true){
			console.log(request.newNotificationCount)
			lastNotificationCount = request.newNotificationCount;
			var TITLE = "New Notification";
			var MESSAGE = "You have ";
			if(request.newNotificationCount > 0){
				if(request.newNotificationCount > 1){
					TITLE+="s";
					MESSAGE+= request.newNotificationCount + " new notifications!";
				}else{
					MESSAGE+= "a new notification!";
				}
				var notificationOptions = {
					type:"basic",
					title:TITLE,
					message:MESSAGE,
					iconUrl:"https://www.khanacademy.org/images/avatars/leaf-green.png"
				};
				counter++;
				chrome.notifications.create("NewNotificationMultiTool" + counter.toString(), notificationOptions, function(nID) {
					setTimeout(function(){
						chrome.notifications.clear(nID);
					},3000);
				})
			}
		}else{
			console.log()
		}
	}
);
console.log("WUT")