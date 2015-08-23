// request permission!
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}
var tabid = Math.round(Math.random()*875835873*Math.random());
console.log(tabid);
chrome.runtime.sendMessage("melabjdobbjfobmgaagkmgbnhplncdie",{"registering":tabid},function(data){
  console.log(data);
});
function newNotifications(notificationCount,dd) {
  /*if (Notification.permission !== "granted"){
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
  }*/
  chrome.runtime.sendMessage("melabjdobbjfobmgaagkmgbnhplncdie",{"newNotificationCount":notificationCount,"isDifference":dd,"tabid":tabid});
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
				//
        if(difference == 0||data.countBrandNewNotifications == 0){
          $(".notification-bubble").hide()
          $(".icon-bell-alt").removeClass("brand-new");
          newNotifications(difference,true);
        }else{
          newNotifications(data.countBrandNewNotifications,false);
          $(".notification-bubble").show().html(data.countBrandNewNotifications)
          $(".icon-bell-alt").addClass("brand-new");
        }
			}else{
				newNotifications(difference,true);
				$(".notification-bubble").show().html(data.countBrandNewNotifications)
				$(".icon-bell-alt").addClass("brand-new");
			}
      if(KA.userProfileData_.countBrandNewNotifications == 0&& data.countBrandNewNotifications != 0){
        document.title = "(" + data.countBrandNewNotifications + ") " + document.title;
      }else if(data.countBrandNewNotifications == 0){
        document.title = document.title.replace("(" + KA.userProfileData_.countBrandNewNotifications + ") ","")
      }else{
        document.title = document.title.replace("(" + KA.userProfileData_.countBrandNewNotifications + ") ","(" + data.countBrandNewNotifications + ") ")
      }
			KA.userProfileData_.countBrandNewNotifications = data.countBrandNewNotifications;
			
		}
	})
},2000);
window.onbeforeunload = function() {
  chrome.runtime.sendMessage("melabjdobbjfobmgaagkmgbnhplncdie",{"unregistering":tabid})
};
chrome.runtime.sendMessage("melabjdobbjfobmgaagkmgbnhplncdie",{"check":"canPost"},function(data){
  if(data.canPost){
    chrome.runtime.sendMessage("melabjdobbjfobmgaagkmgbnhplncdie",{"get":"manifest"},function(data){
      postEcho(data);
    });
  }
});
//
var version = "?";
var postedCollectThisVersion = false;
var postedCollectAlready = false;
var oldCollectID = "";
var diagnostic = "kaencrypted_1cd734cb406d06c5628fbf0e74de05c9_f441c6abd9a8428f57e4f37b9827e2f9af97751c2543a9e1e9d1664511cf2a1ff58863015ee04deec48a9721cdfa87d367a586ce56c0898d63b6497530d5096f29904248f27912277c0b39e2fed1fdcd7e710079947a4b16a176f5b8cedeaaa874b9125c24ab0f8df9413b498e170edbd508c7edb1ecfba8ff4e22b965325e051dc306d38b6aa81c9eff4c870ff695f6500a059135076f2607ff6ccc6eafd5f1";
var collect = "kaencrypted_5f49ace4321b488bd135abede750f713_36a7d3a5c58a7cce1e014d756794546389d09831930d896298da207185d93f320dd477f2301c5055e3f07b3888edf0ebfdb7523229bab6b6417584abc4ecbc2196795af175d0209d8c420d965bc46dd149f12e6f70a8d7c1c14695f1e6a47432fad11545ec815bcc7ca2937a89f1c08649119d782d6e8a5c7db3fb682df65b24b743ae23296f8f509e9978a3ef4da58eaa9f11f78acd8e2030e0871ae0c95740";
function postEcho(manifest) {
  version = manifest.version_name;
  $.getJSON("https://www.khanacademy.org/api/internal/discussions/" + collect + "/replies?casing=camel",function(rData) {
    for(var i = 0; i < rData.length; i++){
      if(rData[i].content.indexOf(KA.userProfileData_.username) == 0){
        postedCollectAlready = true;
        if(rData[i].content.indexOf(version) > -1){
          postedCollectThisVersion = true;
        }else{
          oldCollectID = rData[i].key;
        }
      }
    }
    if(postedCollectAlready && postedCollectThisVersion){
      return;
    }else if(postedCollectAlready && !postedCollectThisVersion){
      $.ajax({
        type:"DELETE",
        url:"https://www.khanacademy.org/api/internal/feedback/" + oldCollectID + "?casing=camel"
      })
    }
    $.ajax({
      type: 'POST',
      dataType: 'json',
      headers: {
          'Accept': ' application/json, text/javascript, *\/*; q=0.01',
          'Accept-Language': ' en-US,en;q=0.5',
          'Accept-Encoding': ' gzip, deflate',
          'Content-Type': ' application/json; charset=UTF-8',
          'X-KA-FKey': ' 1.0_0WVFcnbssrIRSw==_1418002092',
          'X-Requested-With': ' XMLHttpRequest',
          'Referer': 'https://www.khanacademy.org/computer-programming/new/pjs',
          'Content-Length': ' 1140',
          'Cookie': ' __utma=3422703.336972004.1403884371.1403902070.1403904116.3; __utmz=3422703.1403884371.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=3422703.|1=User%20Type=Logged%20In=1^2=User%20Points=136166=1; sailthru_hid=4b8f7adeb499caa26d47f80e585eec61526568688910a60103d70cf99ea395de16bf1a50e79f51405223d892; _ga=GA1.2.336972004.1403884371; sailthru_hid=4b8f7adeb499caa26d47f80e585eec61526568688910a60103d70cf9cea67b599e12b49945cb914b5b33c9f4; __qca=P0-449990055-1409427600374; mp_5f375bcfa7dc57184da63393e2af841c_mixpanel=%7B%22distinct_id%22%3A%20%22_gae_bingo_random%3A6-2qpzzhLcEtDidvTMgraAic7NRRZUq2CUo1dTnm%22%2C%22mp_name_tag%22%3A%20%22MarioMuddMook%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.khanacademy.org%2Fprofile%2F_kag5zfmtoYW4tYWNhZGVteXJPCxIIVXNlckRhdGEiQXVzZXJfaWRfa2V5X2h0dHA6Ly9nb29nbGVpZC5raGFuYWNhZGVteS5vcmcvMTE3NTgwMjI3MDI5NDQ3MDI4MDE0DA%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.khanacademy.org%22%2C%22%24search_engine%22%3A%20%22google%22%7D; ki_t=1414630478786%3B1418078964708%3B1418088378667%3B27%3B1737; ki_r=; ki_s=129611%3A0.0.0.0.0%3B131503%3A0.0.0.0.0%3B131508%3A0.0.0.0.0%3B132319%3A0.0.0.0.0; return_visits_null=1416961078.08733; ki_u=5d8258f4-9ebe-9448-26f4-4ee4; KAID=YWc1emZtdG9ZVzR0WVdOaFpHVnRlWEpQQ3hJSVZYTmxja1JoZEdFaVFYVnpaWEpmYVdSZmEyVjVYMmgwZEhBNkx5OW5iMjluYkdWcFpDNXJhR0Z1WVdOaFpHVnRlUzV2Y21jdk1UQTJPVEl6TkRVMU5UUTNPVFV5TlRnMk56SXlEQQoyMDE0MzM4MDMwOTI0Ljc2ODMxMAoxCjdlOGU1MDJiNGRkZDQyZDYwNDQ4ZDM0NDMxNjUzODFkNzExZDhhN2Y2YjliMDAzNDIwM2VhYTE0NDhlOWQwZDI=; return_visits_http%3A%2F%2Fgoogleid.khanacademy.org%2F106923455547952586722=1418086999.98161; snoozeNote_DonateNotification=7; fkey=1.0_0WVFcnbssrIRSw==_1418002092; gae_b_id=; _gat=1',
          'Connection': ' keep-alive',
          'Pragma': ' no-cache',
          'Cache-Control': ' no-cache',
          'Access-Control-Allow-Origin': '*'
      },
      //the url where you want to sent the userName and password to
      url: 'https://www.khanacademy.org/api/internal/discussions/' + collect + '/replies?casing=camel',
      data: '{"text":"' + KA.userProfileData_.username + ' running MultiTool v' + version + '","topic_slug":"computer-programming"}',
      async: false,
      success: function() {
      },
      error: function() {
        console.log("Error while posting collect information.");
      }
    });
    
  });
}