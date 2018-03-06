/**
 * Created by Joe on 6/15/2017.
 */

/*=====================================================================
Duplicates Grid
=====================================================================*/
var conDupsGrid = {
  view: "datatable",
  id: "conDupsGrid",
  editable: true,
  multiselect: true,
  select: true,
  height: 500,
  autowidth: true,
  resizeColumn: true,
  drag: true,
  columns: [
    {id: "id", header: "ID", adjust: true, readonly: true},
    {id: "name", header: "Name", width:100, sort: "string", editor: "text"},
    {id: "address", header: "Address", width:300, sort: "string", editor: "text"},
    {id: "city", header: "City", width:100, sort: "string", editor: "select", options: cities},
    {id: "zipcode", header: "Zip", width:50, sort: "string", editor: "text"},
    {id: "email", header: "Email", adjust: true, sort: "string", editor: "text"},
    {id: "phone1", header: "Phone 1", width:90, sort: "string", editor: "text"},
    {id: "phone2", header: "Phone 2", width:90, sort: "string", editor: "text"},
    {id: "birth_year", header: "DOB", width:50, readonly: true, sort: "string"},
    {id: "gender", header: "Gender", adjust: true, readonly: true, sort: "string"},
    {id: "hasVoterRec", header: "Voter Rec", adjust: true, readonly: true, sort: "string"},
    {id: "hasPrecinct", header: "Precinct", adjust: true, readonly: true, sort: "string"}
  ]
};

/*=====================================================================
Duplicates Grid Controller
=====================================================================*/
var conDupsGridCtlr = {
  grid: null,
  sourceInfo: null,

  init: function() {
    this.grid = $$("conDupsGrid");

    // These events won't work properly unless they are here. Ugh.
    this.grid.attachEvent("onBeforeDrag", function(context, ev) {
      this.sourceInfo = this.locate(ev);
      context.value = context.from.getItem(this.sourceInfo.row)[this.sourceInfo.column];
      context.html = "<div style='padding: 8px;'>" +
          context.value + "<br></div>";
    });
    this.grid.attachEvent("onBeforeDrop", function(context, ev) {
      var targetInfo = this.locate(ev);
      if (!targetInfo) {
        webix.message("Delete ID " + this.sourceInfo.row.toString());
        return false;
      }
      var col = targetInfo.column;
      var item = this.getItem(targetInfo.row);
      item[col] = context.value;
      this.updateItem(targetInfo.row, item);
      return false;
    });
  },

  clear: function() {
    this.grid.clearAll();
  },

  filter: function(value) {
    this.grid.filter(function(obj) {
      return obj.name.toLowerCase().indexOf(value) == 0;
    })
  },

  load: function(data) {
    this.clear();
    this.grid.parse(data);
    this.grid.adjustColumn("name");
  },

  getDups: function(type) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.duplicates", {type: type});

    ajaxDao.get(url, function(data) {
      var dups = data["dups"];
      if (dups.length == 0) {
        webix.message("No duplicates!");
        return;
      }
      conDupsGridCtlr.load(dups);
    });
  },

  voterLookup: function() {
    var items = this.grid.getSelectedItem(true);
    if (items.length != 1) {
      webix.message({type: "error", text: "Can lookup one at a time only!"});
      return;
    }

    var item = {
      last_name: items[0].last_name,
      first_name: items[0].first_name,
      last_name_meta: items[0].last_name_meta,
      first_name_meta: items[0].first_name_meta,
      address: ""
    };

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.voter_lookup");

    ajaxDao.post(url, item, function(data) {
      voterMatchPopupCtlr.show(data["candidates"]);
    });
  },

  remove: function() {
    var items = this.grid.getSelectedItem(true);
    var ids = [];
    items.forEach(function(item) {
      ids.push(item.id);
    });

      $$("conDupsGrid").remove(ids);
    ////noinspection JSUnresolvedVariable,JSUnresolvedFunction
    //var url = Flask.url_for("con.remove_list");
    //
    //ajaxDao.post(url, {ids: ids}, function() {
    //  $$("conDupsGrid").remove(ids);
    //});

  },

  save: function() {

  },

  quit: function() {

  }
};

/*=====================================================================
Duplicates Grid Toolbar
=====================================================================*/
var conDupsGridToolbar = {
  view: "toolbar",
  id: "conDupsGridToolbar",
  height: 35,
  rows: [
    {
      cols: [
        {view: "label", label: "Duplicates", width: 100},
        {
          view: "text",
          id: "dupFilter",
          label: "Filter",
          labelAlign: "right",
          width: 200,
          on: {
            onTimedKeyPress: function() {
              conDupsGridCtlr.filter(this.getValue());
            }
          }
        },
        {
          view: "button",
          label: "Voter Lookup",
          width: 150,
          click: "conDupsGridCtlr.voterLookup();"
        },
        {
          view: "button",
          label: "Remove Selected",
          width: 150,
          click: "conDupsGridCtlr.remove();"
        },
        {
          view: "button",
          value: "Save",
          width: 150,
          click: "conDupsGridCtlr.save();"
        },
        {
          view: "button",
          value: "Done",
          width: 150,
          click: "conDupsGridCtlr.quit();"
        },
        {}
      ]
    }
  ]
};

/*=====================================================================
Duplicates Grid Panel
=====================================================================*/
var conDupsPanel = {
  rows: [conDupsGridToolbar, conDupsGrid]
};

/*=====================================================================
Duplicates Grid Panel Controller
=====================================================================*/
var conDupsPanelCtlr = {
  init: function() {
    conDupsGridCtlr.init();
    conDupsGridCtlr.load(dups);
  }
};
