/**
 * Created by Joe on 10/10/2017.
 */

/*=====================================================================
Precinct List
=====================================================================*/
var precinctList = {
  view: "list",
  id: "precinctList",
  width: 200,
  height: 400,
  select: true,
  template: "#ward#: #precinct#",
  on: {
    onItemDblClick: function() {
      var item = this.getSelectedItem();
      streetsListCtlr.load(item.jurisdiction_code, item.ward, item.precinct);
    }
  }
};

/*=====================================================================
Precinct List Controller
=====================================================================*/
var precinctListCtlr = {
  list: null,

  init: function() {
    this.list = $$("precinctList");
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function(jurisdiction_code) {
    this.clear();

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    var url = Flask.url_for("vtr.get_precincts", {jurisdiction_code: jurisdiction_code});

    ajaxDao.get(url, function(data) {
      $$("precinctList").parse(data["precincts"]);
    });
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.ward.toLowerCase().indexOf(value) == 0;
    })
  },

  getSelected: function() {
    return this.list.getSelectedItem();
  }
};

/*=====================================================================
Precinct List Toolbar
=====================================================================*/
var precinctListToolbar = {
  view: "toolbar",
  id: "precinctListToolbar",
  height: 35,
  elements: [
    {
      view: "text",
      id: "precinctFilter",
      label: "Precinct",
      on: {
        onTimedKeyPress: function() {
          precinctListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Precinct List Toolbar Controller
=====================================================================*/
var precinctListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("precinctListToolbar");
  }
};

/*=====================================================================
Precinct Panel
=====================================================================*/
var precinctPanel = {
  rows: [precinctListToolbar, precinctList]
};

/*=====================================================================
Precinct Panel Controller
=====================================================================*/
var precinctPanelCtlr = {
  init: function() {
    precinctListToolbarCtlr.init();
    precinctListCtlr.init();
  }
};
