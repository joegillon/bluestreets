/**
 * Created by Joe on 11/14/2017.
 */

/*=====================================================================
Voter Drop Site
=====================================================================*/
var voterDropSite = {
  view: "textarea",
  id: "voterDropSite",
  placeholder: "Drop spreadsheet here",
  labelAlign: "top",
  height: 300
};

/*=====================================================================
Voter Drop Site Controller
=====================================================================*/
var voterDropSiteCtlr = {
  dropSite: null,

  init: function () {
    this.dropSite = $$("voterDropSite");
    this.clear();
  },

  clear: function () {
    this.dropSite.setValue("");
  }
};

/*=====================================================================
Voter Drop Site Toolbar
=====================================================================*/
var voterDropSiteToolbar = {
  view: "toolbar",
  id: "voterDropSiteToolbar",
  height: 140,
  css: "bluestreets_toolbar",
  rows: [
    {view: "label", label: "Spreadsheet Drop Site"},
    {
      view: "button",
      value: "Map Fields",
      width: 100,
      click: "voterDropSiteToolbarCtlr.mapFlds()"
    },
    {
      view: "button",
      id: "loadTableButton",
      value: "Load Table",
      width: 100,
      disabled: true,
      click: "conCsvGridCtlr.load($$('voterDropSite').getValue());"
    },
    {
      view: "button",
      value: "Cancel",
      width: 100,
      click: "voterDropSiteCtlr.clear(); conCsvGridCtlr.clear();"
    }
  ]
};

/*====================================================================
 Voter Drop Site Toolbar Controller
=====================================================================*/
var voterDropSiteToolbarCtlr = {
  dropSite: null,

  init: function() {
    this.dropSite = $$("voterDropSite");
  },

  load: function() {
    voterImportGridCtlr.load(this.dropSite.getValue());
  },

  mapFlds: function() {
    var csvFlds = this.dropSite.getValue().split("\n")[0].split("\t");
    csvFlds = csvFlds.filter(function(x) {
      return x != "";
    });
    voterFldsPopupCtlr.show(csvFlds);
  },

  enableLoad: function() {
    $$("loadTableButton").enable();
  }

};

/*====================================================================
 Voter Drop Site Panel
=====================================================================*/
var voterDropSitePanel = {
  rows: [voterDropSiteToolbar, voterDropSite]
};

/*=====================================================================
Voter Drop Site Panel Controller
=====================================================================*/
var voterDropSitePanelCtlr = {
  init: function() {
    voterDropSiteCtlr.init();
    voterDropSiteToolbarCtlr.init();
  }
};
