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
    jurisdictionPanelCtlr.init();
    precinctPanelCtlr.init();
    streetsPanelCtlr.init();
    houseNumsPanelCtlr.init();
  }
};
