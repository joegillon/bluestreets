/**
 * Created by Joe on 1/19/2018.
 */

/*=====================================================================
Voter Query Panel
=====================================================================*/
var voterQueryPanel = {
  cols: [
    jurisdictionPanel,
    precinctPanel,
    streetsPanel,
    houseNumsPanel
  ]
};

/*=====================================================================
Voter Query Panel Controller
=====================================================================*/
var voterQueryPanelCtlr = {
  init: function() {
    precinctPanelCtlr.init();
    jurisdictionPanelCtlr.init(precinctListCtlr.load);
    jurisdictionListCtlr.load();
    streetsPanelCtlr.init();
    houseNumsPanelCtlr.init(this.export);
  },

  export: function() {
    var blocks = [];
    for (var i=0; i<this.list.count(); i++) {
      var id = this.list.getIdByIndex(i);
      var block = this.list.getItem(id);
      blocks.push({
        precinct_id: block.precinct_id,
        street_name: block.street_name,
        street_type: block.street_type,
        low_addr: block.low_addr,
        high_addr: block.high_addr,
        odd_even: block.odd_even
      });
    }

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    var url = Flask.url_for("vtr.worksheet");

    ajaxDao.post(url, {blocks: blocks}, function(data) {
      voterGridCtlr.loadQuery(data);
      $$("worksheetTabBar").setValue("gridView");
    });
  }
};
