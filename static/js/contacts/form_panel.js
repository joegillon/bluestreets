/* conFormPanel: conFormToolbar, conForm */

/*=====================================================================
Contact Form Toolbar
=====================================================================*/
var conFormToolbar = {
  view: "toolbar",
  id: "conFormToolbar",
  height: 35,
  elements: [
    {view: "label", label: "Details"},
    {
      view: "button",
      label: "Clear",
      width: 60,
      click: "conFormCtlr.clear();"
    },
    {
      view: "button",
      label: "Drop",
      width: 60,
      click: "conFormToolbarCtlr.drop();"
    },
    {
      view: "button",
      label: "Email",
      width: 60,
      click: "conFormToolbarCtlr.email();"
    },
    {
      view: "button",
      label: "Submit",
      width: 60,
      click: "conFormToolbarCtlr.submit();"
    }
  ]
};

var conFormToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("conFormToolbar");
  },

  drop: function() {
    var gridSelection = conFormCtlr.getGridSelection();
    if (gridSelection.id == "") return;
    webix.message('Drop contact ' + gridSelection.id);
  },

  email: function() {
    var gridSelection = conFormCtlr.getGridSelection();
    if (gridSelection.id == "") return;
    webix.message('Email contact ' + gridSelection.id);
  },

  submit: function() {
    var vals = conFormCtlr.getValues({hidden: true});
    var gridSelection = conFormCtlr.getGridSelection();

    if (vals.id == "" || vals.address != gridSelection.address) {

    }

    var params = {
      id: vals.id,
      last_name: vals.last,
      first_name: vals.first,
      middle_name: vals.middle,
      name_suffix: vals.suffix,
      nickname: vals.nickname,
      email: vals.email,
      phone1: vals.phone1,
      phone2: vals.phone2,
      city: vals.city,
      zipcode: vals.zipcode,
      address: vals.address
    };
    //vals = $$("conMatchGrid").getSelectedItem();
    //params.address = vals.address;
    //params.city = vals.city;
    //params.zipcode = vals.zipcode;
    //params.birth_year = vals.birth_year;
    //params.gender = vals.gender;
    //params.voter_id = vals.voter_id;
    //params.precinct_id = vals.precinct_id;
    //params.reg_date = vals.reg_date;

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.grid");

    ajaxDao.post(url, params, function(data) {
      conPrecinctPanelCtlr.removeItem();
    });

  }
};

/*=====================================================================
Contact Form
=====================================================================*/
var conForm = {
  view: "form",
  id: "conForm",
  elements: [
    {
      cols: [
        {
          view: "text",
          hidden: true,
          label: "id",
          name: "id"
        },
        {
          view: "text",
          label: "Email",
          name: "email",
          width: 200,
          on: {
            onBlur: function() {
              conMgtPanelCtlr.emailMatch(this.getValue());
            }
          }
        },
        {
          view: "text",
          label: "Phone 1",
          name: "phone1",
          width: 130,
          on: {
            onBlur: function() {
              conMgtPanelCtlr.phoneMatch(phone_uglify(this.getValue()));
            }
          }
        },
        {
          view: "text",
          label: "Phone 2",
          name: "phone2",
          width: 130,
          on: {
            onBlur: function() {
              conMgtPanelCtlr.phoneMatch(phone_uglify(this.getValue()));
            }
          }
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          label: "Address",
          name: "address",
          width: 300,
          on: {
            onBlur: function() {
              conMgtPanelCtlr.addressMatch(this.getValue());
            }
          }
        },
        {
          view: "text",
          label: "City",
          name: "city",
          width: 100
        },
        {
          view: "text",
          label: "Zip",
          name: "zipcode",
          width: 70
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          label: "Last",
          name: "last",
          on: {
            onBlur: function() {
              conMgtPanelCtlr.lastNameMatch(this.getValue());
            }
          }
        },
        {
          view: "text",
          label: "First",
          name: "first",
          width: 180
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          label: "Middle",
          name: "middle",
          width: 180
        },
        {
          view: "text",
          label: "Suffix",
          name: "suffix",
          width: 60
        },
        {
          view: "text",
          label: "Nickname",
          name: "nickname"
        }
      ]
    }
  ],
  elementsConfig: {labelPosition: "top"},
  on: {
    //onValues: function() {
    //  var values = this.getValues();
    //  if (values.id)
    //    conPrecinctPanelCtlr.formLoaded(values);
    //}
  }
};

var conFormCtlr = {
  frm: null,
  gridSelection: null,

  init: function() {
    this.frm = $$("conForm");
  },

  clear: function() {
    this.frm.clear();
    conMgtPanelCtlr.clearMatches();
  },

  load: function(contact) {
    this.gridSelection = contact;
    var vals = {
      id: contact.id,
      last: contact.last_name,
      first: contact.first_name,
      middle: contact.middle_name,
      suffix: contact.name_suffix,
      nickname: contact.nickname,
      address: contact.address,
      city: contact.city,
      zipcode: contact.zipcode,
      email: contact.email,
      phone1: phone_prettify(contact.phone1),
      phone2: phone_prettify(contact.phone2)
    };
    this.frm.setValues(vals, true);
  },

  setFields: function(match) {
    var vals = {};
    if (match.name)
      vals.name = match.name;
    vals.address = match.address;
    vals.city = match.city;
    vals.zipcode = match.zipcode;
    vals.jurisdiction = precincts[match.precinct_id].jurisdiction_name;
    vals.ward = precincts[match.precinct_id].ward;
    vals.precinct = precincts[match.precinct_id].precinct;
    this.frm.setValues(vals, true);
  },

  getValues: function() {
    return this.frm.getValues();
  },

  getGridSelection: function() {
    return this.gridSelection;
  }

};

/*=====================================================================
Volunteer Form Panel
=====================================================================*/
var conFormPanel = {
  rows: [conFormToolbar, conForm]
};

var conFormPanelCtlr = {
  init: function() {
    conFormToolbarCtlr.init();
    conFormCtlr.init();
  },

  clear: function() {
    conFormCtlr.clear();
    conMatchGridCtlr.clear();
  }
};
