/**
 * Created by Joe on 11/15/2017.
 */

/*=====================================================================
Role List
=====================================================================*/
var roleList = {
  view: "list",
  id: "roleList",
  select: true,
  height: 300,
  width: 200,
  template: "#value#",
  on: {
    onAfterSelect: function() {
      roleListCtlr.selected();
    }
  }
};

/*=====================================================================
Role List Controller
=====================================================================*/
var roleListCtlr = {
  list: null,

  init: function () {
    this.list = $$("roleList");
    this.load();
  },

  clear: function () {
    this.list.clearAll();
  },

  load: function () {
    this.clear();
    this.list.parse(roles);
  },

  select: function (id) {
    this.list.select(id);
    this.list.showItem(id);
  },

  selected: function () {
    selectedRole = this.list.getSelectedItem();
    roleFormCtlr.load(selectedRole);
  },

  add: function() {
    roleFormCtlr.clear();
  }
};

/*=====================================================================
Role List Toolbar
=====================================================================*/
var roleListToolbar = {
  view: "toolbar",
  id: "roleListToolbar",
  height: 35,
  rows: [
    {
      cols: [
        {
          view: "label",
          label: "Roles"
        },
        {
          view: "button",
          value: "Add",
          css: "add_button",
          click: function() {
            roleListCtlr.add();
          }
        }
      ]
    }
  ]
};

/*=====================================================================
Role Form
=====================================================================*/
var roleForm = {
  view: "form",
  id: "roleForm",
  elements: [
    {view: "text", name: "id", hidden: true},
    {
      view: "text",
      label: "Role",
      labelAlign: "right",
      name: "name",
      width: 300,
      invalidMessage: "Name is required!"
    },
    {
      view: "textarea",
      label: "Description",
      labelAlign: "right",
      name: "description",
      width: 300,
      height: 100
    },
    {
      view: "button",
      value: "Save",
      type: "form",
      click: function() {
        roleFormCtlr.save();
      }
    },
    {
      view: "button",
      value: "Remove",
      type: "danger",
      click: function() {
        roleFormCtlr.remove(this.getParentView().getValues().id);
      }
    }
  ],
  rules: {
    "name": webix.rules.isNotEmpty
  }
};

/*=====================================================================
Role Form Controller
=====================================================================*/
var roleFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("roleForm");
  },

  clear: function() {
    this.frm.clear();
  },

  load: function(role) {
    this.frm.setValues({
      id: role.id,
      name: role.value,
      description: role.description
    });
  },

  save: function() {
    var values = this.validate();
    if (!values) return;

    var url = values["id"] ? "usr.role_update" : "usr.role_add";

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    url = Flask.url_for(url);

    ajaxDao.post(url, values, function(data) {
      roles = data["roles"];
      roleListCtlr.load();
      roleListCtlr.select(data["id"]);
      webix.message("Role saved!");
    });

  },

  validate: function() {
    if (!this.frm.validate()) {
      return null;
    }
    var values = this.frm.getValues({hidden: true});

    //check that role is unique

    return values;
  },

  remove: function(id) {
    webix.confirm("Are you sure you want to remove this role?", "confirm-warning", function(yes) {
      if (yes) {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        var url = Flask.url_for("usr.role_drop", {id: id});

        ajaxDao.get(url, function(data) {
          selectedRole = null;
          roles = data["roles"];
          roleListCtlr.load();
          roleFormCtlr.clear();
          webix.message("Role removed!");
        });
      }
    });
  }
};

/*=====================================================================
Role Form Toolbar
=====================================================================*/
var roleFormToolbar = {
  view: "toolbar",
  id: "roleFormToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Role Details"}
  ]
};

/*=====================================================================
Role Panel
=====================================================================*/
var rolePanel = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [roleListToolbar, roleList]
    },
    {
      rows: [roleFormToolbar, roleForm]
    }
  ]
};

/*=====================================================================
Role Panel Controller
=====================================================================*/
var rolePanelCtlr = {

  init: function() {
    roleListCtlr.init();
    roleFormCtlr.init();
  }

};
