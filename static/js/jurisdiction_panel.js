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
  //data: jurisdictions,
  template: "#name#",
  on: {
    onItemDblClick: function() {
      jurisdictionListCtlr.handleSelection(this.getSelectedItem().code);
    }
  }
};

/*=====================================================================
Jurisdiction List Controller
=====================================================================*/
var jurisdictionListCtlr = {
  list: null,
  selectFunction: null,

  init: function(selectFunction) {
    this.list = $$("jurisdictionList");
    this.selectFunction = selectFunction;
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function() {
    this.list.parse(jurisdictions);
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.name.toLowerCase().indexOf(value) == 0;
    })
  },

  select: function (id) {
    this.list.select(id);
    this.list.showItem(id);
  },

  handleSelection: function(code) {
    if (typeof houseNumsListCtlr !== "undefined")
      houseNumsListCtlr.clear();
    if (typeof streetsListCtlr !== "undefined")
      streetsListCtlr.clear();
    if (typeof precinctListCtlr !== "undefined")
      precinctListCtlr.clear();
    this.selectFunction(code);
  },

  getSelected: function() {
    return $$("jurisdictionList").getSelectedItem();
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
  init: function(selectFunction) {
    jurisdictionListToolbarCtlr.init();
    jurisdictionListCtlr.init(selectFunction);
  }
};
