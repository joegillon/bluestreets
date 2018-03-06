/**
 * Created by Joe on 10/10/2017.
 */

/*=====================================================================
Jurisdiction List
=====================================================================*/
var jurisdictionList = {
  view: "list",
  id: "jurisdictionList",
  width: 200,
  height: 400,
  select: true,
  template: "#name#",
  on: {
    onItemDblClick: function() {
      precinctListCtlr.load(this.getSelectedItem().code);
    }
  }
};

/*=====================================================================
Jurisdiction List Controller
=====================================================================*/
var jurisdictionListCtlr = {
  list: null,

  init: function() {
    this.list = $$("jurisdictionList");
    this.load(jurisdictions);
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function(data) {
    this.clear();
    this.list.parse(data);
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.name.toLowerCase().indexOf(value) == 0;
    })
  },

  getSelected: function() {
    return this.list.getSelectedItem();
  }
};

/*=====================================================================
Jurisdiction List Toolbar
=====================================================================*/
var jurisdictionListToolbar = {
  view: "toolbar",
  id: "jurisdictionListToolbar",
  height: 35,
  elements: [
    {
      view: "text",
      id: "jurisdictionFilter",
      label: "Jurisdiction",
      on: {
        onTimedKeyPress: function() {
          jurisdictionListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Jurisdiction List Toolbar Controller
=====================================================================*/
var jurisdictionListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("jurisdictionListToolbar");
  }
};

/*=====================================================================
Jurisdiction Panel
=====================================================================*/
var jurisdictionPanel = {
  rows: [jurisdictionListToolbar, jurisdictionList]
};

/*=====================================================================
Jurisdiction Panel Controller
=====================================================================*/
var jurisdictionPanelCtlr = {
  init: function() {
    jurisdictionListToolbarCtlr.init();
    jurisdictionListCtlr.init();
  }
};
