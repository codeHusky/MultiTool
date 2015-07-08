// request permission!
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function newNotifications(notificationCount) {
  if (Notification.permission !== "granted"){
    Notification.requestPermission();
  }else {
  	var notificationTitle = "New Notification";
  	var notificationBody = "You have";
  	if(notificationCount == "?"){
  		notificationTitle = "Some new notifications";
  		notificationBody = "We know your notification count changed, but we're not sure if you checked them in a seperate tab or something."
  	}if(parseFloat(notificationCount) > 1){
  		notificationTitle += "s";
  		notificationBody += " " + notificationCount + " new notifications!";
  	}else{
  		notificationBody += " a new notification!";
  	}
    var notification = new Notification(notificationTitle, {
      icon: 'https://www.khanacademy.org/images/avatars/leaf-green.png',
      body: notificationBody,
    });

    setTimeout(function() {
    	notification.close();
    },3000);
  }
}
if(KA.userProfileData_.countBrandNewNotifications > 0){
	newNotifications(KA.userProfileData_.countBrandNewNotifications);
}
var setUpdateAlert = false;
var userNotified = false;
setInterval(function() {
	$.getJSON("https://www.khanacademy.org/api/internal/user/profile?username=" + KA.userProfileData_.username, function(data){
		if(data.countBrandNewNotifications != KA.userProfileData_.countBrandNewNotifications){
			var difference = data.countBrandNewNotifications - KA.userProfileData_.countBrandNewNotifications;
			if(difference <= 0){
				//newNotifications("?");
				$(".notification-bubble").hide().html("0")
				$(".icon-bell-alt").removeClass("brand-new");
			}else{
				newNotifications(difference);
				$(".notification-bubble").show().html(data.countBrandNewNotifications)
				$(".icon-bell-alt").addClass("brand-new");
			}
			if(!setUpdateAlert){
				$(".user-notifications-toggle").click(function(){
          if(!userNotified){
					  alert("In order to receive the new notifications in this box, please reload unless you have not opened your notifications during this page session. I am currently working on a work-around for this.\n-Lokio27");
				    userNotified = true;
          }
        })
			}
			KA.userProfileData_.countBrandNewNotifications = data.countBrandNewNotifications;
			
		}
	})
},2000);