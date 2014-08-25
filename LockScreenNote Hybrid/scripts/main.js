(function (global) {
	
    var app = global.app = global.app || {};
    var EditNoteModel;

	app.main = {
		start: function() {
			var that = this;
            app.application = new kendo.mobile.Application(document.body, { transition: "slide" });
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
                sql.insertNote($("#noteTitle").val(), $("#noteText").val(), activeYN.check(), $("#noteDelay").val());
            } else {
                // update
                sql.updateNote($("#noteId").val(), $("#noteTitle").val(), $("#noteText").val(), activeYN.check(), $("#noteDelay").val());
            }
            
            if (activeYN.check() && window.plugin && window.plugin.notification) {
                notify.addNotification(app.guid(), $("#noteTitle").val(), $("#noteText").val(), $("#noteDelay").val());
                
                if (window.plugins.toast) {
                    // show a toast notification
                    window.plugins.toast.show(
                          "Remember to put your device to sleep for the notification to show up!",
                          "long", // ‘short’, ‘long’
                          "center" // ‘top’, ‘center’, ‘bottom’
                          );
                }
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
        },
        
        showActive: function(e) {
            //console.log(e.checked);
            if (e.checked) {
                $("#noteDelayPanel").show(); 
            } else {
                $("#noteDelayPanel").hide(); 
            }
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
        $("#noteDelay").val("10");
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
    
    app.guid = (function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
      }
      return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
      };
    })();
    
    app.closeModalViewLogin = function() {
        $("#modalview-first-use").kendoMobileModalView("close");
        localStorage.setItem("note_firstrun", "y");
    }
    
	function onDeviceReady() {
		navigator.splashscreen.hide();
        StatusBar.overlaysWebView(false);
		app.main.start();
        
        if (localStorage["note_firstrun"] == null) {
            $("#modalview-first-use").kendoMobileModalView("open");
        }
        
        
        if (window.plugin && window.plugin.notification) {

            // set some global defaults for all local notifications
            window.plugin.notification.local.setDefaults({
                autoCancel : true // removes the notification from notification centre when clicked
            });
    
            // triggered when a notification was clicked outside the app (background)
            window.plugin.notification.local.onclick = function (id, state, json) {
                //var message = 'ID: ' + id + (json == '' ? '' : '\nData: ' + json);
            };

            // triggered when a notification is executed while using the app (foreground)
            // on Android this may be triggered even when the app started by clicking a notification
            window.plugin.notification.local.ontrigger = function (id, state, json) {
                //var message = 'ID: ' + id + (json == '' ? '' : '\nData: ' + json);
                //navigator.notification.alert(message, null, 'Notification received while the app was in the foreground', 'Close');
            };
    
        };
	}

	document.addEventListener("deviceready", onDeviceReady, false);

}(window));