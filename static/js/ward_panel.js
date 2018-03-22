/**
 * Created by Joe on 10/10/2017.
 */

/*=====================================================================
Ward List
=====================================================================*/
var wardList = {
  view: "list",
  id: "wardList",
  width: 200,
  height: 400,
  select: true,
  template: "#ward#",
  on: {
    onItemDblClick: function() {
      wardListCtlr.handleSelection();
    }
  }
};

/*=====================================================================
Ward List Controller
=====================================================================*/
var wardListCtlr = {
  list: null,

  init: function() {
    this.list = $$("wardList");
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function(jurisdiction_code) {
    $$("wardList").clearAll();

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    var url = Flask.url_for("trf.get_wards", {jurisdiction_code: jurisdiction_code});

    ajaxDao.get(url, function(data) {
      $$("wardList").parse(data["wards"]);
      if (data["wards"].length == 1) {
        $$("wardList").select($$("wardList").getIdByIndex(0));
        wardListCtlr.handleSelection();
      }
    });
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.ward.toLowerCase().indexOf(value) == 0;
    })
  },

  getSelected: function() {
    return this.list.getSelectedItem();
  },

  handleSelection: function() {
    if (houseNumsListCtlr !== undefined)
      houseNumsListCtlr.clear();
    if (streetsListCtlr !== undefined)
      streetsListCtlr.clear();
    var j_item = jurisdictionListCtlr.getSelected();
    var w_item = this.list.getSelectedItem();
    precinctListCtlr.load(j_item.code, w_item.ward);
  }
};

/*=====================================================================
Ward List Toolbar
=====================================================================*/
var wardListToolbar = {
  view: "toolbar",
  id: "wardListToolbar",
  height: 35,
  elements: [
    {
      view: "text",
      id: "wardFilter",
      label: "Ward",
      on: {
        onTimedKeyPress: function() {
          wardListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Ward List Toolbar Controller
=====================================================================*/
var wardListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("wardListToolbar");
  }
};

/*=====================================================================
Ward Panel
=====================================================================*/
var wardPanel = {
  rows: [wardListToolbar, wardList]
};

/*=====================================================================
Ward Panel Controller
=====================================================================*/
var wardPanelCtlr = {
  init: function() {
    wardListToolbarCtlr.init();
    wardListCtlr.init();
  }
};
