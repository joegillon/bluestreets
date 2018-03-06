/**
 * Created by Joe on 12/17/2017.
 */

/*=====================================================================
Voter Fields Property Sheet
=====================================================================*/
var voterFldsPropSheet = {
  view: "property",
  id: "voterFldsPropSheet",
  width: 300,
  height: 300,
  elements: [
    {label: "Bluestreets <-- Spreadsheet", type: "label"},
    {
      type: "combo",
      id: "last_name",
      label: "Last Name",
      options: []
    },
    {
      type: "combo",
      id: "first_name",
      label: "First Name",
      options: []
    },
    {
      type: "combo",
      id: "middle_name",
      label: "Middle Name",
      options: []
    },
    {
      type: "combo",
      id: "name_suffix",
      label: "Name Suffix",
      options: []
    },
    {
      type: "combo",
      id: "address",
      label: "Address",
      options: []
    },
    {
      type: "combo",
      id: "city",
      label: "City",
      options: []
    },
    {
      type: "combo",
      id: "zipcode",
      label: "Zip",
      options: []
    }
  ]
};

/*=====================================================================
Voter Fields Property Sheet Controller
=====================================================================*/
var voterFldsPropSheetCtlr = {
  sheet: null,
  myOptions: [],

  init: function() {
    this.sheet = $$("voterFldsPropSheet");
  },

  clear: function() {

  },

  load: function(csvFlds) {
    var values = {};
    for (var i=0; i<csvFlds.length; i++) {
      if (/^last/.test(csvFlds[i].toLowerCase())) {
        values["last_name"] = csvFlds[i];
      }
      else if (/^first/.test(csvFlds[i].toLowerCase())) {
        values["first_name"] = csvFlds[i];
      }
      else if (/^mid/.test(csvFlds[i].toLowerCase())) {
        values["middle_name"] = csvFlds[i];
      }
      else if (csvFlds[i].toLowerCase().indexOf("suf") != -1) {
        values["name_suffix"] = csvFlds[i];
      }
      else if (/^add/.test(csvFlds[i].toLowerCase())) {
        values["address"] = csvFlds[i];
      }
      else if (/^city/.test(csvFlds[i].toLowerCase())) {
        values["city"] = csvFlds[i];
      }
      else if (/^zip/.test(csvFlds[i].toLowerCase())) {
        values["zipcode"] = csvFlds[i];
      }
    }

    this.sheet.setValues(values);

    var elements = this.sheet.config.elements;
    for (var i=0; i<elements.length; i++) {
      if (elements[i].type == "combo") {
        elements[i].options = csvFlds;
      }
    }

  },

  save: function() {
    voterCsvGridCtlr.setMappings(this.sheet.getValues());
    voterDropSiteToolbarCtlr.enableLoad();
    voterFldsPopupCtlr.hide();
  }

};

/*=====================================================================
Voter Fields Panel
=====================================================================*/
var voterFldsPanel = {
  rows: [
    voterFldsPropSheet
  ]
};

/*=====================================================================
Voter Fields Panel Controller
=====================================================================*/
var voterFldsPanelCtlr = {
  init: function() {
    voterFldsPropSheetCtlr.init();
  }
};
