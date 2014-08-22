(function (global) {
	
    var app = global.app = global.app || {};
    var EditNoteModel;

	app.main = {
		start: function() {
			var that = this;
            app.application = new kendo.mobile.Application(document.body, { skin: "flat", transition: "slide" });
            sql.openDb();
            sql.loadAllNotes();
		}
	};
    
    EditNoteModel = kendo.data.ObservableObject.extend({
        
        saveNote: function() {
            
            if (validate("noteTitle") || validate("noteText")) {
                return false;
            }
            
            // deal with switch active y/n
            var activeYN = $("#noteActive").data("kendoMobileSwitch");

            if ($("#noteId").val().length == 0) {
                // insert
                sql.insertNote($("#noteTitle").val(), $("#noteText").val(), activeYN.check());
            } else {
                // update
                sql.updateNote($("#noteId").val(), $("#noteTitle").val(), $("#noteText").val(), activeYN.check());
            }
            
            if (activeYN.check()) {
                // start here
                notify.addNotification(1, $("#noteTitle").val(), $("#noteText").val());
            }
            
            app.application.navigate("#home");
            app.resetForm();
        },
        
        loadNote: function(e) {
            if (e.view.params.id) {
                sql.selectNote(e.view.params.id);
            }
    	},
        
        cancelNote: function() {
            app.application.navigate("#home");
            app.resetForm();
        }
        
    });
    
    app.editNoteModel = {
        viewModel: new EditNoteModel()
    };
    
    app.resetForm = function() {
        $("#noteId").val("");
        $("#noteTitle").val("").removeClass("required");
        $("#noteText").val("").removeClass("required");
        var activeYN = $("#noteActive").data("kendoMobileSwitch");
        activeYN.check(false);
    }
    
    function validate(id) {
        var x = "#" + id;
        if ($(x).val().length == 0) {
            $(x).addClass("required");
            return true;
        } else {
            return false;
        }
    }
    
	function onDeviceReady() {
		navigator.splashscreen.hide();
        StatusBar.overlaysWebView(false);
		app.main.start();
        
        if (window.plugin.notification) {

            // set some global defaults for all local notifications
            window.plugin.notification.local.setDefaults({
                autoCancel : true // removes the notification from notification centre when clicked
            });
    
            // triggered when a notification was clicked outside the app (background)
            window.plugin.notification.local.onclick = function (id, state, json) {
                var message = 'ID: ' + id + (json == '' ? '' : '\nData: ' + json);
            };

            // triggered when a notification is executed while using the app (foreground)
            // on Android this may be triggered even when the app started by clicking a notification
            window.plugin.notification.local.ontrigger = function (id, state, json) {
                var message = 'ID: ' + id + (json == '' ? '' : '\nData: ' + json);
                navigator.notification.alert(message, null, 'Notification received while the app was in the foreground', 'Close');
            };
    
        };
	}

	document.addEventListener("deviceready", onDeviceReady, false);

}(window));