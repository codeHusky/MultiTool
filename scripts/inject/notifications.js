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
  if(data.canPost == true){
    chrome.runtime.sendMessage("melabjdobbjfobmgaagkmgbnhplncdie",{"get":"manifest"},function(data){
      postEcho(data);
    });
  }else{
    if(data.canPost == false){
      return;
    }
    console.log("CHECKING IF OKAY TO POST")
    alert("MultiTool Alert\n\nBy clicking closing this alert, you are fine with me collecting some diagnostic data to improve your experience. This will involve me posting on your behalf on a specific program with just some diagnostic data, nothing else.");
    if(true){
      console.log("IT'S OKAY, POSTING.")
      chrome.runtime.sendMessage("melabjdobbjfobmgaagkmgbnhplncdie",{"set":"canPost","data":true},function(data){
        console.log(data);
        console.log("SET SUCCESSFULLY");
        chrome.runtime.sendMessage("melabjdobbjfobmgaagkmgbnhplncdie",{"get":"manifest"},function(data2){
          console.log("CONTINUING...")
          postEcho(data2);
        });
      })
    }
  }
});
//
var version = "?";
var postedCollectThisVersion = false;
var postedCollectAlready = false;
var oldCollectID = "";
function postEcho(manifest) {
  version = manifest.version_name;
  $.getJSON("https://www.khanacademy.org/api/internal/discussions/scratchpad/4684982804152320/comments?casing=camel&qa_expand_key=&sort=2&subject=all&limit=1000000000&page=0&lang=en",function(rData) {
    for(var i = 0; i < rData.feedback.length; i++){
      if(KA.userProfileData_.kaid == rData.feedback[i].authorKaid){
        postedCollectAlready = true;
        if(rData.feedback[i].content.indexOf(version) > -1&&rData.feedback[i].content == KA.userProfileData_.username + ' running MultiTool v' + version){
          postedCollectThisVersion = true;
        }else{
          oldCollectID = rData.feedback[i].key;
        }
      }
    }
    var method = "POST";
    var url = "https://www.khanacademy.org/api/internal/discussions/scratchpad/4684982804152320/comments?casing=camel&lang=en&_=1440374463375";
    if(postedCollectAlready && postedCollectThisVersion){
      return;
    }else if(postedCollectAlready && !postedCollectThisVersion){
      method = "PUT"
      url = "https://www.khanacademy.org/api/internal/discussions/scratchpad/4684982804152320/comments/" + oldCollectID;
    }
    $.ajax({
      type: method,
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
      url: url,
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