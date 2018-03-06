/**
 * Created by Joe on 9/3/2017.
 */

/*=====================================================================
Voter CSV Columns
=====================================================================*/
var voterCsvColumns = [
  {
    id: "data0",
    header: "Last Name",
    adjust: "data"
  },
  {
    id: "data1",
    header: "First Name",
    adjust: "data"
  },
  {
    id: "data2",
    header: "Middle",
    adjust:"data"
  },
  {
    id: "data3",
    header: "Suffix",
    adjust: "header"
  },
  {
    id: "data4",
    header: "Address",
    adjust: "data"
  },
  {
    id: "data5",
    header: "City",
    adjust: "data"
  },
  {
    id: "data6",
    header: "Zip",
    adjust: "data"
  }
];

/*=====================================================================
Voter CSV Grid
=====================================================================*/
var voterCsvGrid = {
  view: "datatable",
  id: "voterCsvGrid",
  columns: voterCsvColumns,
  autoheight: true,
  width: 700,
  datatype: "csv"
};

/*=====================================================================
Voter CSV Grid Controller
=====================================================================*/
var voterCsvGridCtlr = {
  grid: null,

  init: function () {
    this.grid = $$("voterCsvGrid");
  },

  clear: function () {
    this.grid.clearAll();
  },

  load: function(data) {
    this.grid.parse(data, "csv");
  },

  pull: function() {
    var pull = this.grid.data.pull;
    var data = [];
    for (var key in pull) {
      if (pull.hasOwnProperty(key))
        data.push(pull[key]);
    }
    return {data: data};
  }
};

/*=====================================================================
Voter CSV Toolbar
=====================================================================*/
var voterCsvToolbar = {
  view: "toolbar",
  id: "voterCsvToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Voter CSV Import"},
    {
      view: "template",
      template: '<input id="fileUpload" name="files[]" type="file">'
    },
    {
      view: "button",
      value: "Make List",
      click: function() {
        voterCsvToolbarCtlr.make_list()
      }
    }
  ]
};

/*=====================================================================
Voter CSV Toolbar Controller
=====================================================================*/
var voterCsvToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("voterCsvToolbar");
    document.getElementById("fileUpload").addEventListener(
        "change", this.fileSelect, false);
  },

  fileSelect: function(e) {
    voterCsvGridCtlr.clear();
    var fileList = e.target.files;
    var file = fileList[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (function(theFile) {
      var fileData = theFile.target.result;
      voterCsvGridCtlr.load(fileData);
    })
  },

  make_list: function() {
    var items = voterCsvGridCtlr.pull();

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    var url = Flask.url_for("vtr.csv_import");

    ajaxDao.post(url, items, function(data) {
      voterListPopupCtlr.show(data['lookups']);
    });
  }
};

/*=====================================================================
Voter CSV Panel
=====================================================================*/
var voterCsvPanel = {
  rows: [voterCsvToolbar, voterCsvGrid]
};

/*=====================================================================
Voter CSV Panel Controller
=====================================================================*/
var voterCsvPanelCtlr = {
  init: function() {
    voterCsvToolbarCtlr.init();
    voterCsvGridCtlr.init();
  },

  load: function(data) {
    voterCsvGridCtlr.load(data);
  }
};
