/**
 * Created by Joe on 12/23/2018.
 */
/* conDetailPanel: conFormPanel, conMatchPanel */

/*=====================================================================
Contact Detail Panel
=====================================================================*/
var conDetailPanel = {
  rows: [conFormPanel, conMatchPanel]
};

var conDetailPanelCtlr = {
  init: function() {
    conFormPanelCtlr.init();
    conMatchPanelCtlr.init();
  }
};

