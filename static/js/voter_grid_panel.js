/**
 * Created by Joe on 6/15/2017.
 */

/*=====================================================================
Voter Grid Headers
=====================================================================*/
var voterGridHeaders = [
  "Name", "Address", "Gender", "Birth Year", "Party", "Perm Abs",
  "Status", "UOCAVA", "Reg Date", "Voter ID"
];

/*=====================================================================
Voter Grid Columns
=====================================================================*/
var voterColumns = {
  Name: {id: "name", header: "Name", adjust: true, sort: "string"},
  Address: {id: "address", header: "Address", adjust: true, sort: sortAddress},
  Gender: {id: "gender", header: "Gender", adjust: true},
  "Birth Year": {id: "birth_year", header: "Birth Year", adjust: true, sort: "int"},
  Party: {id: "party", header: "Party", adjust: true},
  "Perm Abs": {id: "permanent_absentee", header: "Perm Abs", adjust: true},
  Status: {id: "status", header: "Status", adjust: true},
  UOCAVA: {id: "uocava", header: "UOCAVA", adjust: true},
  "Reg Date": {id: "reg_date", header: "Reg Date", adjust: true},
  "Voter ID": {id: "voter_id", header: "Voter ID", adjust: true}
};

/*=====================================================================
Voter Grid
=====================================================================*/
var voterGrid = {
  view: "datatable",
  id: "voterGrid",
  columns: Object.values(voterColumns),
  select: "row",
  multiselect: true,
  minHeight: 400,
  autowidth: true
};

/*=====================================================================
Voter Grid Controller
=====================================================================*/
var voterGridCtlr = {
  grid: null,
  elections: null,
  all_voters: null,
  selections: null,

  init: function() {
    this.grid = $$("voterGrid");
  },

  clear: function() {
    this.grid.clearAll();
  },

  load: function(voters) {
    this.clear();
    this.grid.parse(voters);
    this.grid.adjust();
  },

  loadQuery: function(data) {
    this.addElectionColumns(data['elections']);
    this.all_voters = this.buildVoters(data);
    this.load(this.all_voters);
  },

  addElectionColumns: function(data) {
    var cols = Object.values(voterColumns).slice();
    data.forEach(function(election) {
      var parts = election.split(":");
      cols.push({
        id: parts[0],
        header: parts[0],
        adjust: "header",
        sort: "string"
      });
    });
    this.grid.config.columns = cols;
    this.grid.refreshColumns();
  },

  buildVoters: function(data) {
    var voters = [];
    data['voters'].forEach(function(rec) {
      var voter = {
        name: (rec[0] + ', ' +
               rec[1] + ' ' +
               rec[2] + ' ' +
               rec[3]).trim(),
        address: rec[4].trim(),
        gender: rec[7],
        birth_year: rec[8],
        party: rec[9],
        reg_date: rec[11],
        permanent_absentee: rec[12],
        status: rec[13],
        uocava: rec[14],
        voter_id: rec[10]
      };
      var i = 15;

      data['elections'].forEach(function(election) {
        var parts = election.split(":");
        voter[parts[0]] = rec[i++];
      });
      voters.push(voter);
    });

    return voters;
  },

  filter: function(value) {
    this.grid.filter(function(obj) {
      return obj["name"].toLowerCase().indexOf(value.toLowerCase()) == 0;
    })
  },

  rowView: function(rows) {
    if (rows == "all") {
      this.load(this.all_voters);
      this.reselect();
    }
    else {
      this.selections = this.grid.getSelectedItem(true);
      this.load(this.selections);
    }
  },

  clearSelections: function() {
    this.grid.clearSelection();
  },

  reselect: function() {
    var theGrid = this.grid;
    this.selections.forEach(function(item) {
      theGrid.select(item.id, true);
    })
  },

  newColumn: function() {
    var colname = prompt("Enter new column name", "");
    if (colname === null) {
      return;
    }
    var rows = this.grid.getSelectedItem(true);
    if (!rows) {
      webix.message({type: "error", text: "No selected rows!"});
      return;
    }
    this.grid.config.columns.push({
      id: colname,
      header: colname,
      adjust: "header",
      sort: "string"
    });
    this.grid.refreshColumns();

    var theGrid = this.grid;
    this.grid.data.each(function(item) {
      item[colname] = theGrid.isSelected(item.id) ? "Y" : "N";
    });
    theGrid.parse(this.all_voters);
    this.grid.data.each(function(item) {
      if (!item[colname]) {
        item[colname] = "N";
      }
    });
    this.grid.clearSelection();
    this.grid.refresh();
  },

  save: function() {
    exportGrid(this.grid);
  },

  open: function(fileData) {
    var lines = fileData.split("\n");
    var fldnames = this.buildColumns(lines[0]);
    var voters = [];
    lines.slice(1).forEach(function(line, idx) {
      var obj = {};
      var p = line.indexOf("\"", 1);
      obj.name = line.substring(0, p + 1).replace(/"/g, "");
      var vals = line.substring(p + 2).split(",");
      vals.forEach(function(val, idx) {
        obj[fldnames[idx + 1].id] = val;
      });
      voters.push(obj);
    });
    this.load(voters);
  },

  buildColumns: function(columnLine) {
    var cols = [];
    columnLine.split(",").forEach(function(colname) {
      if (voterGridHeaders.indexOf(colname) != -1) {
        cols.push(voterColumns[colname]);
      } else {
        cols.push({
          id: colname,
          header: colname,
          adjust: "header",
          sort: "string"
        })
      }
    });
    this.grid.config.columns = cols;
    this.grid.refreshColumns();
    return cols;
  },

  addVoter: function() {
    if (!lookupVoter) {
      webix.message({type: "error", text: "No voter has been looked up!"})
      return;
    }
    var currentItem = this.grid.getSelectedItem();
    if (!currentItem) {
      webix.message({type: "error", text: "No insert point selected!"})
      return;
    }
    var currentHouseNum = parseInt(currentItem.address).toString();
    var houseNum = prompt("House #:", currentHouseNum)
    lookupVoter['address'] = currentItem.address.replace(currentHouseNum, houseNum);
    lookupVoter['name'] = (lookupVoter['last_name'] + ", " +
        lookupVoter['first_name'] + " " +
        lookupVoter['middle_name'] + " " +
        lookupVoter['name_suffix']).trim();
    this.grid.add(lookupVoter, this.grid.getIndexById(currentItem.id));
  },

  dropVoter: function() {
    this.grid.remove(this.grid.getSelectedId());
  }
};

/*=====================================================================
Voter Grid Toolbar
=====================================================================*/
var voterGridToolbar = {
  view: "toolbar",
  id: "voterGridToolbar",
  height: 35,
  cols: [
    {
      view: "search",
      id: "voterGridFilter",
      placeholder: "Search...",
      width: 100,
      on: {
        onTimedKeyPress: function() {
          voterGridCtlr.filter(this.getValue());
        }
      }
    },
    {
      view: "template",
      template: '<input id="fileUpload" name="files[]" type="file">',
      width: 200
    },
    {
      view: "button",
      type: "icon",
      icon: "database",
      width: 25,
      tooltip: "Save to DB",
      click: "voterGridCtlr.save()"
    },
    {
      view: "button",
      type: "icon",
      icon: "floppy-o",
      width: 25,
      tooltip: "Save CSV",
      click: "voterGridCtlr.save()"
    },
    {
      view: "button",
      type: "icon",
      icon: "filter",
      tooltip: "Show selected rows",
      width: 25,
      click: "voterGridCtlr.rowView('')"
    },
    {
      view: "button",
      type: "icon",
      icon: "list-alt",
      tooltip: "Show all rows",
      width: 25,
      click: "voterGridCtlr.rowView('all')"
    },
    {
      view: "button",
      type: "icon",
      icon: "refresh",
      tooltip: "Clear selections",
      width: 25,
      click: "voterGridCtlr.clearSelections()"
    },
    {
      view: "button",
      type: "icon",
      icon: "columns",
      tooltip: "Choose columns",
      width: 25,
      click: "voterGridCtlr.chooseCols()"
    },
    {
      view: "button",
      type: "icon",
      icon: "user-plus",
      tooltip: "Add voter",
      width: 25,
      click: "voterGridCtlr.addVoter()"
    },
    {
      view: "button",
      type: "icon",
      icon: "user-times",
      tooltip: "Drop voter",
      width: 25,
      click: "voterGridCtlr.dropVoter()"
    },
    {
      view: "button",
      type: "icon",
      icon: "table",
      tooltip: "New column",
      width: 25,
      click: "voterGridCtlr.newColumn()"
    }
  ]
};

/*=====================================================================
Voter Grid Toolbar Controller
=====================================================================*/
var voterGridToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("voterGridToolbar");
    document.getElementById("fileUpload").addEventListener(
        "change", this.voterFileSelect, false);
  },

  voterFileSelect: function(e) {
    var reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = (function(theFile) {
      voterGridCtlr.open(theFile.target.result);
    });
  }
};

/*=====================================================================
Voter Grid Panel
=====================================================================*/
var voterGridPanel = {
  rows: [
    {
      type: "space",
      cols: [voterGridToolbar]
    },
    voterGrid
  ]
};

/*=====================================================================
Voter Grid Panel Controller
=====================================================================*/
var voterGridPanelCtlr = {
  init: function() {
    voterGridToolbarCtlr.init();
    voterGridCtlr.init();
  }
};
