/* conMgtPanel: conGridPanel, conDetailPanel */

/*=====================================================================
Contact Management Panel
=====================================================================*/
var conMgtPanel = {
  cols: [conGridPanel, conDetailPanel]
};

var conMgtPanelCtlr = {
  init: function() {
    conGridPanelCtlr.init();
    conDetailPanelCtlr.init();
  }
};

