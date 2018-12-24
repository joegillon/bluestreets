/* conGridPanel: conGridToolbar, conGrid */

/*=====================================================================
Contact Grid Toolbar
=====================================================================*/
var conGridToolbar = {
  view: "toolbar",
  id: "conGridToolbar",
  height: 35,
  paddingY: 2,
  cols: [
    {
      view: "label",
      label: "Contacts"
    },
    {
      view: "search",
      id: "conGridFilter",
      placeholder: "Search...",
      width: 150,
      on: {
        onTimedKeyPress: function() {
          conGridCtlr.filter(this.getValue());
        }
      }
    },
    {
      view: "select",
      label: "Precinct",
      id: "pctSelect",
      width: 200,
      options: [],
      on: {
        onChange: function(newv) {
          if (newv == "All") newv = "";
          conGridCtlr.filter_pct(newv);
        }
      }
    },
    {
      view: "select",
      label: "Group",
      id: "grpSelect",
      width: 200,
      options: [],
      on: {
        onChange: function(newv) {
          if (newv == "0") newv = "All";
          conGridCtlr.filter_grp(newv);
        }
      }
    }
  ]
};

var conGridToolbarCtlr = {
  toolbar: null,
  csvFile: null,

  init: function() {
    this.toolbar = $$("conGridToolbar");
    this.load_precincts();
    this.load_groups();
  },

  load_precincts: function() {
    var opts = precincts.chain().simplesort('display').data().
        map(function (obj) {return obj.display;});
    opts.unshift("All");
    $$("pctSelect").define("options", opts);
    $$("pctSelect").refresh();
  },

  load_groups: function() {
    var opts = [{id: 0, value: "All"}];
    groups.find().forEach(function(grp) {
      opts.push({
        id: grp.id,
        value: grp.name
      });
    });
    $$("grpSelect").define("options", opts);
    $$("grpSelect").refresh();
  }

};

/*=====================================================================
Contact Grid
=====================================================================*/
var conGrid = {
  view: "datatable",
  id: "conGrid",
  height: 500,
  autowidth: true,
  select: true,
  resizeColumn: true,
  columns: [
    {id: 'id', hidden: true},
    {id: 'name', header: 'Name', width: 280, sort: "string"},
    {id: "pct", header: "Precinct", width: 220, sort: "string"},
    {id: "congress", header: "US", adjust: "data", sort: "string"},
    {id: "senate", header: {text: "State Senate", css: "multiline", height: 40}, width: 60, sort: "string"},
    {id: "house", header: {text: "State House", css: "multiline"}, width: 60, sort: "string"}
  ],
  on: {
    onItemDblClick: function() {
      conGridCtlr.dblClick();
    }
  }
};

var conGridCtlr = {
  grid: null,
  displayData: null,

  init: function() {
    this.grid = $$("conGrid");
    this.displayData = this.build_display_data(contacts);
    this.load(this.displayData);
  },

  clear: function() {
    this.grid.clearAll();
  },

  load: function(data) {
    this.clear();
    this.grid.parse(data);
    this.grid.adjust();
  },

  build_display_data: function() {
    var data = [];
    contacts.find().forEach(function(contact) {
      contact.pct = "";
      contact.congress = "";
      contact.senate = "";
      contact.house = "";
      if (contact.precinct_id) {
        var pct = precincts.findOne({id: contact.precinct_id});
        contact.pct = pct.jurisdiction_name + ", " + pct.ward + ", " + pct.precinct;
        contact.congress = pct.congress;
        contact.senate = pct.state_senate;
        contact.house = pct.state_house;
      }
      data.push(contact);
    });
    return data;
  },

  filter: function(value) {
    this.grid.filter(function(obj) {
      return obj["name"].toLowerCase().indexOf(value.toLowerCase()) == 0;
    })
  },

  filter_pct: function(value) {
    this.grid.filter(function(obj) {
      return obj["pct"].indexOf(value) == 0;
    })
  },

  filter_grp: function(value) {
    if (value == "All") {
      this.load(this.displayData);
    } else {
      var contact_ids = memberships.find({group_id: parseInt(value)}).
          map(function (obj) {return obj.contact_id;});
      var subset = [];
      this.displayData.forEach(function(contact) {
        if (contact_ids.includes(contact.id)) {
          subset.push(contact);
        }
      });
      this.load(subset);
    }
  },

  dblClick: function() {
    var contact = this.grid.getSelectedItem();
    conFormCtlr.load(contact);
  },

  showSelection: function(id) {
    this.grid.select(id);
    this.grid.showItem(id);
  },

  add: function(contact) {
    // TODO: add to grid
  },

  update: function(contact) {
    // TODO: update grid
  },

  drop: function(id) {
    // TODO: drop from grid
  }
};

/*=====================================================================
Contact Grid Panel
=====================================================================*/
var conGridPanel = {
  rows: [conGridToolbar, conGrid]
};

var conGridPanelCtlr = {
  init: function() {
    conGridToolbarCtlr.init();
    conGridCtlr.init();
  }
};

