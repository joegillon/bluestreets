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
      precinctListCtlr.handleSelection();
    },
    onItemClick: function(id) {
      if (this.isSelected(id))
        this.unselect(id, true);
      else
        this.select(id, true);
      return false;
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

  load: function(jurisdiction_code, ward_no) {
    // Can't use 'this' here... JS BS.
    $$("precinctList").clearAll();

    var args = {jurisdiction_code: jurisdiction_code};
    $$("precinctList").define('template', "#ward#: #precinct#");

    if (arguments.length == 2) {
      args['ward_no'] = ward_no;
      $$("precinctList").define('template', "#precinct#");
    }

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    var url = Flask.url_for("trf.get_precincts", args);

    ajaxDao.get(url, function(data) {
      $$("precinctList").parse(data["precincts"]);
      if (data["precincts"].length == 1) {
        $$("precinctList").select($$("precinctList").getIdByIndex(0));
        precinctListCtlr.handleSelection();
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

  select: function(ids) {
    this.list.select(ids);
  },

  handleSelection: function() {
    if (houseNumsListCtlr !== undefined)
      houseNumsListCtlr.clear();
    var item = this.list.getSelectedItem();
    streetsListCtlr.load(item.jurisdiction_code, item.ward, item.precinct);
  },

  setMultiSelect: function() {
    this.list.define("multiselect", true);
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
