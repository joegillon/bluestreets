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
      id: "conFormClearBtn",
      label: "Clear",
      width: 60
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
      label: "COA",
      width: 60,
      click: "conFormToolbarCtlr.coa();"
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
    var values = this.getValues();
    if (values.id != "") {
      // TODO: if not confirmed return
      // TODO: drop contact from DB
      this.clear();
      conGridCtlr.drop(values.id);
    }
  },

  email: function() {
    var values = this.getValues();
    if (values.id == "") {
      this.clear();
      return;
    }
    // TODO: email contact
  },

  coa: function() {
    coaPopupCtlr.show();
  },

  submit: function() {
    if (!conFormCtlr.validate()) return;
    var vals = conFormCtlr.getValues({hidden: true});
    var pct_id = "";
    if (vals.precinct) {
      pct_id = streetsCollection.find(
        {pct_name: vals.precinct},
        {_id: 0, precinct_id: 1}
      )[0].precinct_id;
    }

    if (vals.id != "") {
      var rec = contactsCollection.findOne({id: vals.id});
      if (vals.address != rec.address || vals.city != rec.city) {
        var pct = this.getPrecinct();

      }
    }
    //var gridSelection = conFormCtlr.getGridSelection();
    //
    //if (vals.id == "" || vals.address != gridSelection.address) {
    //
    //}
    //
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
      address: vals.address,
      precinct_id: pct_id
    };
    ////vals = $$("conCGrid").getSelectedItem();
    ////params.address = vals.address;
    ////params.city = vals.city;
    ////params.zipcode = vals.zipcode;
    ////params.birth_year = vals.birth_year;
    ////params.gender = vals.gender;
    ////params.voter_id = vals.voter_id;
    ////params.precinct_id = vals.precinct_id;
    ////params.reg_date = vals.reg_date;

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.grid");

    ajaxDao.post(url, params, function(data) {
      conPrecinctPanelCtlr.removeItem();
    });

    // TODO: check if address change -> precinct change

    //conFormCtlr.add(contact);
    // conFormCtlr.update(contact);
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
          name: "id"
        },
        {
          view: "text",
          label: "Email",
          name: "email",
          width: 200,
          invalidMessage: "Invalid email address!",
          on: {
            onBlur: function() {
              conMatchPanelCtlr.emailMatch(this.getValue());
            }
          }
        },
        {
          view: "text",
          label: "Phone 1",
          name: "phone1",
          width: 130,
          invalidMessage: "Invalid phone 1!",
          on: {
            onTimedKeypress: function() {
              this.setValue(phoneMask(this.getValue()));
            },
            onBlur: function() {
              conMatchPanelCtlr.phoneMatch(phone_uglify(this.getValue()));
            }
          }
        },
        {
          view: "text",
          label: "Phone 2",
          name: "phone2",
          width: 130,
          invalidMessage: "Invalid phone 2!",
          on: {
            onTimedKeypress: function() {
              this.setValue(phoneMask(this.getValue()));
            },
            onBlur: function() {
              conMatchPanelCtlr.phoneMatch(phone_uglify(this.getValue()));
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
          invalidMessage: "Address does not exist!",
          on: {
            onTimedKeyPress: function() {
              this.setValue(this.getValue().toUpperCase());
            },
            onBlur: function() {
              conMatchPanelCtlr.addressMatch(this.getValue());
            }
          }
        },
        {
          view: "select",
          label: "City",
          name: "city",
          width: 100,
          options: []
        },
        {
          view: "select",
          label: "Zip",
          name: "zipcode",
          width: 70,
          options: []
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          label: "Last",
          name: "last",
          required: true,
          invalidMessage: "Last name is required!",
          on: {
            onKeyPress: function(code) {
              return handleNameInput(code, this);
            },
            onBlur: function() {
              conMatchPanelCtlr.lastNameMatch(this.getValue());
            }
          }
        },
        {
          view: "text",
          label: "First",
          name: "first",
          width: 180,
          required: true,
          invalidMessage: "First name is required!",
          on: {
            onKeyPress: function(code) {
              return handleNameInput(code, this);
            }
          }
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          label: "Middle",
          name: "middle",
          width: 180,
          invalidMessage: "Invalid middle name characters!",
          on: {
            onKeyPress: function(code) {
              return handleNameInput(code, this);
            }
          }
        },
        {
          view: "text",
          label: "Suffix",
          name: "suffix",
          width: 60,
          on: {
            onTimedKeyPress: function() {
              this.setValue(this.getValue().toUpperCase());
            }
          }
        },
        {
          view: "text",
          label: "Nickname",
          name: "nickname",
          invalidMessage: "Invalid nickname characters!",
          on: {
            onKeyPress: function(code) {
              return handleNameInput(code, this);
            }
          }
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          label: "Precinct",
          name: "precinct",
          readonly: true
        }
      ]
    }
  ],
  rules: {
    email: webix.rules.isEmail,
    phone1: function(value) {
      return isPhone(value);
    },
    phone2: function(value) {
      return isPhone(value);
    },
    address: function(value) {
      return value == "" || isValidAddress(
        value,
        this.elements.city.getValue(),
        this.elements.zipcode.getValue()
      );
    },
    last: webix.rules.isNotEmpty,
    first: webix.rules.isNotEmpty
  },
  elementsConfig: {
    labelPosition: "top",
    attributes: {autocomplete: "new-password"}
  }
};

var conFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("conForm");
    this.frm.elements["city"].define("options", cityOptions);
    this.frm.elements["city"].refresh();
    this.frm.elements["zipcode"].define("options", zipcodeOptions);
    this.frm.elements["zipcode"].refresh();
  },

  // This func is called by the global event handler in the mgt panel
  clear: function() {
    this.frm.clear();
    this.frm.clearValidation();
    conMatchPanelCtlr.clear();
    this.locationReadOnly(false);
  },

  locationReadOnly: function(value) {
    var theForm = this.frm;
    ["address", "city", "zipcode"].forEach(function(ctl) {
      if (value) {
        theForm.elements[ctl].disable();
      } else {
        theForm.elements[ctl].enable();
      }
      theForm.elements[ctl].refresh();
    });
  },

  loadContact: function(contactId) {
    var contact = contactsCollection.findOne({id: contactId});
    var vals = {
      id: contact.id,
      last: contact.name.last,
      first: contact.name.first,
      middle: contact.name.middle,
      suffix: contact.name.suffix,
      nickname: contact.name.nickname,
      address: contact.address["whole_addr"],
      city: contact.address["city"],
      zipcode: contact.address["zipcode"],
      email: contact.contact_info.email,
      phone1: phone_prettify(contact.contact_info.phone1),
      phone2: phone_prettify(contact.contact_info.phone2),
      precinct: contact.voter_info.precinct_name
    };
    this.frm.setValues(vals, true);
    this.locationReadOnly(true);
    conMatchGridCtlr.config("C");
  },

  loadVoter: function(voter) {
    var vals = {
      last: voter.name.last,
      first: voter.name.first,
      middle: voter.name.middle,
      suffix: voter.name.suffix,
      address: voter.address.whole_addr,
      city: voter.address.city,
      zipcode: voter.address.zipcode,
      precinct: voter.voter_info.precinct_name
    };
    this.frm.setValues(vals, true);
    //this.frm.setValues(voter, true);
    this.locationReadOnly(true);

    // TODO: set name fields to readonly
  },

  loadStreet: function(street) {
    var rec = streetsCollection.findOne(
      {precinct_id: street.precinct_id}
    );
    var vals = {
      address: parseAddress.parseLocation(this.frm.elements.address.getValue()).number +
        " " + street.address,
      precinct: rec.pct_name,
      city: rec.city,
      zipcode: rec.zipcode
    };
    this.frm.setValues(vals, true);
  },

  validate: function() {
    return this.frm.validate();
  },

  getValues: function() {
    return this.frm.getValues();
  }

};

/*=====================================================================
Contact Form Panel
=====================================================================*/
var conFormPanel = {
  rows: [conFormToolbar, conForm]
};

var conFormPanelCtlr = {
  init: function() {
    conFormToolbarCtlr.init();
    conFormCtlr.init();
  }
};
