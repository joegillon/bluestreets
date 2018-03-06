/**
 * Created by Joe on 10/2/2017.
 */

/*=====================================================================
CSV Export Table
=====================================================================*/
var csvExportTable = {
  view: "datatable",
  id: "csvExportTable",
  datatype: "csv"
};

/*=====================================================================
CSV Export Table Controller
=====================================================================*/
var csvExportTableCtlr = {
  tbl: null,

  init: function () {
    this.tbl = $$("csvExportTable");
    this.tbl.hide();
  },

  clear: function () {
    this.tbl.clearAll();
  },

  loadColumns: function(jsonData) {
    var cols = [];
    Object.keys(jsonData).forEach(function(key) {
      if (key != "id") {
        cols.push({
          id: key,
          header: key
        })
      }
    });
    this.tbl.define("columns", cols);
  },

  load: function(jsonData) {
    this.clear();
    this.tbl.parse(jsonData);
  },

  export: function(jsonData, columns) {
    var filename = prompt("Enter a filename", "Data");
    if (filename === null) {
      return;
    }
    this.loadColumns(jsonData[0]);
    webix.storage.local.put(filename, columns);
    var x = webix.storage.local.get(filename);
    this.load(jsonData);
    webix.csv.delimiter.rows = "\n";
    webix.csv.delimiter.cols = ",";
    webix.toCSV(this.tbl, {
      ignore: {"id": true},
      filename: filename
    });
  }

};