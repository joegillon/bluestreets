/**
 * Created by Joe on 2/9/2019.
 */

/*=====================================================================
Group List Toolbar
=====================================================================*/
var grpListToolbar = {
  view: "toolbar",
  id: "grpListToolbar",
  height: 70,
  rows: [
    {
      cols: [
        {view: "label", label: "Groups"},
        {
          view: "button",
          type: "icon",
          icon: "minus",
          label: "Drop",
          autowidth: true,
          click: function() {
            grpListCtlr.drop();
          }
        },
        {
          view: "button",
          type: "icon",
          icon: "plus",
          label: "Add",
          autowidth: true,
          click: function() {
            grpListCtlr.add();
          }
        }
      ]
    },
    {
      view: "text",
      id: "grpFilter",
      label: 'Filter',
      labelAlign: "right",
      width: 200,
      on: {
        onTimedKeyPress: function() {
          grpListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
 ]
};

/*=====================================================================
Group List
=====================================================================*/
var grpList = {
  view: "list",
  id: "grpList",
  autoheight: true,
  width: 300,
  select: true,
  template: "#name#",
  on: {
    onAfterSelect: function() {
      grpListCtlr.selected();
    }
  }
};

var grpListCtlr = {
  list: null,
  filtrStr: "",
  filtrCtl: null,

  init: function() {
    console.log("grpListCtrl.init()");
    this.list = $$("grpList");
    this.filtrCtl = $$("grpFilter");
    this.load(groupsCollection.find());
  },

  unselect: function() {
    this.list.unselectAll();
    this.filtrCtl.setValue("");
  },

  load: function(data) {
//     this.filtrStr = this.filtrCtl.getValue();
    this.list.parse(data);
//     this.filtrCtl.setValue(this.filtrStr);
//     this.filter(this.filtrStr);
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.name.toLowerCase().indexOf(value) == 0;
    })
  },

  add: function() {
    this.unselect();
    grpFormCtlr.clear();
    grpMembersListCtlr.clear();
    $$("grpForm").focus("name");
  },

  drop: function() {

  },

  select: function(id) {
    this.list.select(id);
    this.list.showItem(id);
  },

  selected: function() {
    selectedGroup = this.list.getSelectedItem();
    grpMembersListCtlr.load(selectedGroup.id);
  }

};

/*=====================================================================
Group List Panel
=====================================================================*/
var grpListPanel = {
  id: "grpListPanel",
  rows: [grpListToolbar, grpList]
};

var grpListPanelCtlr = {
  panel: null,

  init: function() {
    console.log("grpListPanelCtrl.init()");
    this.panel = $$("grpListPanel");
    grpListCtlr.init();
  }
};
