/**
 * Created by Joe on 12/17/2017.
 */

/*=====================================================================
Voter Match Popup
=====================================================================*/
var voterMatchPopup = {
  view: "window",
  id: "voterMatchPopup",
  move: true,
  resize: true,
  top: 20,
  left: 20,
  width: 200,
  height: 300,
  position: "center",
  modal: true,
  head: {
    cols: [
      {
        view: "label",
        css: "popup_header",
        label: "Voter Matches"
      },
      {
        view: "button",
        value: "OK",
        click: "voterMatchPopupCtlr.hide();"
      }
    ]
  },
  body: {
    cols: [ conMatchGrid ]
  }
};

/*=====================================================================
Voter Match Popup Controller
=====================================================================*/
var voterMatchPopupCtlr = {
  popup: null,

  init: function() {
    this.popup = $$("voterMatchPopup");
    this.popup.hide();
    conMatchGridCtlr.init();
  },

  show: function(matches) {
    conMatchGridCtlr.show("voter", matches);
    this.popup.show();
  },

  hide: function() {
    this.popup.hide();
  }
};
