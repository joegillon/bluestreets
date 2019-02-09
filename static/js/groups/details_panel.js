/**
 * Created by Joe on 2/9/2019.
 */

/*=====================================================================
Group Details Toolbar
=====================================================================*/
var grpDetailsToolbar = {
  view: "toolbar",
  id: "grpDetailsToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Details"},
    {
      view: "button",
      type: "icon",
      icon: "database",
      label: "Save",
      autowidth: true,
      click: function() {
        grpDetailsFormCtlr.save();
      }
    }

  ]
};

/*=====================================================================
Group Details Form
=====================================================================*/
var grpDetailsForm = {
  view: "form",
  id: "grpDetailsForm",
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
    }
  ],
  rules: {
    "name": webix.rules.isNotEmpty,
    "description": webix.rules.isNotEmpty
  }
};

var grpDetailsFormCtlr = {
  frm: null,

  init: function() {
    console.log("grpDetailsFormCtlr.init()");
    this.frm = $$("grpDetailsForm");
    //this.frm.bind($$("grpList"));
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
Group Details Panel
=====================================================================*/
var grpDetailsPanel = {
  id: "grpDetailsPanel",
  rows: [grpDetailsToolbar, grpDetailsForm]
};

var grpDetailsPanelCtlr = {
  panel: null,

  init: function() {
    console.log("grpDetailsPanel.init()");
    this.panel = $$("grpDetailsPanel");
    grpDetailsFormCtlr.init();
  }
};

