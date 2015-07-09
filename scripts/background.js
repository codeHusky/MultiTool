var lastNotificationCount;
var counter = 0;
var registeredTab = "";
var queue = [];
chrome.runtime.onMessageExternal.addListener(
	function(request, sender, sendResponse){
		if(sender.url.indexOf("https://www.khanacademy.org/") <= -1){
			return;
		}
		if(request.registering){
			if(registeredTab == ""){
				registeredTab = request.registering;
			}else{
				queue.push(request.registering);
			}
			return;
		}else if(request.unregistering){
			queue.splice(queue.indexOf(request.unregistering),1);
			if(queue.length == 0){
				registeredTab = "";
			}else{
				registeredTab = queue[0];
			}
			return;
		}
		if(request.tabid != registeredTab){
			console.log("DENIED.")
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
		}
	}
);
console.log("WUT")