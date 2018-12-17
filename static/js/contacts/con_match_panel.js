/**
 * Created by Joe on 11/11/2017.
 */

/*=====================================================================
Contact Match Grid Columns
=====================================================================*/
var contactColumns = [
  {
    id: 'name',
    header: 'Name',
    adjust: "data",
    fillspace: true,
    tooltip: "#name#"
  },
 {
    id: 'address',
    header: 'Address',
    adjust: "data",
    fillspace: true,
    tooltip: "#city#, #zipcode#"
  },
  {
    id: 'email',
    header: 'Email',
    adjust: "data",
    fillspace: true,
    tooltip: "#email#"
  },
  {
    id: 'phone1',
    header: 'Phone 1',
    adjust: "data",
    fillspace: true,
    tooltip: "#phone1#"
  },
  {
    id: 'phone2',
    header: 'Phone 2',
    adjust: "data",
    fillspace: true,
    tooltip: "#phone2#"
  }
];

var voterColumns = [
  {
    id: 'name',
    header: 'Name',
    adjust: "data",
    fillspace: true,
    tooltip: "#gender#, born #birth_year#"
  },
 {
    id: 'address',
    header: 'Address',
    adjust: "data",
    fillspace: true,
    tooltip: "#city# #zipcode#"
  }
];

var streetColumns = [
 {
    id: 'address',
    header: 'Address',
    adjust: "data",
    tooltip: "#city# #zipcode#"
  },
  {
    id: "house_num_low",
    header: "Low",
    adjust: "data"
  },
  {
    id: "house_num_high",
    header: "High",
    adjust: "data"
  },
  {
    id: "odd_even",
    header: "Side",
    adjust: "header"
  }
];

/*=====================================================================
Contact Match Grid
=====================================================================*/
var conMatchGrid = {
  view: "datatable",
  id: "conMatchGrid",
  select: "row",
  tooltip: true,
  columns: [],
  on: {
    onItemDblClick: function(id) {
      conPrecinctPanelCtlr.matchFound(this.getItem(id));
    }
  }
};

/*=====================================================================
Contact Match Grid Controller
=====================================================================*/
var conMatchGridCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("conMatchGrid");
  },

  clear: function() {
    this.grid.clearAll();
  },

  show: function(src, matches) {
    if (src == 'contact') {
      this.grid.define("columns", contactColumns);
    }
    else if (src == 'voter') {
      this.grid.define("columns", voterColumns);
    }
    else if (src == 'street') {
      this.grid.define("columns", streetColumns);
    }
    this.grid.refreshColumns();
    if (matches.length == 0) {
      this.grid.clearAll();
      webix.message("No matches!")
    } else {
      this.grid.parse(matches);
    }
  }

};

/*=====================================================================
Contact Match Grid Toolbar
=====================================================================*/
var conMatchToolbar = {
  view: "toolbar",
  id: "conMatchToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Matches"},
    //{
    //  view: "button",
    //  label: "Compare",
    //  width: 100
    //},
    {
      view: "button",
      label: "Name+Address",
      width: 100,
      click: function() {
        conMatchToolbarCtlr.voterAddressMatch();
      }
    },
    {
      view: "button",
      label: "Name Only",
      width: 100,
      click: function() {
        conMatchToolbarCtlr.voterNameMatch();
      }
    },
    {
      view: "button",
      label: "Address Only",
      width: 100,
      click: function() {
        conMatchToolbarCtlr.streetMatch();
      }
    }
  ]
};

/*=====================================================================
Contact Match Grid Toolbar Controller
=====================================================================*/
var conMatchToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("conMatchToolbar");
  },

  voterAddressMatch: function () {
    var values = conFormCtlr.getValues();
    var params = {
      last_name: values.last_name,
      first_name: values.first_name,
      middle_name: values.middle_name,
      address: values.address,
      city: values.city,
      zipcode: values.zipcode
    };
    this.voterMatch(params);
  },

  voterNameMatch: function() {
    var values = conFormCtlr.getValues();
    var params = {
      last_name: values.last_name,
      first_name: values.first_name,
      middle_name: values.middle_name
    };
    this.voterMatch(params);
  },

  voterMatch: function(params) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.voter_lookup");

    ajaxDao.post(url, params, function(data) {
      conMatchGridCtlr.show('voter', data["candidates"]);
    });
  },

  streetMatch: function () {
    var values = conFormCtlr.getValues();
    var params = {
      address: values.address,
      city: values.city,
      zipcode: values.zipcode
    };

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.street_lookup");

    ajaxDao.post(url, params, function(data) {
      conMatchGridCtlr.show('street', data["candidates"]);
    });

  }
};

/*=====================================================================
Contact Match Panel
=====================================================================*/
var conMatchPanel = {
  rows: [conMatchToolbar, conMatchGrid]
};

/*=====================================================================
Contact Match Panel Controller
=====================================================================*/
var conMatchPanelCtlr = {
  init: function() {
    conMatchToolbarCtlr.init();
    conMatchGridCtlr.init();
  },

  clear: function() {
    conMatchGridCtlr.clear();
  },

  getContactMatches: function(values) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.contact_matches");

    ajaxDao.post(url, values, function(data) {
      conMatchGridCtlr.show('contact', data["matches"]);
    });
  }
};
