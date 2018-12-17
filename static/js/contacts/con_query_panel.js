/**
 * Created by Joe on 1/19/2018.
 */

/*=====================================================================
Contact Query Panel
=====================================================================*/
var contactQueryPanel = {
  cols: [
    jurisdictionPanel,
    wardPanel,
    precinctPanel,
    streetsPanel,
    houseNumsPanel
  ]
};

/*=====================================================================
Contact Query Panel Controller
=====================================================================*/
var contactQueryPanelCtlr = {
  init: function() {
    jurisdictionPanelCtlr.init(wardListCtlr.load);
    jurisdictionListCtlr.load();
    wardPanelCtlr.init();
    precinctPanelCtlr.init();
    streetsPanelCtlr.init();
    houseNumsPanelCtlr.init(this.export);
  },

  export: function() {
    var args = contactQueryPanelCtlr.getArgs();
    if (args === null) {
      return;
    }

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    var url = Flask.url_for("con.con_get", args);

    ajaxDao.get(url, function(data) {
      if (data["contacts"].length == 0) {
        webix.message("No contacts for criteria. Sorry.");
        return;
      }

      var filename = prompt("Enter a filename", "Data");
      if (filename === null) {
        return;
      }

      var cols = [
        {id: "Name"},
        {id: "Email"},
        {id: "Phone 1"},
        {id: "Phone 2"},
        {id: "Address"},
        {id: "City"},
        {id: "Zip"},
        {id: "Jurisdiction"},
        {id: "Ward"},
        {id: "Precinct"},
        {id: "Groups"},
        {id: "Gender"},
        {id: "Birth Yr"}
      ];
      csvExportTableCtlr.export(filename, data["contacts"], cols);
    });
  },

  getArgs: function() {
    var args = {};
    var jurisdiction = jurisdictionListCtlr.getSelected();
    if (jurisdiction === undefined) {
      webix.message({type: "error", text: "Must select a jurisdiction!"});
      return null;
    }
    args.jurisdiction_code = jurisdiction.code;

    var ward_item = wardListCtlr.getSelected();
    if (ward_item === undefined) {
      return args;
    }
    args.ward_no = ward_item.ward;

    var precinct = precinctListCtlr.getSelected();
    if (precinct === undefined) {
      return args;
    }
    args.precinct_no = precinct.precinct;

    var blocks = houseNumsListCtlr.getSelected();
    if (blocks.length == 0) {
      return args;
    }

    blocks.forEach(function(block) {
      delete block.id;
      delete block.display;
      block.low_addr = parseInt(block.low_addr);
      block.high_addr = parseInt(block.high_addr);
    });
    args.blocks = JSON.stringify(blocks);

    return args;
  }

};
