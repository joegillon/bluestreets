/**
 * Created by Joe on 9/26/2017.
 */

/*=====================================================================
Group List
=====================================================================*/
var grpList = {
  view: "list",
  id: "grpList",
  autoheight: true,
  autowidth: true,
  select: true,
  template: "#name#",
  on: {
    onAfterSelect: function() {
      grpListCtlr.selected();
    }
  }
};

/*=====================================================================
Group List Controller
=====================================================================*/
var grpListCtlr = {
  list: null,
  filtrStr: "",
  filtrCtl: null,

  init: function() {
    this.list = $$("grpList");
    this.filtrCtl = $$("grpFilter");
    this.load(groups);
  },

  clear: function() {
    this.list.clearAll();
    this.filtrCtl.setValue("");
  },

  load: function(data) {
    this.filtrStr = this.filtrCtl.getValue();
    this.clear();
    this.list.parse(data);
    this.filtrCtl.setValue(this.filtrStr);
    this.filter(this.filtrStr);
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.name.toLowerCase().indexOf(value) == 0;
    })
  },

  add: function() {
    grpFormCtlr.clear();
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
          value: "Add",
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
          selectedGroup = null;
          grpFormCtlr.clear();
          grpListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
 ]
};

/*=====================================================================
Group Form
=====================================================================*/
var grpForm = {
  view: "form",
  id: "grpForm",
  elements: [
    {view: "text", name: "id", hidden: true},
    {
      view: "text",
      label: "Name",
      labelAlign: "right",
      name: "name",
      width: 300,
      invalidMessage: "Group name is required!"
    },
    {
      view: "textarea",
      label: "Description",
      labelAlign: "right",
      name: "description",
      width: 300,
      height: 100,
      invalidMessage: "Group description is required!"
    },
    {
      view: "button",
      value: "Save",
      type: "form",
      click: function() {
        grpFormCtlr.save();
      }
    },
    {
      view: "button",
      value: "Remove",
      type: "danger",
      click: function() {
        grpFormCtlr.remove(this.getParentView().getValues().id);
      }
    }
  ],
  rules: {
    "name": webix.rules.isNotEmpty,
    "description": webix.rules.isNotEmpty
  }
};

/*=====================================================================
Group Form Controller
=====================================================================*/
var grpFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("grpForm");
    this.frm.bind($$("grpList"));
  },

  clear: function() {
    this.frm.clear();
  },

  save: function() {
    if (!this.frm.validate()) {
      return null;
    }
    var values = this.frm.getValues({hidden: true});

    var url = values["id"] ? "grp.grp_update" : "grp.grp_add";

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    url = Flask.url_for(url);

    ajaxDao.post(url, values, function(data) {
      grpListCtlr.load(data["groups"]);
      grpListCtlr.select(data["grpid"]);
      webix.message("Group saved!");
    });

  },

  remove: function(id) {
    webix.confirm("Are you sure you want to remove this group?", "confirm-warning", function(yes) {
      if (yes) {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        var url = Flask.url_for("grp.grp_drop", {grpid: id});

        ajaxDao.get(url, function(data) {
          selectedGroup = null;
          grpListCtlr.load(data["groups"]);
          grpFormCtlr.clear();
          webix.message("Group removed!");
        });
      }
    });
  }
};

/*=====================================================================
Group Form Toolbar
=====================================================================*/
var grpFormToolbar = {
  view: "toolbar",
  id: "grpFormToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Group Details"}
  ]
};

/*=====================================================================
Group Members List
=====================================================================*/
var grpMembersList = {
  view: "list",
  id: "grpMembersList",
  autoheight: true,
  autowidth: true,
  select: true,
  template: "#member#"
};

/*=====================================================================
Group Members List Controller
=====================================================================*/
var grpMembersListCtlr = {
  list: null,
  filtrStr: "",
  filtrCtl: null,

  init: function() {
    this.list = $$("grpMembersList");
    this.filtrCtl = $$("grpMemberFilter");
  },

  clear: function() {
    this.list.clearAll();
    this.filtrCtl.setValue("");
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      //noinspection JSUnresolvedVariable
      return obj.member.toLowerCase().indexOf(value) == 0;
    })
  },

  load: function(grpid) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for('grp.grp_members', {grpid: grpid});
    var me = this;

    ajaxDao.get(url, function(data) {
      me.filtrStr = me.filtrCtl.getValue();
      me.clear();
      if (data.members.length > 0)
        me.list.parse(data.members);
      me.filtrCtl.setValue(me.filtrStr);
      me.filter(me.filtrStr);
    });
  }

};

/*=====================================================================
Group Members List Toolbar
=====================================================================*/
var grpMembersListToolbar = {
  view: "toolbar",
  id: "grpMemberListToolbar",
  height: 70,
  rows: [
    {
      cols: [
        {view: "label", label: "Members"},
        {
          view: "button",
          value: "Add",
          click: "grpMembersListToolbarCtlr.add();"
        },
        {
          view: "button",
          value: "Import",
          click: "grpMembersListToolbarCtlr.import();"
        }
      ]
    },
    {
      view: "text",
      id: "grpMemberFilter",
      label: 'Filter',
      labelAlign: "right",
      width: 200,
      on: {
        onTimedKeyPress: function() {
          grpMemberListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

/*=====================================================================
Group Members List Toolbar Controller
=====================================================================*/
var grpMembersListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("grpMembersListToolbar")
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
Group Panel
=====================================================================*/
var grpPanel = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [grpListToolbar, grpList]
    },
    {
      rows: [grpFormToolbar, grpForm]
    },
    {
      rows: [grpMembersListToolbar, grpMembersList]
    }
  ]
};

/*=====================================================================
Group Panel Controller
=====================================================================*/
var grpPanelCtlr = {

  init: function() {
    grpListCtlr.init();
    grpFormCtlr.init();
    grpMembersListCtlr.init();
    grpMembersListToolbarCtlr.init();
  }
};
