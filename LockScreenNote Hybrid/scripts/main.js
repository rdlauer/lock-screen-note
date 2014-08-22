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
                sql.updateNote($("#noteTitle").val(), $("#noteText").val(), activeYN.check(), $("#noteId").val());
            }
            
            app.application.navigate("#home");
            
        },
        
        loadNote: function(e) {
        	//console.log(e);
    	}
        
    });
    
    app.editNoteModel = {
        viewModel: new EditNoteModel()
    };
    
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