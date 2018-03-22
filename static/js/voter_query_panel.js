/**
 * Created by Joe on 1/19/2018.
 */

/*=====================================================================
Voter Query Panel
=====================================================================*/
var voterQueryPanel = {
  cols: [
    jurisdictionPanel,
    precinctPanel,
    streetsPanel,
    houseNumsPanel
  ]
};

/*=====================================================================
Voter Query Panel Controller
=====================================================================*/
var voterQueryPanelCtlr = {
  init: function() {
    precinctPanelCtlr.init();
    jurisdictionPanelCtlr.init(precinctListCtlr.load);
    streetsPanelCtlr.init();
    houseNumsPanelCtlr.init();
  }
};
