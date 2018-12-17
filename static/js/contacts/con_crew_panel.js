/**
 * Created by Joe on 6/15/2017.
 */

/*=====================================================================
Contact Crew List
=====================================================================*/
var conCrewList = {
  view: "list",
  id: "conCrewList",
  select: "row",
  height: 500,
  width: 500,
  tooltip: true,
  template: "#crewMember#",
  on: {
    onSelectChange: function() {
      //conPrecinctPanelCtlr.gridSelection();
    }
  }
};

/*=====================================================================
Contact Crew List Controller
=====================================================================*/
var conCrewListCtlr = {
  list: null,

  init: function() {
    this.list = $$("conCrewList");
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function() {
    this.clear();
    this.formatData(crew);
    this.list.parse(crew);
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj["crewMember"].toLowerCase().indexOf(value.toLowerCase()) == 0;
    })
  },

  formatData: function(crew) {
    //contacts.forEach(function(contact) {
    //  contact.name = (
    //      contact.last_name + ', ' +
    //      contact.first_name + ' ' +
    //      contact.middle_name + ' ' +
    //      contact.name_suffix).trim();
    //  contact.address = "";
    //  if (contact.street_name) {
    //    if (contact.house_number)
    //      contact.address = contact.house_number;
    //    if (contact.pre_direction)
    //      contact.address += " " + contact.pre_direction;
    //    contact.address += " " + contact.street_name;
    //    if (contact.street_type)
    //      contact.address += " " + contact.street_type;
    //    if (contact.suf_direction)
    //      contact.address += " " + contact.suf_direction;
    //    if (contact.unit)
    //      contact.address += " #" + contact.unit;
    //  }
    //});
  }

};

/*=====================================================================
Contact Crew List Toolbar
=====================================================================*/
var conCrewListToolbar = {
  view: "toolbar",
  id: "conCrewListToolbar",
  height: 35,
  elements: [
    {
      view: "label",
      label: "Crew Members"
    },
    {
      view: "search",
      id: "conCrewListFilter",
      placeholder: "Search...",
      width: 100,
      on: {
        onTimedKeyPress: function() {
          conCrewListCtlr.filter(this.getValue());
        }
      }
    },
    {
      view: "text",
      id: "precinct",
      label: "Precinct",
      width: 100
    },
    {
      view: "button",
      label: "Filter",
      width: 100,
      click: ""
    }
  ]
};

/*=====================================================================
Contact Crew List Toolbar Controller
=====================================================================*/
var conCrewListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("conCrewListToolbar");
  }
};

/*=====================================================================
Contact Crew List Panel
=====================================================================*/
var conCrewListPanel = {
  rows: [conCrewListToolbar, conCrewList]
};

/*=====================================================================
Contact Crew List Panel Controller
=====================================================================*/
var conCrewListPanelCtlr = {
  init: function() {
    conCrewListToolbarCtlr.init();
    conCrewListCtlr.init();
  }
};
