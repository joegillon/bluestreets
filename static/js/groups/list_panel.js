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
          id: "dropGroupBtn",
          type: "icon",
          icon: "minus",
          label: "Drop",
          autowidth: true
        },
        {
          view: "button",
          id: "addGroupBtn",
          type: "icon",
          icon: "plus",
          label: "Add",
          autowidth: true
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          id: "grpFilter",
          label: 'Filter',
          labelAlign: "right",
          width: 300,
          on: {
            onTimedKeyPress: function() {
              grpListCtlr.filter(this.getValue().toLowerCase());
            }
          }
        },
        {}
      ]
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
  scheme: {
    $init: function(obj) {
      obj.id = webix.i18n.intFormat(obj.id);
    }
  }
};

var grpListCtlr = {
  list: null,
  filtrStr: "",
  filtrCtl: null,

  init: function() {
    this.list = $$("grpList");
    this.filtrCtl = $$("grpFilter");
    this.load(groupsCollection.find());
  },

  unselect: function() {
    this.list.unselectAll();
    this.filtrCtl.setValue("");
  },

  load: function(data) {
    this.filtrStr = this.filtrCtl.getValue();
    this.list.parse(data);
    this.list.data.sort("name");
    this.filtrCtl.setValue(this.filtrStr);
    this.filter(this.filtrStr);
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.name.toLowerCase().indexOf(value) == 0;
    })
  },

  select: function(id) {
    this.list.select(id);
    this.list.showItem(id);
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
  toolbar: null,
  list: null,

  init: function() {
    this.panel = $$("grpListPanel");
    this.toolbar = $$("grpListToolbar");
    this.list = $$("grpList");
    grpListCtlr.init();
  },

  getSelectedGroupId: function() {
    return parseInt(this.list.getSelectedId());
  }
};
