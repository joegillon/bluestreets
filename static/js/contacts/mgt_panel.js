/* conMgtPanel: conGridPanel, conDetailPanel */

/*=====================================================================
Contact Globals
=====================================================================*/
var contactsCollection;
var groupsCollection;
var membershipsCollection;
var streetsCollection;
var zipcodeOptions;
var cityOptions;

/*=====================================================================
Contact Management Panel
=====================================================================*/
var conMgtPanel = {
  cols: [conGridPanel, conDetailPanel]
};

var conMgtPanelCtlr = {
  init: function() {
    this.build_db();
    conGridPanelCtlr.init();
    conDetailPanelCtlr.init();

    // Need this because form onblur events occur prior to the clear
    // button click.
    webix.attachEvent("onFocusChange", function(cur_view, prv_view) {
      if (cur_view === null) return;
      if (cur_view.config.id == "conFormClearBtn") {
        conFormCtlr.clear();
      }
    })
  },

  build_db: function() {
    contactsCollection = db.collection("contacts").deferredCalls(false);
    contactsCollection.insert(contactRecords);

    groupsCollection = db.collection("groups").deferredCalls(false);
    groupsCollection.insert(groupRecords);

    membershipsCollection = db.collection("memberships").deferredCalls(false);
    membershipsCollection.insert(membershipRecords);

    streetsCollection = db.collection("streets").deferredCalls(false);
    streetsCollection.insert(streetRecords);

    zipcodeOptions = streetsCollection.find(
      {$distinct: {zipcode: {$ne: ""}}},
      {$orderBy: {zipcode: 1}}
    ).map(function(street) {
      return street.zipcode;
    });

    cityOptions = streetsCollection.find(
      {$distinct: {city: {$ne: ""}}},
      {$orderBy: {city: 1}}
    ).map(function(street) {
      return street.city;
    });

    contactsCollection.find().forEach(function(contact) {
      var params = {
        name: {whole_name: wholeName(contact.name)},
        address: {whole_addr: wholeAddress(contact.address)},
        voter_info: {
          precinct_name: "",
          congress: "",
          senate: "",
          house: ""
        }
      };
      if (contact.voter_info.precinct_id) {
        street = streetsCollection.findOne(
          {precinct_id: contact.voter_info.precinct_id}
        );
        params.voter_info = {
          precinct_name: street.pct_name,
          congress: street.congress,
          senate: street.state_senate,
          house: street.state_house
        };
      }
      contactsCollection.update({id: contact.id}, params);
    })
  }
};

