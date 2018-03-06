/**
 * Created by Joe on 2/15/2018.
 */

/*=====================================================================
Contact Precinct Panel
=====================================================================*/
var conPrecinctPanel = {
  cols: [
    conGridPanel,
    {
      rows: [
        conFormPanel, conMatchPanel
      ]
    }
  ]
};

/*=====================================================================
Contact Precinct Panel Controller
=====================================================================*/
var conPrecinctPanelCtlr = {
  grid: null,
  form: null,
  matchGrid: null,

  init: function() {
    conGridPanelCtlr.init();
    conFormPanelCtlr.init();
    conMatchPanelCtlr.init();

    this.grid = $$("conGrid");
    this.form = $$("conForm");
    this.matchGrid = $$("conMatchGrid");

    this.form.bind(this.grid);

    this.precinctDict();
  },

  precinctDict: function() {
    var precinctDict = {};
    precincts.forEach(function(precinct) {
      precinctDict[precinct.id] = precinct;
    });
    precincts = precinctDict;
  },

  gridSelection: function() {
    conMatchPanelCtlr.clear();
  },

  formLoaded: function(values) {
    //conMatchPanelCtlr.getContactMatches(values);
  },

  matchFound: function(match) {
    conFormCtlr.setFields(match);
  },

  removeItem: function() {
    conGridCtlr.remove();
    conFormCtlr.clear();
  }

};
