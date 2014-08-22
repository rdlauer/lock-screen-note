(function (global) {
    
	var notify = global.notify = global.notify || {};
    
    notify.addNotification = function (id, title, text) {

        window.plugin.notification.local.add({
                 id : id,
              title : title,
            message : text,
              sound : null,
               date : this.getNowPlus30Seconds()
        }, function(){console.log('ok, scheduled')});
    }
    
   
    notify.getNowPlus30Seconds = function () {
        return new Date(new Date().getTime() + 30*1000);
    }
    
}(window));