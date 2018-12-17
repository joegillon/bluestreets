/**
 * Created by Joe on 2/15/2018.
 */

/*=====================================================================
Contact Crewboard Panel
=====================================================================*/
var conCrewboardPanel = {
  cols: [conCrewListPanel, conCrewSlotsPanel]
};

/*=====================================================================
Contact Crewboard Panel Controller
=====================================================================*/
var conCrewboardPanelCtlr = {
  init: function() {
    conCrewListPanelCtlr.init();
    conCrewSlotsPanelCtlr.init();
  }
};
