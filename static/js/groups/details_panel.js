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
      id: "saveGroupBtn",
      type: "icon",
      icon: "database",
      label: "Save",
      autowidth: true
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
      required: true,
      invalidMessage: "Group name is required!"
    },
    {
      view: "text",
      label: "Code",
      labelAlign: "right",
      name: "code",
      width: 300,
      required: true,
      invalidMessage: "Code name is required!",
      on: {
        onTimedKeyPress: function() {
          this.setValue(this.getValue().toUpperCase());
        }
      }
    },
    {
      view: "textarea",
      label: "Description",
      labelAlign: "right",
      name: "description",
      width: 300,
      height: 100
    }
  ],
  rules: {
    "name": webix.rules.isNotEmpty,
    "code": webix.rules.isNotEmpty
  }
};

var grpDetailsFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("grpDetailsForm");
  },

  clear: function() {
    this.frm.clear();
    this.frm.focus("name");
  },

  getValues: function() {
    if (!this.frm.validate()) {
      return null;
    }
    var values = this.frm.getValues({hidden: true});
    var matches = getGroupByName(values.name);
    if (matches.length > 0) {
      webix.message({type: "error", text: "Group named " + values.name + " already exists!"});
      return null;
    }
    matches =getGroupByCode(values.code);
    if (matches.length > 0) {
      webix.message({type: "error", text: "Group code " + values.code + " already exists!"});
      return null;
    }
    return this.frm.getValues({hidden: true});
  },

  //save: function() {
  //  if (!this.frm.validate()) {
  //    return null;
  //  }
  //  var values = this.frm.getValues({hidden: true});
  //
  //  var url = Flask.url_for("grp.save");
  //
  //  ajaxDao.post(url, values, function(data) {
  //    grpListCtlr.load(data["groups"]);
  //    grpListCtlr.select(data["grpid"]);
  //    webix.message("Group saved!");
  //  });
  //
  //},

  remove: function(id) {
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
  toolbar: null,
  form: null,

  init: function() {
    this.panel = $$("grpDetailsPanel");
    this.toolbar = $$("grpDetailsToolbar");
    this.form = $$("grpDetailsForm");
    grpDetailsFormCtlr.init();
  }
};

