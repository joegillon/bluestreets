/**
 * Created by Joe on 5/25/2017.
 */

/*=====================================================================
Address Form
=====================================================================*/
var addrForm = {
  view: "form",
  id: "addrForm",
  elements: [addressLine]
};

/*=====================================================================
Address Form Controller
=====================================================================*/
var addrFormCtlr = {
  init: function() {},

  clear: function() {
    $$("addrForm").clear();
  },

  submit: function() {
    var frm = $$("addrForm");
    if (!frm.validate()) {
      return;
    }

    var vals = frm.getValues();
    vals["address"] = vals["address"].toUpperCase();
    if (vals["city"] == "" && vals["zip"] == "") {
      webix.message({type: "error", text: "Need a city and/or zip!"});
      return;
    }
    turfListCtlr.clear();

    var url = Flask.url_for('qry.addr_lookup');
    webix.ajax().sync().post(url,
      {
        address: vals["address"],
        city: vals["city"],
        zip: vals["zip"]
      },
      {
        error: function (text, data, XmlHttpRequest) {
          msg = "Error " + XmlHttpRequest.status + ": " + XmlHttpRequest.statusText;
          webix.message({type: "error", text: msg});
        },
        success: function(text, data, XmlHttpRequest) {
          if (text != "None") {
            turfListCtlr.load(data.json());
          }
        }
      }
    );
  }
};

/*=====================================================================
Address Form Toolbar
=====================================================================*/
var addrFormToolbar = {
  view: "toolbar",
  id: "addrFormToolbar",
  height: 35,
  elements: [
    {view: "label", label: "Street Lookup"},
    {
      view: "button",
      label: "Clear",
      width: 100,
      click: function() {
        addrFormCtlr.clear();
      }
    },
    {
      view: "button",
      label: "Submit",
      width: 100,
      click: function() {
        addrFormCtlr.submit();
      }
    },
    {
      view: "button",
      label: "Help",
      width: 100,
      popup: addrFormHelpPopup
    }
  ]
};

/*=====================================================================
Address Form Toolbar Controller
=====================================================================*/
var addrFormToolbarCtlr = {
  init: function() {
    //$$("addrFormHelpPopup").hide();
  }
};

/*=====================================================================
Address Form Help Popup
=====================================================================*/
var addrFormHelpPopup = {
  view: "popup",
  id: "addrHelpPopup",
  height: 300,
  body: {
    template: helpText
  }
};

var helpText = "Enter a street address and at least a\n" +
               "city or zipcode, or both. Then click Submit. No result\n" +
               "means invalid address, usually an incorrect street address.\n" +
               "Street address has up to 6 parts:\n" +
               "<ul>\n" +
               "<li>House number (required)</li>\n" +
               "<li>Directional prefix (N, S, E, W)</li>\n" +
               "<li>Street Name (required)</li>\n" +
               "<li>Street Type (AVE, RD, ST, etc.)</li>\n" +
               "<li>Directional suffix (N, S, E, W)\n" +
               "<li>Unit number (Apt 3, #6, etc.)\n" +
               "</ul>\n" +
               "Periods are automatically removed.";

/*=====================================================================
Address Form Panel
=====================================================================*/
var addrFormPanel = {
  rows: [addrFormToolbar, addrForm]
};

/*=====================================================================
Address Form Panel Controller
=====================================================================*/
var addrFormPanelCtlr = {
  init: function() {
    addrFormToolbarCtlr.init();
    addrFormCtlr.init();
  }
};