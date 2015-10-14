var lastNotificationCount;
var counter = 0;
var registeredTab = "";
var queue = [];
var go = false;
var canPost = false;

var detectCanShow = function(callback) {
    chrome.storage.sync.get("showNotifications", function(data) {
		if (typeof data.showNotifications === "boolean") {
			go = data.showNotifications;
		} else {
			chrome.storage.sync.set({
                "showNotifications": true
            });

			go = true;
		}
	});

	return go;
};

var detectCanPost = function(callback) {
    chrome.storage.sync.get("canPost", function(data){
		if (typeof data.canPost === "boolean") {
			canPost = data.canPost;
		} else {
			chrome.storage.sync.set({
                "canPost": "check"
            });

			canPost = "check";
		}
	});

	return canPost;
};

var setCanPost = function(data) {
    chrome.storage.sync.set({
        "canPost": data
    });
};

setInterval(function() {
	detectCanShow();
	detectCanPost();
},1000);

chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
		if (sender.url.indexOf("https://www.khanacademy.org/") <= -1) {
			return;
		} else if (request.registering) {
			if (registeredTab === "") {
				registeredTab = request.registering;
			} else {
				queue.push(request.registering);
			}
			return;
		} else if (request.unregistering) {
			queue.splice(queue.indexOf(request.unregistering), 1);

			if (queue.length === 0) {
				registeredTab = "";
			} else {
				registeredTab = queue[0];
			}

			return;
		} else if (request.check) {
			if (request.check === "canPost") {
				sendResponse({
                    "canPost": canPost
                });

				return;
			}
		} else if (request.get) {
			if (request.get === "manifest") {
				sendResponse(chrome.runtime.getManifest());

				return;
			}
		} else if (request.set) {
			if (request.set === "canPost") {
				chrome.storage.sync.set({
                    "canPost": request.data
                });

				sendResponse({
                    "completed":true
                });

				return;
			}
		}
		if (request.tabid !== registeredTab) {
			console.log("DENIED.");

			return;
		}
		if (request.newNotificationCount && request.newNotificationCount != lastNotificationCount || request.isDifference === true) {
			console.log(request.newNotificationCount);

			lastNotificationCount = request.newNotificationCount;

			var TITLE = "New Notification";
			var MESSAGE = "You have ";

			if (request.newNotificationCount > 0) {
				if (request.newNotificationCount > 1) {
					TITLE += "s";
					MESSAGE += request.newNotificationCount + " new notifications!";
				} else {
					MESSAGE+= "a new notification!";
				}

				var notificationOptions = {
					type: "basic",
					title: TITLE,
					message: MESSAGE,
					iconUrl: "https://www.khanacademy.org/images/avatars/leaf-green.png"
				};

				counter++;

                var createNotification = function(data) {
                    if (data.showNotifications) {
						chrome.notifications.create("NewNotificationMultiTool" + counter.toString(), notificationOptions, function(nID) {
							setTimeout(function() {
								chrome.notifications.clear(nID);
							}, 3000);
						});
					} else {
						console.log("ERROR?");
					}
                };
				chrome.storage.sync.get({
                    "showNotifications":true
                }, function(data){
					createNotification(data);
				});
			}
		}
	}
);
console.log("WUT");

//UA-64943605-2
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-64943605-3']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
