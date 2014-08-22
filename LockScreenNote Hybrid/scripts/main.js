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
        $("#noteTitle").val("");
        $("#noteText").val("");
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
	}

	document.addEventListener("deviceready", onDeviceReady, false);

}(window));