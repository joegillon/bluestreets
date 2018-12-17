/**
 * Created by Joe on 5/28/2018.
 */

/*=====================================================================
Contact List
=====================================================================*/
var conList = {
  view: "list",
  id: "conList",
  select: "row",
  height: 500,
  width: 300,
  tooltip: true,
  template: "#whole_name#",
  on: {
    onAfterSelect: function() {
      conListCtlr.selected();
    }
  }
};

/*=====================================================================
Contact List Controller
=====================================================================*/
var conListCtlr = {
  list: null,

  init: function() {
    this.list = $$("conList");
    this.load(contacts);
  },

  load: function(contacts) {
    this.clear();
    this.list.parse(contacts);
  },

  selected: function() {
    voterFormCtlr.load(this.list.getSelectedItem());
  }

};

/*=====================================================================
Contact Missing Voter ID Panel
=====================================================================*/
var conMissingVoterIdPanel = {
  cols: [
    conList,
    {
      rows: [
        voterFormPanel,
        voterMatchPanel
      ]
    }
  ]
};

/*=====================================================================
Contact Missing Voter ID Panel Controller
=====================================================================*/
var conMissingVoterIdPanelCtlr = {
  init: function() {
    conListCtlr.init();
    voterFormPanelCtlr.init();
    voterMatchPanelCtlr.init();
  }
};
