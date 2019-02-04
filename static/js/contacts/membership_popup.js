/**
 * Created by Joe on 2/3/2019.
 */
/* memList, memToolbar, memForm */

/*=====================================================================
Membership List Toolbar
=====================================================================*/
var memListToolbar = {
  view: "toolbar",
  id: "memListToolbar",
  height: 35,
  elements: [
    {
      view: "label",
      label: "Memberships"
    },
    {
      view: "button",
      type: "icon",
      icon: "user-times",
      tooltip: "Drop Membership",
      width: 25,
      click: "memFormToolbarCtlr.drop();"
    },
    {
      view: "button",
      type: "icon",
      icon: "user-plus",
      tooltip: "Add Membership",
      width: 25,
      click: "memFormToolbarCtlr.add();"
    }
  ]
};

/*=====================================================================
Membership List
=====================================================================*/
var memList = {
  rows: [
    {
      view: "list",
      id: "memList",
      template: "#group_name#",
      readonly: true,
      select: true,
      width: 200,
      height: 300,
      on: {
        onSelectChange: function() {
          memFormCtlr.loadMembership();
        }
      }
    }
  ]
};

var memListCtlr = {
  list: null,

  init: function() {
    this.list = $$("memList");
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function(data) {
    this.clear();
    this.list.parse(data);
    this.list.refresh();
  },

  getSelectedItem: function() {
    return this.list.getSelectedItem();
  }
};

/*=====================================================================
Membership Form Toolbar
=====================================================================*/
var memFormToolbar = {
  view: "toolbar",
  id: "memFormToolbar",
  height: 35,
  elements: [
    {view: "label", label: "Details"},
    {
      view: "button",
      type: "icon",
      icon: "database",
      tooltip: "Save Membership",
      width: 25,
      click: "memFormToolbarCtlr.save();"
    }
  ]
};

var memFormToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("memFormToolbar");
  },

  add: function() {
    memFormCtlr.clear();
  },

  drop: function() {

  },

  save: function() {
    // Save to DB
    // Save to FDB
    // Update views
  },

  quit: function() {
    memPopupCtlr.hide();
  }
};

/*=====================================================================
Membership Form
=====================================================================*/
var memForm = {
  view: "form",
  id: "memForm",
  tooltip: true,
  width: 600,
  elements: [
    {
      cols: [
        {
          view: "select",
          label: "Group",
          name: "group_name",
          width: 200,
          options: []
        },
        {
          view: "text",
          label: "Role",
          name: "role",
          width: 200,
          options: []
        }
      ]
    },
    {
      cols: [
        {
          view: "textarea",
          label: "Comment",
          name: "comment",
          width: 400,
          height: 100
        }
      ]
    }
  ],
  elementsConfig: {
    labelPosition: "top",
    attributes: {autocomplete: "new-password"}
  }
};

var memFormCtlr = {
  form: null,

  init: function() {
    this.form = $$("memForm");
    this.loadGroups();
  },

  clear: function() {
    this.form.clear();
    this.loadGroups();
  },

  loadGroups: function() {
    var groups = groupsCollection.find({}, {$orderBy: {name: 1}});
    var options = groups.map(function(group) {
      return {id: group.id, value: group.name}
    });
    this.form.elements["group_name"].define("options", options);
    this.form.elements["group_name"].refresh();
  },

  loadMembership: function() {
    var selection = memListCtlr.getSelectedItem();
    this.form.elements.group_name.setValue(selection.group_id);
    this.form.elements.role.setValue(selection.role);
    this.form.elements.comment.setValue(selection.comment);
  }
};

/*=====================================================================
Membership Panel
=====================================================================*/
var memPanel = {
  id: "memPanel",
  type: "space",
  autowidth: true,
  cols: [
    {
      rows: [memListToolbar, memList]
    },
    {
      rows: [memFormToolbar, memForm]
    }
  ]
};

var memPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("memPanel");
    memListCtlr.init();
    memFormToolbarCtlr.init();
    memFormCtlr.init();
  },

  clear: function() {
    memListCtlr.clear();
    memFormCtlr.clear();
  }
};

/*=====================================================================
Membership Popup
=====================================================================*/
var memPopup = {
  view: "window",
  id: "memPopup",
  move: true,
  resize: true,
  top: 20,
  left: 20,
  autowidth: true,
  autoheight: true,
  position: "center",
  modal: true,
  head: {
    cols: [
      {
        view: "label",
        css: "popup_header",
        label: "Memberships"
      },
      {
        view: "button",
        type: "icon",
        icon: "times-circle",
        width: 25,
        click: "memPopupCtlr.hide();"
      }
    ]
  },
  body: {
    cols: [memPanel]
  }
};

var memPopupCtlr = {
  popup: null,
  contact_id: null,

  init: function() {
    this.popup = $$("memPopup");
    memPanelCtlr.init();
  },

  show: function(contact_id) {
    this.contact_id = contact_id;
    memListCtlr.load(membershipsCollection.find({contact_id: contact_id}));
    this.popup.show();
  },

  hide: function() {
    memPanelCtlr.clear();
    this.popup.hide();
  },

  submit: function() {
    var values = memFormCtlr.getValues();
  }
};


