/**
 * Created by Joe on 8/5/2017.
 */

/*=====================================================================
Turf List
=====================================================================*/
var turfList = {
  view: "list",
  id: "turfList",
  autoheight: true,
  autowidth: true,
  template: "#key#: #value#"
};

/*=====================================================================
Turf List Controller
=====================================================================*/
var turfListCtlr = {
  init: function() {},

  clear: function() {
    $$("turfList").clearAll();
  },

  load: function(data) {
    lst = $$("turfList");
    d = [];
    for (var fld in data) {
      if (data.hasOwnProperty(fld)) {
        d.push({"key": fld, "value": data[fld]});
      }
    }
    lst.parse(d);
    lst.refresh();
  }
};

/*=====================================================================
Turf List Panel
=====================================================================*/
var turfListPanel = {
  rows: [turfList]
};

/*=====================================================================
Turf List Panel Controller
=====================================================================*/
var turfListPanelCtlr = {
  init: function() {
    turfListCtlr.init();
  }
};
