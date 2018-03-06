/**
 * Created by Joe on 9/5/2017.
 */

/*=====================================================================
Voter List Popup
=====================================================================*/
var voterListPopup = {
  view: "window",
  id: "voterListPopup",
  move: true,
  resize: true,
  top: 20,
  left: 20,
  width: 600,
  head: {
    view: "label",
    css: "popup_header",
    label: "My Voter List"
  },
  body: {
    rows: [ voterListPanel ]
  }
};

/*=====================================================================
Voter List Popup Controller
=====================================================================*/
var voterListPopupCtlr = {
  init: function() {
    this.hide();
    voterListPanelCtlr.init();
  },

  show: function(data) {
    voterListPanelCtlr.load(data);
    $$("voterListPopup").show();
  },

  hide: function() {
    $$("voterList");
    $$("voterListPopup").hide();
  }
};
