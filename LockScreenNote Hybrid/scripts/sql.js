(function (global) {
	
    var sql = global.sql = global.sql || {};
    
    sql.openDb = function() {
        if (window.navigator.simulator === true) {
            // appbuilder simulator
            sql.db = window.openDatabase("LockScreenNote", "1.0", "LockScreenNote", -1);
        }
        else if (window.sqlitePlugin !== undefined) {
            // sqlite plugin
            sql.db = window.sqlitePlugin.openDatabase({name: "LockScreenNote.db"});
        } else {
            // fallback to native web if needed
            sql.db = window.openDatabase("LockScreenNote", "1.0", "LockScreenNote", -1);
        }
        
        // after we have opened the db, create the table
        sql.createTable();
    }
    
    sql.createTable = function() {
        sql.db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS Note (id INTEGER PRIMARY KEY ASC, note_title TEXT, note_text TEXT, active_yn TEXT, active_seconds INTEGER)");
        });
    }
    
    sql.insertNote = function(title, text, active, seconds) {
        sql.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO Note (note_title, note_text, active_yn, active_seconds) VALUES (?,?,?,?)",
                          [title, text, active, seconds],
                          sql.onSuccess,
                          sql.onError);
        });
    }
    
    sql.updateNote = function(id, title, text, active, seconds) {
        sql.db.transaction(function(tx) {
            tx.executeSql("UPDATE Note SET note_title = ?, note_text = ?, active_yn = ?, active_seconds = ? WHERE id = ?",
                          [title, text, active, seconds, id],
                          sql.onSuccess,
                          sql.onError);
        });
    }
    
    sql.deleteNote = function(id) {
        sql.db.transaction(function(tx) {
            tx.executeSql("DELETE FROM Note WHERE id = ?",
                          [id],
                          sql.loadAllNotes,
                          sql.onError);
        });
    }
    
    sql.selectNote = function(id) {
        var render = function (tx, rs) {
            $("#noteId").val(id);
            //$("#noteTitle").val(rs.rows.item(0).note_title);
            $("#noteText").val(rs.rows.item(0).note_text);
            var activeYN = $("#noteActive").data("kendoMobileSwitch");
            if (rs.rows.item(0).active_yn == 0) {
                activeYN.check(false);
            } else {
                activeYN.check(true);
                $("#noteDelayPanel").show();
            }
            $("#noteDelay").val(rs.rows.item(0).active_seconds);
            $(".deleteButtonHollow").show();
        }
        
        sql.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM Note WHERE id = ?", [id], 
                      render, 
                      sql.onError);
        });
    }
    
    sql.loadAllNotes = function() {
        if (sql.db) {
            var render = function (tx, rs) {
                var rowOutput = "";

                for (var i = 0; i < rs.rows.length; i++) {
                    rowOutput += JSON.stringify(rs.rows.item(i)) + ",";
                }
                
                if (rowOutput.length > 0) {
                    rowOutput = "[" + rowOutput.substring(0, rowOutput.length - 1) + "]";
                }

                //console.log(rowOutput);

                var template = kendo.template($("#note-template").html());
        		
                if (rowOutput.length == 0) {
                    $("#note-list").kendoMobileListView({
                        dataSource: new kendo.data.DataSource()
                    })
				} else {
                    $("#note-list").kendoMobileListView({
                        dataSource: kendo.data.DataSource.create($.parseJSON(rowOutput)),
                        template: template
                    })
/*                    .kendoTouch({
                        filter: ">li",
                        enableSwipe: true,
    					touchstart: touchstart,
                        //tap: navigate,
                        swipe: swipe
                    });  */ 
                }
            }
            
            sql.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM Note ORDER BY id", [], 
                          render, 
                          sql.onError);
            });    
        }
    }
    
    sql.deleteDb = function() {
        sql.db.transaction(function(tx) {
            tx.executeSql("DROP TABLE IF EXISTS Note");
        });
    }
    
    sql.onSuccess = function(tx, res) {
        console.log("Your SQLite query was successful!");
		console.log("insertId: " + res.insertId);
		console.log("rowsAffected: " + res.rowsAffected);
    }
    
    sql.onError = function(tx, e) {
        console.log("SQLite Error: " + e.message);
    }
    
    //function navigate(e) {
        //var itemUID = $(e.touch.currentTarget).data("uid");
        //console.log(e);
        //kendo.mobile.application.navigate("#edit-detailview?uid=" + itemUID);
    //}

/*    function swipe(e) {
        var button = kendo.fx($(e.touch.currentTarget).find("[data-role=button]"));
        button.expand().duration(200).play();
    }

    function touchstart(e) {
        var target = $(e.touch.initialTouch),
            listview = $("#note-list").data("kendoMobileListView"),
            model,
            button = $(e.touch.target).find("[data-role=button]:visible");

        if (target.closest("[data-role=button]")[0]) {
            model = dataSource.getByUid($(e.touch.target).attr("data-uid"));
            dataSource.remove(model);
            //prevent `swipe`
            this.events.cancel();
            e.event.stopPropagation();
        } else if (button[0]) {
            button.hide();
            //prevent `swipe`
            this.events.cancel();
        } else {
            listview.items().find("[data-role=button]:visible").hide();
        }
    }*/

}(window));