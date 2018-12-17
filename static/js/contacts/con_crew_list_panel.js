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
  width: 300,
  tooltip: true,
  template: "#whole_name#",
  drag: "source"
};

/*=====================================================================
Contact Crew List Controller
=====================================================================*/
var conCrewListCtlr = {
  list: null,

  init: function() {
    this.list = $$("conCrewList");
    this.load(contacts);

    // These events won't work properly unless they are here. Ugh.
    this.list.attachEvent("onBeforeDrag", function(context, ev) {
      this.sourceInfo = this.locate(ev);
      context.value = context.from.getItem(this.sourceInfo);
      context.html = "<div style='padding: 8px;'>" +
          context.value["whole_name"] + "<br></div>";
    });
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function(contacts) {
    this.clear();
    //this.formatData(crew);
    this.list.parse(contacts);
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj["whole_name"].toLowerCase().indexOf(value.toLowerCase()) == 0;
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
      label: "Crew"
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
