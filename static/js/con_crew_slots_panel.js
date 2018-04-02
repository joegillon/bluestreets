/**
 * Created by Joe on 3/5/2018.
 */

/*=====================================================================
 Contact Crew PD Grid
 =====================================================================*/
var crewPDGrid = {
  view: "datatable",
  id: "crewPDGrid",
  drag: "target",
  columns: [
    {
      id: "jurisdiction_name",
      header: "Jurisdiction",
      editor: "text",
      adjust: true
    },
    {
      id: "ward",
      header: "Ward",
      readonly: true,
      adjust: true
    },
    {
      id: "precinct",
      header: "Pct",
      readonly: true,
      adjust: true
    },
    {
      id: "slots",
      header: "Slots",
      editor: "text",
      adjust: true
    },
    {
      id: "previous",
      header: "Previous",
      editor: "text",
      adjust: true
    },
    {
      id: "open_slots",
      header: "Open",
      editor: "text",
      adjust: true
    },
    {
      id: "filed",
      header: "Filed",
      editor: "text",
      adjust: true
    }
  ]
};

/*=====================================================================
 Contact Crew PD Grid Controller
 =====================================================================*/
var crewPDGridCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("crewPDGrid");
    this.grid.parse(precincts);

    this.grid.attachEvent("onBeforeDrop", function(context, ev) {
      var targetInfo = this.locate(ev);
      if (!targetInfo) {
        webix.message("Delete ID " + this.sourceInfo.row.toString());
        return false;
      }
      var col = targetInfo.column;
      var item = this.getItem(targetInfo.row);
      item[col] = context.value["whole_name"];
      this.updateItem(targetInfo.row, item);
      return false;
    });
  },

  add: function(row, col, value) {
    var old = this.grid.getI
  }


};

/*=====================================================================
 Contact Crew PD Panel
 =====================================================================*/
var crewPDPanel = {
  rows: [crewPDGrid]
};

/*=====================================================================
 Contact Crew PD Panel
 =====================================================================*/
var crewPDPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("crewPDPanel");
    crewPDGridCtlr.init();
  }
};

/*=====================================================================
 Contact Crew CC Grid
 =====================================================================*/
var crewCCGrid = {
  view: "datatable",
  id: "crewCCGrid",
  columns: [
    {
      id: "jurisdiction_name",
      header: "Jurisdiction",
      editor: "text",
      adjust: true
    },
    {
      id: "ward",
      header: "Ward",
      readonly: true,
      adjust: true
    },
    {
      id: "precinct",
      header: "Pct",
      readonly: true,
      adjust: true
    },
    {
      id: "cc_names",
      header: "Members",
      editor: "text",
      adjust: true
    }
  ]
};

/*=====================================================================
 Contact Crew CC Grid Controller
 =====================================================================*/
var crewCCGridCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("crewCCGrid");
    this.grid.parse(precincts);
  }
};

/*=====================================================================
 Contact Crew CC Panel
 =====================================================================*/
var crewCCPanel = {
  rows: [crewCCGrid]
};

/*=====================================================================
 Contact Crew CC Panel Controller
 =====================================================================*/
var crewCCPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("crewCCPanel");
    crewCCGridCtlr.init();
  }
};

/*=====================================================================
 Contact Crew Ward Grid
 =====================================================================*/
var crewWardGrid = {
  view: "datatable",
  id: "crewWardGrid",
  columns: [
    {
      id: "jurisdiction_name",
      header: "Jurisdiction",
      editor: "text",
      adjust: true
    },
    {
      id: "ward",
      header: "Ward",
      readonly: true,
      adjust: true
    },
    {
      id: "ward_names",
      header: "Members",
      editor: "text",
      adjust: true
    }
  ]
};

/*=====================================================================
 Contact Crew Ward Grid Controller
 =====================================================================*/
var crewWardGridCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("crewWardGrid");
    this.grid.parse(precincts);
  }
};

/*=====================================================================
 Contact Crew Ward Panel
 =====================================================================*/
var crewWardPanel = {
  rows: [crewWardGrid]
};

/*=====================================================================
 Contact Crew Ward Panel Controller
 =====================================================================*/
var crewWardPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("crewWardPanel");
    crewWardGridCtlr.init();
  }
};

/*=====================================================================
 Contact Crew Other Grid
 =====================================================================*/
var crewOtherGrid = {
  view: "datatable",
  id: "crewOtherGrid",
  columns: [
    {
      id: "jurisdiction_name",
      header: "Jurisdiction",
      editor: "text",
      adjust: true
    },
    {
      id: "ward",
      header: "Ward",
      readonly: true,
      adjust: true
    },
    {
      id: "precinct",
      header: "Pct",
      readonly: true,
      adjust: true
    },
    {
      id: "oth_names",
      header: "Others",
      editor: "text",
      adjust: true
    }
  ]
};

/*=====================================================================
 Contact Crew Other Grid Controller
 =====================================================================*/
var crewOtherGridCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("crewOtherGrid");
    this.grid.parse(precincts);
  }
};

/*=====================================================================
 Contact Crew Other Panel
 =====================================================================*/
var crewOtherPanel = {
  rows: [crewOtherGrid]
};

/*=====================================================================
 Contact Crew Other Panel Controller
 =====================================================================*/
var crewOtherPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("crewOtherPanel");
    crewOtherGridCtlr.init();
  }
};

/*=====================================================================
 Contact Crew Slots Views
 =====================================================================*/
var conCrewSlotsPDView = {
  id: "conCrewSlotsPDView",
  rows: [crewPDPanel]
};

var conCrewSlotsCCView = {
  id: "conCrewSlotsCCView",
  rows: [crewCCPanel]
};

var conCrewSlotsWardView = {
  id: "conCrewSlotsWardView",
  rows: [crewWardPanel]
};

var conCrewSlotsOtherView = {
  id: "conCrewSlotsOtherView",
  rows: [crewOtherPanel]
};

/*=====================================================================
 Contact Crew Slots Panel
 =====================================================================*/
var conCrewSlotsPanel = {
  rows: [
    {
      view: "segmented",
      id: "conCrewSlotsPanel",
      value: "conCrewSlotsPDView",
      multiview: true,
      align: "center",
      padding: 5,
      options: [
        {value: "PD", id: "conCrewSlotsPDView"},
        {value: "CC", id: "conCrewSlotsCCView"},
        {value: "Ward", id: "conCrewSlotsWardView"},
        {value: "Other", id: "conCrewSlotsOtherView"}
      ]
    },
    {height: 5},
    {
      cells: [
        conCrewSlotsPDView,
        conCrewSlotsCCView,
        conCrewSlotsWardView,
        conCrewSlotsOtherView
      ]
    }
  ]
};

/*=====================================================================
 Contact Crew Slots Panel Controller
 =====================================================================*/
var conCrewSlotsPanelCtlr = {
  panel: null,

  init: function () {
    this.panel = $$("conCrewSlotsPanel");
    crewPDPanelCtlr.init();
    crewCCPanelCtlr.init();
    crewWardPanelCtlr.init();
    crewOtherPanelCtlr.init();
  }
};