/**
 * Created by Joe on 9/5/2017.
 */

/*=====================================================================
Voter Fields Popup
=====================================================================*/
var voterFldsPopup = {
  view: "window",
  id: "voterFldsPopup",
  move: true,
  resize: true,
  top: 20,
  left: 20,
  width: 600,
  head: {
    cols: [
      {
        view: "label",
        css: "popup_header",
        label: "Assign Fields"
      },
      {
        view: "button",
        value: "Cancel",
        click: "$$('voterFldsPopup').hide();"
      },
      {
        view: "button",
        value: "OK",
        click: "voterFldsPropSheetCtlr.save();"
      }
    ]
  },
  body: {
    cols: [ voterFldsPanel ]
  }
};

/*=====================================================================
Voter Fields Popup Controller
=====================================================================*/
var voterFldsPopupCtlr = {
  popup: null,

  init: function() {
    this.popup = $$("voterFldsPopup");
    this.popup.hide();
    voterFldsPanelCtlr.init();
  },

  show: function(csvFlds) {
    voterFldsPropSheetCtlr.load(csvFlds);
    this.popup.show();
  },

  hide: function() {
    this.popup.hide();
  }
};
