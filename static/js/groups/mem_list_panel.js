/**
 * Created by Joe on 2/9/2019.
 */

/*=====================================================================
Membership List Toolbar
=====================================================================*/
var memListToolbar = {
  view: "toolbar",
  id: "memListToolbar",
  height: 70,
  rows: [
    {
      cols: [
        {view: "label", label: "Members"},
        {
          view: "button",
          type: "icon",
          icon: "user-times",
          label: "Drop",
          autowidth: true,
          click: "memListToolbarCtlr.drop();"
        },
        {
          view: "button",
          type: "icon",
          icon: "user-plus",
          label: "Add",
          autowidth: true,
          click: "memListToolbarCtlr.add();"
        }
      ]
    },
    {
      view: "text",
      id: "memFilter",
      label: 'Filter',
      labelAlign: "right",
      width: 200,
      on: {
        onTimedKeyPress: function() {
          memListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

var memListToolbarCtlr = {
  toolbar: null,

  init: function() {
    console.log("memListToolbarCtlr.init()");
    this.toolbar = $$("memListToolbar")
  },

  add: function() {
    if (!selectedGroup) {
      webix.message({type: "error", text: "No group selected!"});
      return;
    }
    webix.message("add member");
  },

  import: function() {
    if (!selectedGroup) {
      webix.message({type: "error", text: "No group selected!"});
      return;
    }
    webix.message("import members");
  }
};

/*=====================================================================
Membership List
=====================================================================*/
var memList = {
  view: "list",
  id: "memList",
  autoheight: true,
  width: 300,
  select: true,
  template: "#contact_name#"
};

var memListCtlr = {
  list: null,
  filtrStr: "",
  filtrCtl: null,

  init: function() {
    console.log("memListCtlr.init()");
    this.list = $$("memList");
    this.filtrCtl = $$("memFilter");
  },

  clear: function() {
    this.list.clearAll();
    this.filtrCtl.setValue("");
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.contact_name.toLowerCase().indexOf(value) == 0;
    })
  },

  load: function(grpid) {
    this.clear();
    this.list.parse(
      membershipsCollection.find(
        {group_id: grpid},
        {$orderBy: {contact_name: 1}}
      )
    );
//     this.filtrCtl.setValue(this.list.filtrStr);
//     this.filter(this.list.filtrStr);
  }

};

/*=====================================================================
Membership List Panel
=====================================================================*/
var memListPanel = {
  id: "memListPanel",
  rows: [memListToolbar, memList]
};

var memListPanelCtlr = {
  panel: null,

  init: function() {
    console.log("memListPanel.init()");
    this.panel = $$("memListPanel");
    memListToolbarCtlr.init();
    memListCtlr.init();
  }
};
