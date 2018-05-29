/**
 * Created by Joe on 10/10/2017.
 */

/*=====================================================================
HouseNums List
=====================================================================*/
var houseNumsList = {
  view: "list",
  id: "houseNumsList",
  width: 240,
  height: 280,
  select: true,
  template: "#display#"
};

/*=====================================================================
HouseNums List Controller
=====================================================================*/
var houseNumsListCtlr = {
  list: null,

  init: function() {
    this.list = $$("houseNumsList");
  },

  clear: function() {
    this.list.clearAll();
  },

  add: function(low, high, oddEven) {
    var precinct_id = precinctListCtlr.getSelected().id;
    var street = streetsListCtlr.getSelected();
    var str = street.street_name + " " + street.street_type;
    var display = str;
    if (low) {
      display += ": " + low + "-" + high;
    }
    display += " (" + oddEven + ")";
    var item = {
      precinct_id: precinct_id,
      street_name: street.street_name,
      street_type: street.street_type,
      low_addr: low,
      high_addr: high,
      odd_even: oddEven,
      str: str,
      display: display
    };
    this.list.add(item);
  },

  remove: function() {
    this.list.remove(this.list.getSelectedId());
  },

  getSelected: function() {
    return getWebixList(this.list);
  }

};

/*=====================================================================
HouseNums List Toolbar
=====================================================================*/
var houseNumsListToolbar = {
  view: "toolbar",
  id: "houseNumsListToolbar",
  height: 140,
  rows: [
    {
      cols: [
        {
          view: "label",
          label: "Blocks"
        },
        {
          view: "button",
          label: "Clear",
          click: function() {
            houseNumsListToolbarCtlr.clear();
          }
        },
        {
          view: "button",
          label: "Run",
          click: function() {
            houseNumsListToolbarCtlr.save();
          }
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          id: "lowAddr",
          label: "Low",
          labelWidth: 40,
          width: 120
        },
        {
          view: "text",
          id: "hiAddr",
          label: "High",
          labelWidth: 40,
          width: 120
        }
      ]
    },
    {
      cols: [
        {
          view: "radio",
          id: "oddEven",
          css: "toolbarRadio",
          options: [
            "O", "E", "B"
          ],
          value: "B"
        }
      ]
    },
    {
      cols: [
        {
          view: "button",
          label: "Add",
          click: function() {
            var low = $$("lowAddr").getValue();
            var high = $$("hiAddr").getValue();
            var oddEven = $$("oddEven").getValue();
            houseNumsListCtlr.add(low, high, oddEven);
          }
        },
        {
          view: "button",
          label: "Remove",
          click: function() {
            houseNumsListCtlr.remove("", "", "");
          }
        }
      ]
    }
  ]
};

/*=====================================================================
HouseNums List Toolbar Controller
=====================================================================*/
var houseNumsListToolbarCtlr = {
  toolbar: null,
  list: null,

  init: function(exportFunc) {
    this.toolbar = $$("houseNumsListToolbar");
    this.list = $$("houseNumsList");
    this.exportFunc = exportFunc;
  },

  clear: function() {
    $$("lowAddr").setValue("");
    $$("hiAddr").setValue("");
    $$("oddEven").setValue("B");
    houseNumsListCtlr.clear();
  },

  save: function() {
    this.exportFunc();

  }

};

/*=====================================================================
HouseNums Panel
=====================================================================*/
var houseNumsPanel = {
  rows: [houseNumsListToolbar, houseNumsList]
};

/*=====================================================================
HouseNums Panel Controller
=====================================================================*/
var houseNumsPanelCtlr = {
  init: function(exportFunc) {
    houseNumsListToolbarCtlr.init(exportFunc);
    houseNumsListCtlr.init();
  }
};
