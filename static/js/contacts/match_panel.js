/* conMatchPanel: conMatchToolbar, conMatchGrid */

/*=====================================================================
Contact Match Toolbar
=====================================================================*/
var conMatchToolbar = {
  view: "toolbar",
  id: "conMatchToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Matches"},
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

var conMatchToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("conMatchToolbar");
  },

  voterAddressMatch: function () {
    var values = conFormCtlr.getValues();
    var params = {
      last_name: values.last,
      first_name: values.first,
      middle_name: values.middle,
      address: values.address,
      city: values.city,
      zipcode: values.zipcode
    };
    this.voterMatch(params);
  },

  voterNameMatch: function() {
    var values = conFormCtlr.getValues();
    var params = {
      last_name: values.last,
      first_name: values.first,
      middle_name: values.middle
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
Contact Match Grid
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
    template: "#name.whole_name#",
    adjust: "data",
    fillspace: true,
    tooltip: "#gender#, born #birth_year#"
  },
 {
    id: 'address',
    header: 'Address',
    template: "#address.whole_addr#",
    adjust: "data",
    fillspace: true,
    tooltip: "#address.city# #address.zipcode#"
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

var conMatchGrid = {
  view: "datatable",
  id: "conMatchGrid",
  select: "row",
  tooltip: true,
  columns: contactColumns,
  on: {
    onItemDblClick: function(id) {
      conFormCtlr.load(this.getItem(id));
    }
  }
};

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
  },

  add: function(matches) {
    this.grid.parse({
      pos: this.grid.count(),
      data: matches
    });
    this.grid.refresh();
  }

};

/*=====================================================================
Contact Match Panel
=====================================================================*/
var conMatchPanel = {
  rows: [conMatchToolbar, conMatchGrid]
};

var conMatchPanelCtlr = {
  ordinal_streets: {
    'FIRST': '1ST', 'SECOND': '2ND', 'THIRD': '3RD',
    'FOURTH': '4TH', 'FIFTH': '5TH', 'SIXTH': '6TH',
    'SEVENTH': '7TH', 'EIGHTH': '8TH', 'NINTH': '9TH',
    'TENTH': '10TH', 'ELEVENTH': '11TH', 'TWELFTH': '12TH'
  },

  digit_mappings: {
    '0': 'ZERO',
    '1': 'ONE',
    '2': 'TWO',
    '3': 'THREE',
    '4': 'FOUR',
    '5': 'FIVE',
    '6': 'SIX',
    '7': 'SEVEN',
    '8': 'EIGHT',
    '9': 'NINE'
  },

  match_ids: [],

  init: function() {
    conMatchToolbarCtlr.init();
    conMatchGridCtlr.init();
  },

  clear: function() {
    conMatchGridCtlr.clear();
    this.match_ids = [];
  },

  addMatchIds: function(match_ids) {
    var new_ids = [];
    var me = this;
    match_ids.forEach(function(match_id) {
      if (!me.match_ids.includes(match_id)) {
        me.match_ids.push(match_id);
        new_ids.push(match_id);
      }
    });
    return new_ids;
  },

  handleMatches: function(matches) {
    if (matches.length > 0) {
      var id_fld = (matches[0].hasOwnProperty("key")) ? "key" : "id";
      var match_ids = [];
      matches.forEach(function(match) {
        match_ids.push(parseInt(match[id_fld]));
      });
      var new_ids = this.addMatchIds(match_ids);
      if (new_ids.length > 0)
        conMatchGridCtlr.add(contacts.find({id: {'$in': new_ids}}));
    }
  },

  emailMatch: function(value) {
    if (value == "") return;
    var choices = {};
    var x = "^" + value[0];
    contacts.find({email: {'$regex': x}}).forEach(function(rec) {
      choices[rec.id] = rec.email;
    });
    var matches = fuzzball.extract(value, choices, {cutoff: 80, returnObjects: true});
    this.handleMatches(matches);
  },

  phoneMatch: function(value) {
    if (value == "") return;
    var matches = contacts.find({
      '$or': [
        {phone1: value}, {phone2: value}
      ]
    });
    this.handleMatches(matches);
  },

  lastNameMatch: function(value) {
    if (value == "") return;
    var dm = double_metaphone(value)[0];
    var matches = contacts.find({last_name_meta: dm});
    matches = matches.filter(function(match) {
      return match[0] == value[0];
    });
    this.handleMatches(matches);
  },

  // TODO: Test this on ordinal streets
  addressMatch: function(value) {
    if (value == "") return;
    value = value.toUpperCase();
    var street_name = parseAddress.parseLocation(value).street;
    if (this.ordinal_streets[street_name]) {
      street_name = this.ordinal_streets[street_name];
    }
    var n = "";
    street_name.split("").forEach(function(c) {
      n += (isDigit(c)) ? this.digit_mappings(c) : c;
    });
    var dm = double_metaphone(n)[0];
    var matches = contacts.find({street_meta: dm});
    matches = matches.filter(function(match) {
      return match[0] == value[0];
    });
    this.handleMatches(matches);
  }
};
