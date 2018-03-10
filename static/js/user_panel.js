/**
 * Created by Joe on 11/15/2017.
 */

/*=====================================================================
User List
=====================================================================*/
var userList = {
  view: "list",
  id: "userList",
  select: true,
  height: 300,
  width: 200,
  template: "#username#",
  on: {
    onAfterSelect: function() {
      userListCtlr.selected();
    }
  }
};

/*=====================================================================
User List Controller
=====================================================================*/
var userListCtlr = {
  list: null,

  init: function () {
    this.list = $$("userList");
    this.load();
  },

  clear: function () {
    this.list.clearAll();
  },

  load: function () {
    this.clear();
    this.list.parse(users);
  },

  select: function (id) {
    this.list.select(id);
    this.list.showItem(id);
  },

  selected: function () {
    selectedUser = this.list.getSelectedItem();
    userFormCtlr.load(selectedUser);
  },

  add: function() {
    userFormCtlr.clear();
  }};

/*=====================================================================
User List Toolbar
=====================================================================*/
var userListToolbar = {
  view: "toolbar",
  id: "userListToolbar",
  height: 35,
  rows: [
    {
      cols: [
        {
          view: "label",
          label: "Users"
        },
        {
          view: "button",
          value: "Add",
          css: "add_button",
          click: function() {
            userListCtlr.add();
          }
        }      ]
    }
  ]
};

/*=====================================================================
User Form
=====================================================================*/
var userForm = {
  view: "form",
  id: "userForm",
  elements: [
    {view: "text", name: "id", hidden: true},
    {
      view: "text",
      label: "Username",
      name: "username",
      width: 300,
      labelWidth: 120,
      labelAlign: "right",
      invalidMessage: "Username is required!"
    },
    {
      view: "richselect",
      label: "Role",
      name: "role_id",
      width: 300,
      labelWidth: 120,
      labelAlign: "right",
      options: roles
    },
    {
      view: "text",
      label: "Password",
      name: "password",
      type: "password",
      width: 300,
      labelWidth: 120,
      labelAlign: "right",
      invalidMessage: "Password is required!"
    },
    {
      view: "text",
      label: "Confirm Password",
      name: "confirm",
      type: "password",
      width: 300,
      labelWidth: 120,
      labelAlign: "right",
      invalidMessage: "Confirm Password is required!"
    },
    {
      view: "button",
      value: "Save",
      type: "form",
      click: function() {
        userFormCtlr.save();
      }
    },
    {
      view: "button",
      value: "Remove",
      type: "danger",
      click: function() {
        userFormCtlr.remove(this.getParentView().getValues().id);
      }
    }
  ],
  rules: {
    "username": webix.rules.isNotEmpty,
    "password": webix.rules.isNotEmpty,
    "confirm": webix.rules.isNotEmpty
  }
};

/*=====================================================================
User Form Controller
=====================================================================*/
var userFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("userForm");
  },

  clear: function() {
    this.frm.clear();
  },

  load: function(user) {
    this.frm.setValues({
      id: user.id,
      username: user.username,
      password: user.password,
      confirm: user.password
    });
    //noinspection JSUnresolvedVariable
    this.frm.getChildViews()[2].setValue(user.role_id);
  },

  save: function() {
    var values = this.validate();
    if (!values) return;

    var url = values["id"] ? "usr.user_update" : "usr.user_add";

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    url = Flask.url_for(url);

    ajaxDao.post(url, values, function(data) {
      users = data["users"];
      userListCtlr.load();
      userListCtlr.select(data["id"]);
      webix.message("User saved!");
    });

  },

  validate: function() {
    if (!this.frm.validate()) {
      return null;
    }
    var values = this.frm.getValues({hidden: true});

    if (values["password"] != values["confirm"]) {
      webix.alert({type: "alert-error", text: "Passwords don't match!"});
      return null;
    }

    //check that role is selected

    return values;
  },

  remove: function(id) {
    webix.confirm("Are you sure you want to remove this user?", "confirm-warning", function(yes) {
      if (yes) {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        var url = Flask.url_for("usr.usr_drop", {id: id});

        ajaxDao.get(url, function(data) {
          selectedUser = null;
          users = data["users"];
          userListCtlr.load();
          userFormCtlr.clear();
          webix.message("User removed!");
        });
      }
    });
  }
};

/*=====================================================================
User Form Toolbar
=====================================================================*/
var userFormToolbar = {
  view: "toolbar",
  id: "userFormToolbar",
  height: 35,
  cols: [
    {view: "label", label: "User Details"}
  ]
};

/*=====================================================================
User Panel
=====================================================================*/
var userPanel = {
  type: "space",
  css: "panel_layout",
  cols: [
    {
      rows: [userListToolbar, userList]
    },
    {
      rows: [userFormToolbar, userForm]
    }
  ]
};

/*=====================================================================
User Panel Controller
=====================================================================*/
var userPanelCtlr = {

  init: function() {
    userListCtlr.init();
    userFormCtlr.init();
  }

};
