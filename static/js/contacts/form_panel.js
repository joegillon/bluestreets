/**
 * Created by Joe on 11/11/2017.
 */

/*=====================================================================
Contact Form
=====================================================================*/
var conForm = {
  view: "form",
  id: "conForm",
  elements: [
    {
      view: "text",
      label: "Last",
      name: "last"
    },
    {
      view: "text",
      label: "First",
      name: "first"
    },
    {
      cols: [
        {
          view: "text",
          label: "Middle",
          name: "middle"
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
    },
    {
      cols: [
        {
          view: "text",
          label: "Address",
          name: "address",
          width: 300
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
          label: "Email",
          name: "email",
          width: 200
        },
        {
          view: "text",
          label: "Phone 1",
          name: "phone1",
          width: 130
        },
        {
          view: "text",
          label: "Phone 2",
          name: "phone2",
          width: 130
        }
      ]
    }
  ],
  elementsConfig: {labelPosition: "top"},
  on: {
    onValues: function() {
      var values = this.getValues();
      if (values.id)
        conPrecinctPanelCtlr.formLoaded(values);
    }
  }
};

/*=====================================================================
Contact Form Controller
=====================================================================*/
var conFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("conForm");
  },

  clear: function() {
    this.frm.clear();
  },

  load: function(contact) {
    var vals = {
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
    }
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

  drop: function() {

  },

  submit: function() {
    var vals = this.frm.getValues({hidden: true});
    var params = {
      id: vals.id,
      last_name: vals.last_name,
      first_name: vals.first_name,
      middle_name: vals.middle_name,
      name_suffix: vals.name_suffix,
      email: vals.email,
      phone1: vals.phone1,
      phone2: vals.phone2
    };
    vals = $$("conMatchGrid").getSelectedItem();
    params.address = vals.address;
    params.city = vals.city;
    params.zipcode = vals.zipcode;
    params.birth_year = vals.birth_year;
    params.gender = vals.gender;
    params.voter_id = vals.voter_id;
    params.precinct_id = vals.precinct_id;
    params.reg_date = vals.reg_date;

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.assign_precinct");

    ajaxDao.post(url, params, function(data) {
      conPrecinctPanelCtlr.removeItem();
    });

  }
};

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
      label: "New",
      width: 60,
      click: "conGridCtlr.reselect();"
    },
    {
      view: "button",
      label: "Drop",
      width: 60,
      click: "conFormCtlr.drop();"
    },
    {
      view: "button",
      label: "Email",
      width: 60,
      click: "conFormCtlr.drop();"
    },
    {
      view: "button",
      label: "Submit",
      width: 60,
      click: "conFormCtlr.submit();"
    }
  ]
};

/*=====================================================================
Contact Form Toolbar Controller
=====================================================================*/
var conFormToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("conFormToolbar");
  }
};

/*=====================================================================
Volunteer Form Panel
=====================================================================*/
var conFormPanel = {
  rows: [conFormToolbar, conForm]
};

/*=====================================================================
Volunteer Form Panel Controller
=====================================================================*/
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
