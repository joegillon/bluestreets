/**
 * Created by Joe on 10/10/2017.
 */

/*=====================================================================
Streets List
=====================================================================*/
var streetsList = {
  view: "list",
  id: "streetsList",
  width: 200,
  height: 400,
  select: true,
  template: "#street_name# #street_type#"
};

/*=====================================================================
Streets List Controller
=====================================================================*/
var streetsListCtlr = {
  list: null,

  init: function() {
    this.list = $$("streetsList");
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function(jurisdiction_code, ward, precinct) {
    this.clear();

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    var url = Flask.url_for("vtr.get_streets", {
      jurisdiction_code: jurisdiction_code,
      ward: ward,
      precinct: precinct
    });

    ajaxDao.get(url, function(data) {
      $$("streetsList").parse(data["streets"]);
    });

  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.street_name.toLowerCase().indexOf(value) == 0;
    })
  },

  getSelected: function() {
    return this.list.getSelectedItem();
  }
};

/*=====================================================================
Streets List Toolbar
=====================================================================*/
var streetsListToolbar = {
  view: "toolbar",
  id: "streetsListToolbar",
  height: 35,
  elements: [
    {
      view: "text",
      id: "streetsFilter",
      label: "Street",
      on: {
        onTimedKeyPress: function() {
          streetsListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Streets List Toolbar Controller
=====================================================================*/
var streetsListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("streetsListToolbar");
  }
};

/*=====================================================================
Streets Panel
=====================================================================*/
var streetsPanel = {
  rows: [streetsListToolbar, streetsList]
};

/*=====================================================================
Streets Panel Controller
=====================================================================*/
var streetsPanelCtlr = {
  init: function() {
    streetsListToolbarCtlr.init();
    streetsListCtlr.init();
  }
};
