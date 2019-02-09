/**
 * Created by Joe on 9/26/2017.
 */

var grpViewPanelCtlr = {
  panel: null,

  init: function() {
    console.log("grpViewPanelCtrl.init()");
    this.panel = $$("grpViewPanel");
    grpListPanelCtlr.init();
    grpDetailsPanelCtlr.init();
    $$("grpDetailsForm").bind($$("grpList"));
  }
};

var memViewPanelCtlr = {
  panel: null,

  init: function() {
    console.log("memViewPanelCtlr.init()");
    this.panel = $$("memViewPanel");
    memListPanelCtlr.init();
    memDetailsPanelCtlr.init();
    //memDetailsForm.bind(memList);
  }
};

var grpMgtPanelCtlr = {
  panel: null,

  init: function() {
    console.log("grpMgtPanelCtlr.init()");
    this.panel = $$("grpMgtPanel");
    build_db();
    grpViewPanelCtlr.init();
    memViewPanelCtlr.init();
  }
};