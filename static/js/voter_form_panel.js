/**
 * Created by Joe on 8/7/2017.
 */

/*=====================================================================
Voter Form
=====================================================================*/
var voterForm = {
  view: "form",
  id: "voterForm",
  elementsConfig: {
    labelPosition: "top"
  },
  elements: [
    namesLine,
    addressLine
  ]
};

/*=====================================================================
Voter Form Controller
=====================================================================*/
var voterFormCtlr = {
  form: null,

  init: function() {
    this.form = $$("voterForm");
  },

  clear: function() {
    this.form.clear();
    voterMatchGridCtlr.clear();
  },

  submit: function() {
    var elements = this.form.elements;

    var params = {
      last_name: elements["last_name"].getValue(),
      first_name: elements["first_name"].getValue(),
      middle_name: elements["middle_name"].getValue(),
      address: elements['address'].getValue(),
      city: elements['city'].getValue(),
      zip: elements['zip'].getValue()
    };

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for('vtr.lookup', params);
    ajaxDao.get(url, function(data) {
      voterMatchGridCtlr.show(data["matches"]);
    });
  },

  load: function(values) {
    this.form.setValues({
      last_name: values.last_name,
      first_name: values.first_name,
      middle_name: values.middle_name,
      name_suffix: values.name_suffix,
      address: values.address,
      city: values.city,
      zipcode: values.zipcode
    });
  }
};

/*=====================================================================
Voter Form Toolbar
=====================================================================*/
var voterFormToolbar = {
  view: "toolbar",
  id: "voterFormToolbar",
  height: 35,
  elements: [
    {view: "label", label: "Voter Lookup"},
    {
      view: "button",
      label: "Clear",
      width: 100,
      click: function() {
        voterFormToolbarCtlr.clear();
      }
    },
    {
      view: "button",
      label: "Submit",
      width: 100,
      click: function () {
        voterFormCtlr.submit();
      }
    }
  ]
};

/*=====================================================================
Voter Form Toolbar Controller
=====================================================================*/
var voterFormToolbarCtlr = {
  init: function() {},

  clear: function() {
    voterFormCtlr.clear();
  }
};

/*=====================================================================
Voter Form Panel
=====================================================================*/
var voterFormPanel = {
  rows: [voterFormToolbar, voterForm]
};

var voterFormPanelCtlr = {
  init: function() {
    voterFormToolbarCtlr.init();
    voterFormCtlr.init();
  }
};
