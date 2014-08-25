(function (global) {
    
	var notify = global.notify = global.notify || {};
    
    notify.addNotification = function (id, title, text, seconds) {

        window.plugin.notification.local.add({
                 id : id,
              title : title,
            message : text,
              sound : null,
               date : this.getNowPlusXSeconds(seconds)
        }, function(){console.log('ok, scheduled')});
    }
    
   
    notify.getNowPlusXSeconds = function (seconds) {
        return new Date(new Date().getTime() + seconds * 1000);
    }
    
}(window));