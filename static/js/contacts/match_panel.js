/* conMatchPanel: conMatchToolbar, conMatchGrid */

/*=====================================================================
Contact Match Toolbar
=====================================================================*/
var conMatchToolbar = {
  view: "toolbar",
  id: "conMatchToolbar",
  height: 35,
  cols: [
    {
      view: "label",
      id: "matchLabel",
      label: "Matches"
    },
    {
      view: "button",
      label: "Voter Lookup",
      width: 100,
      click: function() {
        conMatchToolbarCtlr.voterMatch();
      }
    },
    {
      view: "button",
      label: "Street Lookup",
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

  setLabel: function(matchType) {
    var lbl = $$("matchLabel");
    switch (matchType) {
      case "C":
        lbl.setValue("Contact Matches");
        break;
      case "V":
        lbl.setValue("Voter Matches");
        break;
      case "S":
        lbl.setValue("Street Matches");
        break;
      default:
        // TODO: error message
    }
  },

  voterMatch: function () {
    var values = conFormCtlr.getValues();
    if (values.last == "" || values.first == "") {
      webix.message({type: "error", text: "Must have at least first and last name!"});
      return;
    }
    var params = {
      last_name: values.last,
      first_name: values.first,
      middle_name: values.middle,
      address: values.address,
      city: values.city,
      zipcode: values.zipcode
    };

    conMatchGridCtlr.config("V");

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.voter_lookup");

    ajaxDao.post(url, params, function(data) {
      data["candidates"].forEach(function(candidate) {
        var street = streetsCollection.findOne(
          {precinct_id: candidate.voter_info.precinct_id}
        );
        candidate.name.whole_name = wholeName(candidate.name);
        candidate.address.whole_addr = wholeAddress(candidate.address);
        candidate.voter_info.precinct_name = street.pct_name;
      });
      conMatchGridCtlr.load(data["candidates"]);
    });
  },

  streetMatch: function () {
    var values = conFormCtlr.getValues();
    var params = {
      address: values.address,
      city: values.city,
      zipcode: values.zipcode
    };

    conMatchGridCtlr.config("S");

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.street_lookup");

    ajaxDao.post(url, params, function(data) {
      data["candidates"].forEach(function(candidate) {
        candidate.address = wholeAddress(candidate);
      });
      conMatchGridCtlr.load(data["candidates"]);
    });
  }

};

/*=====================================================================
Contact Match Grid
=====================================================================*/
var conCGrid = {
  view: "datatable",
  id: "conCGrid",
  select: "row",
  hidden: true,
  tooltip: true,
  columns: [
    {
      header: "Name",
      template: "#name.whole_name#",
      adjust: "data",
      fillspace: true,
      tooltip: "#name.whole_name#"
    },
   {
      header: 'Address',
      template: "#address.whole_addr#",
      adjust: "data",
      fillspace: true,
      tooltip: "#address.whole_addr#, #address.city#"
    },
    {
      header: 'Email',
      template: "#contact_info.email#",
      adjust: "data",
      fillspace: true,
      tooltip: "#contact_info.email#"
    },
    {
      header: 'Phone 1',
      template: "#contact_info.phone1#",
      adjust: "data",
      fillspace: true,
      tooltip: "#contact_info.phone1#"
    },
    {
      header: 'Phone 2',
      template: "#contact_info.phone2#",
      adjust: "data",
      fillspace: true,
      tooltip: "#contact_info.phone2#"
    }
  ],
  on: {
    onItemDblClick: function(id) {
      conFormCtlr.loadContact(id.row);
      conGridCtlr.showSelection(id.row);
    }
  }
};

var conVGrid = {
  view: "datatable",
  id: "conVGrid",
  select: "row",
  hidden: true,
  tooltip: true,
  columns: [
    {
      header: 'Name',
      template: "#name.whole_name#",
      adjust: "data",
      fillspace: true,
      tooltip: "#voter_info.gender#, born #voter_info.birth_year#"
    },
   {
      header: 'Address',
      template: "#address.whole_addr#",
      adjust: "data",
      fillspace: true,
      tooltip: "#address.city# #address.zipcode#"
    }
  ],
  on: {
    onItemDblClick: function(id) {
      conFormCtlr.loadVoter(this.getSelectedItem());
    }
  }
};

var conSGrid = {
  view: "datatable",
  id: "conSGrid",
  select: "row",
  hidden: true,
  tooltip: true,
  columns: [
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
  ],
  on: {
    onItemDblClick: function(id) {
      conFormCtlr.loadStreet(this.getSelectedItem());
    }
  }
};

var conMatchGridCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("conCGrid");
    this.grid.show();
  },

  clear: function() {
    this.grid.clearAll();
  },

  config: function(matchType) {
    var gridName = "con" + matchType + "Grid";
    if (gridName != this.grid.config.id) {
      this.grid.hide();
      this.clear();
      this.grid = $$(gridName);
      this.grid.show();
    }

    conMatchToolbarCtlr.setLabel(matchType);
  },

  load: function(data) {
    this.grid.parse({
      pos: this.grid.count(),
      data: data
    });
    this.grid.refresh();
  }

};

/*=====================================================================
Contact Match Panel
=====================================================================*/
var conMatchPanel = {
  rows: [conMatchToolbar, conCGrid, conVGrid, conSGrid]
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

  init: function() {
    conMatchToolbarCtlr.init();
    conMatchGridCtlr.init();
  },

  clear: function() {
    conMatchGridCtlr.clear();
  },

  handleMatches: function(matches) {
    var current_ids = Object.values($$("conCGrid").data.pull).
      map(function(item) {
        return item.id;
      }
    );
    var newRows = matches.filter(function(match) {
      return current_ids.indexOf(match.id) == -1;
    });
    if (newRows.length > 0) {
      conMatchGridCtlr.config("C");
      conMatchGridCtlr.load(newRows);
    }
  },

  emailMatch: function(value) {
    if (value == "") return;
    var contacts = contactsCollection.find(
      {contact_info: {email: new RegExp("^" + value[0])}}
    );
    var emails = [];
    contacts.forEach(function(contact) {
      emails.push(contact.contact_info.email);
    });
    var matches = [];
    var choices = fuzzball.extract(value, emails, {cutoff: 80, returnObjects: true});
    choices.forEach(function(choice)
      {matches.push(contacts[choice.key]);}
    );
    this.handleMatches(matches);
  },

  phoneMatch: function(value) {
    if (value == "") return;
    var matches = contactsCollection.find(
      {contact_info: {'$or': [
        {phone1: value}, {phone2: value}
      ]}
    });
    this.handleMatches(matches);
  },

  lastNameMatch: function(value) {
    if (value == "") return;
    var dm = double_metaphone(value)[0];
    var matches = contactsCollection.find(
      {name: {last_meta: dm}}
    );
    matches = matches.filter(function(match) {
      return match.name.last[0] == value[0];
    });
    this.handleMatches(matches);
  },

  // TODO: Test this on ordinal streets
  addressMatch: function(value) {
    if (value == "") return;
    var street_name = parseAddress.parseLocation(value).street;
    if (this.ordinal_streets[street_name]) {
      street_name = this.ordinal_streets[street_name];
    }
    var n = "";
    street_name.split("").forEach(function(c) {
      n += (isDigit(c)) ? this.digit_mappings(c) : c;
    });
    var dm = double_metaphone(n)[0];
    var matches = contactsCollection.find(
      {address: {street_meta: dm}}
    );
    matches = matches.filter(function(match) {
      return match.address.street_name[0] == street_name[0];
    });
    this.handleMatches(matches);
  }
};
