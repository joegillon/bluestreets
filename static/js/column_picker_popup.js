/**
 * Created by Joe on 9/5/2017.
 */

/*=====================================================================
Column List
=====================================================================*/
var colList = {
  view: "list",
  id: "colList",
  width: 400,
  height: 200,
  type: {
    markCheckbox: function(obj) {
      return "<span class='check webix_icon fa-" + (obj.markCheckbox?"check-":"") + "square-o'></span>";
    }
  },
  onClick: {
    "check": function(e, id) {
  		var item = this.getItem(id);
        item.markCheckbox = item.markCheckbox ? 0 : 1;
        this.updateItem(id, item);
    }
  },
  template: "#header#{common.markCheckbox()}"
};

/*=====================================================================
Column List Controller
=====================================================================*/
var colListCtlr = {
  list: null,

  init: function() {
    this.list = $$("colList");
  },

  load: function(columns) {
    var headers = [];
    columns.forEach(function(col) {
      headers.push({header: col.header[0].text});
    });
    this.list.parse(headers);
  },
  
  callback: function() {
    var selections = [];
    var items = this.list.data.pull;
    for (var item in items) {
      if (items[item].markCheckbox == 1) {
        selections.push(items[item].header)
      }
    }
    colPickerPopupCtlr.hide();
    voterGridCtlr.showColumns(selections);
  }
};

/*=====================================================================
Column List Toolbar
=====================================================================*/
var colListToolbar = {
  view: "toolbar",
  id: "colListToolbar",
  cols: [
    {
      view: "button",
      value: "All"
    },
    {
      view: "button",
      value: "None"
    },
    {
      view: "button",
      value: "OK",
      click: "colListCtlr.callback()"
    },
    {
      view: "button",
      value: "Cancel",
      click: "colPickerPopupCtlr.hide()"
    }
  ]
};

/*=====================================================================
Column List Toolbar Controller
=====================================================================*/
var colListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("colListToolbar");
  }
};

/*=====================================================================
Column Picker Panel
=====================================================================*/
var colPickerPanel = {
  rows: [colListToolbar, colList]
};

/*=====================================================================
Column Picker Panel Controller
=====================================================================*/
var colPickerPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("colPickerPanel");

    colListCtlr.init();
    colListToolbarCtlr.init();
  }
};

/*=====================================================================
Column Picker Popup
=====================================================================*/
var colPickerPopup = {
  view: "window",
  id: "colPickerPopup",
  move: true,
  top: 20,
  left: 20,
  width: 300,
  position: "center",
  head: {
    view: "label",
    label: "Column Picker"
  },
  body: {
    rows: [ colPickerPanel ]
  }
};

/*=====================================================================
Column Picker Popup Controller
=====================================================================*/
var colPickerPopupCtlr = {
  popup: null,

  init: function() {
    this.popup = $$("colPickerPopup");
    this.hide();
    colPickerPanelCtlr.init();
  },

  show: function(data) {
    colListCtlr.load(data);
    this.popup.show();
  },

  hide: function() {
    this.popup.hide();
  }
};
