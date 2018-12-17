/**
 * Created by Joe on 12/22/2017.
 */

/*=====================================================================
Contact Entry List
=====================================================================*/
var conEntryList = {
  view: "datatable",
  id: "conEntryList",
  autoheight: true,
  autowidth: true,
  editable: true,
  columns: [
    {
      id: "last_name",
      editor: "text",
      header: "Last Name",
      width: 200
    },
    {
      id: "first_name",
      editor: "text",
      header: "First Name",
      width: 150
    },
    {
      id: "middle_name",
      editor: "text",
      header: "Middle Name",
      width: 100
    },
    {
      id: "name_suffix",
      editor: "text",
      header: "Suffix",
      adjust: "header"
    },
    {
      id: "address",
      editor: "text",
      header: "Address",
      width: 200
    },
    {
      id: "city",
      editor: "text",
      header: "City",
      width: 100
    },
    {
      id: "zipcode",
      editor: "text",
      header: "Zip",
      width: 80
    },
    {
      id: "email",
      editor: "text",
      header: "Email",
      width: 150
    },
    {
      id: "phone1",
      editor: "text",
      header: "Phone 1",
      width: 100
    },
    {
      id: "phone2",
      editor: "text",
      header: "Phone 2",
      width: 100
    }
  ],
  data: [],
  on: {
    onBeforeAdd: function(id, obj, index) {
      if (index > 0)
        return conEntryListCtlr.nextRow(index);
    },
    onAfterEditStop: function(state, editor, ignoreUpdate) {
      if (editor.column == "phone2") {
        conEntryListCtlr.addEmptyRow();
      }
    }
  },
  rules: {
    "last_name": function(value) {
      return conEntryListCtlr.isValidName(value);
    },
    "first_name": function(value) {
      return conEntryListCtlr.isValidName(value);
    },
    "middle_name": function(value) {
      return value === "" || conEntryListCtlr.isValidName(value);
    },
    "zipcode": function(value) {
      return value === "" || conEntryListCtlr.isValidZip(value);
    },
    "email": function(value) {
      return value === "" || conEntryListCtlr.isValidEmail(value);
    },
    "phone1": function(value) {
      return value === "" || conEntryListCtlr.isValidPhone(value);
    },
    "phone2": function(value) {
      return value === "" || conEntryListCtlr.isValidPhone(value);
    }
  }
};

/*=====================================================================
Contact Entry List Controller
=====================================================================*/
var conEntryListCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("conEntryList");
    this.addEmptyRow();
  },

  clear: function() {
    this.grid.clearAll();
    this.addEmptyRow();
  },

  addEmptyRow: function() {
    this.grid.add({
      last_name: "",
      first_name: "",
      middle_name: "",
      name_suffix: "",
      address: "",
      city: "",
      zipcode: "",
      email: "",
      phone1: "",
      phone2: ""
    });
  },

  nextRow: function(idx) {
    var id = this.grid.getIdByIndex(idx - 1);
    if (!this.grid.validate(id)) {
      webix.message({type: "error", text: "Row has errors!"});
      return false;
    }
    return true;
  },

  isValidName: function(value) {
    return /^[a-zA-Z'-]+$/.test(value);
  },

  isValidZip: function(value) {
    return /^\d{5}$/.test(value);
  },

  isValidEmail: function(value) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
  },

  isValidPhone: function(value) {
    return /^\d{10}$/.test(value);
  },

  pull: function() {
    var pull = this.grid.data.pull;
    var data = [];
    for (var key in pull) {
      if (pull.hasOwnProperty(key))
        if (pull[key].last_name !== "") {
          var obj = {
            last_name: pull[key].last_name,
            first_name: pull[key].first_name,
            middle_name: pull[key].middle_name,
            name_suffix: pull[key].name_suffix,
            address: pull[key].address,
            city: pull[key].city,
            zipcode: pull[key].zipcode,
            email: pull[key].email,
            phone1: pull[key].phone1,
            phone2: pull[key].phone2
          };
          data.push(obj);
        }
    }
    return {data: data};
  }
};

/*=====================================================================
Contact Entry Toolbar
=====================================================================*/
var conEntryToolbar = {
  view: "toolbar",
  id: "conEntryToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Enter Contacts"},
    {
      view: "button",
      value: "Clear",
      click: "conEntryListCtlr.clear();"
    },
    {
      view: "button",
      value: "Save",
      click: "conEntryToolbarCtlr.save();"
    }
  ]

};

/*=====================================================================
Contact Entry Toolbar Controller
=====================================================================*/
var conEntryToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("conEntryToolbar");
  },

  save: function() {
    var items = conEntryListCtlr.pull();

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    var url = Flask.url_for('con.add_list');

    ajaxDao.post(url, items.data, function(data) {
      conEntryListCtlr.clear();
      webix.message(data['msg'])
    });
  }

};

/*=====================================================================
Contact Entry Panel
=====================================================================*/
var conEntryPanel = {
  rows: [conEntryToolbar, conEntryList]
};

/*=====================================================================
Contact Entry Panel Controller
=====================================================================*/
var conEntryPanelCtlr = {
  init: function() {
    conEntryToolbarCtlr.init();
    conEntryListCtlr.init();
  }
};
