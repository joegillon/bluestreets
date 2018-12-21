/* conMgtPanel: conGridPanel, conFormPanel */

/*=====================================================================
Contact Management Panel
=====================================================================*/
var conMgtPanel = {
  cols: [conGridPanel, {rows: [conFormPanel, conMatchPanel]}]
};

var conMgtPanelCtlr = {
  match_ids: [],

  init: function() {
    conGridPanelCtlr.init();
    conFormPanelCtlr.init();
    conMatchPanelCtlr.init();
  },

  loadForm: function(contact) {
    conFormCtlr.load(contact);
    conGridCtlr.select(contact.id);
  },

  clearMatches: function() {
    conMatchPanelCtlr.clear();
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
    var matches = fuzzball.extract(value, choices, {cutoff: 90, returnObjects: true});
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

  addressMatch: function(value) {
    if (value == "") return;
    var street_name = parseAddress.parseLocation(value).street;
    var dm = double_metaphone(street_name)[0];
    var matches = contacts.find({street_meta: dm});
    this.handleMatches(matches);
  },

  lastNameMatch: function(value) {
    if (value == "") return;
    var dm = double_metaphone(value)[0];
    var matches = contacts.find({last_name_meta: dm});
    this.handleMatches(matches);
  },

  addToGrid: function() {

  },

  dropFromGrid: function() {

  },

  updateGrid: function() {

  }
};

