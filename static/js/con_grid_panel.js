/**
 * Created by Joe on 6/15/2017.
 */

/*=====================================================================
Contact Grid
=====================================================================*/
var conGrid = {
  view: "datatable",
  id: "conGrid",
  editable: false,
  select: "row",
  height: 500,
  width: 500,
  tooltip: true,
  columns: [
    {id: 'id', hidden: true},
    {id: 'name', header: 'Name', adjust: 'data'},
    {id: 'address', header: 'Address', adjust: 'data', tooltip: "#city# #zipcode#"}
  ],
  on: {
    onSelectChange: function() {
      conPrecinctPanelCtlr.gridSelection();
    }
  }
};

/*=====================================================================
Contact Grid Controller
=====================================================================*/
var conGridCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("conGrid");
    this.load();
  },

  clear: function() {
    this.grid.clearAll();
  },

  load: function() {
    this.clear();
    this.formatData(contacts);
    this.grid.parse(contacts);
  },

  filter: function(value) {
    this.grid.filter(function(obj) {
      return obj["name"].toLowerCase().indexOf(value.toLowerCase()) == 0;
    })
  },

  formatData: function(contacts) {
    contacts.forEach(function(contact) {
      contact.name = (
          contact.last_name + ', ' +
          contact.first_name + ' ' +
          contact.middle_name + ' ' +
          contact.name_suffix).trim();
      contact.address = "";
      if (contact.street_name) {
        if (contact.house_number)
          contact.address = contact.house_number;
        if (contact.pre_direction)
          contact.address += " " + contact.pre_direction;
        contact.address += " " + contact.street_name;
        if (contact.street_type)
          contact.address += " " + contact.street_type;
        if (contact.suf_direction)
          contact.address += " " + contact.suf_direction;
        if (contact.unit)
          contact.address += " #" + contact.unit;
      }
    });
  },

  reselect: function() {
    this.grid.select(this.grid.getSelectedId().row);
  },

  remove: function() {
    this.grid.remove(this.grid.getSelectedId());
  },

  autoRun: function() {

  }

};

/*=====================================================================
Contact Grid Toolbar
=====================================================================*/
var conGridToolbar = {
  view: "toolbar",
  id: "conGridToolbar",
  height: 35,
  elements: [
    {
      view: "label",
      label: "Unresolved Records"
    },
    {
      view: "search",
      id: "conGridFilter",
      placeholder: "Search...",
      width: 100,
      on: {
        onTimedKeyPress: function() {
          conGridCtlr.filter(this.getValue());
        }
      }
    },
    {
      view: "button",
      width: 100,
      label: "Auto-lookup",
      click: "conGridCtlr.autoRun();"
    }
  ]
};

/*=====================================================================
Contact Grid Toolbar Controller
=====================================================================*/
var conGridToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("conGridToolbar");
  }
};

/*=====================================================================
Contact Grid Panel
=====================================================================*/
var conGridPanel = {
  rows: [conGridToolbar, conGrid]
};

/*=====================================================================
Contact Grid Panel Controller
=====================================================================*/
var conGridPanelCtlr = {
  init: function() {
    conGridToolbarCtlr.init();
    conGridCtlr.init();
  }
};
