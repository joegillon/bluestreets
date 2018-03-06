/**
 * Created by Joe on 9/26/2017.
 */

var nrows = 0;

var onClick = {
  "none": function() {
    var lst = $$(this.config.body["id"]);
    lst.unselectAll();
    return false;
  }
};

/*=====================================================================
Voter List
=====================================================================*/
var voterList = {
  view: "scrollview",
  height: 500,
  body: {
    view: "accordion",
    id: "voterList",
    multi: true,
    width: 600,
    autoheight: true,
    rows: []
  }
};

/*=====================================================================
Voter List Controller
=====================================================================*/
var voterListCtlr = {
  list: null,

  init: function() {
    this.list = $$("voterList");
  },

  clear: function() {
    var views = this.list.getChildViews();
    for (var i=views.length-1; i>=0; i--) {
      this.list.removeView(views[i].config.id);
    }
  },

  load: function(data) {
    this.buildRows(data);
  },

  buildRows: function(data){
    this.shapeData(data);
    for (var i=0; i<data.length; i++) {
      var row = this.buildRow(data[i], i);
      this.list.addView(row);
      var lst = $$(i + "_matches");
      lst.parse(data[i].matches);
      this.selectRow(lst);
      lst.data.sort("#score#", "desc", "int");
    }
    nrows = i;
  },

  buildRow: function(rec, idx) {
    var lst = this.getMatchList(idx);
    var s = rec.submittedName + " @ " + rec.submittedAddress;
    return {
      view: "accordionitem",
      header: s + "<span class='accordion_header_button none'>No Matches</span>",
      body: lst,
      onClick: onClick
    };
  },

  selectRow: function(lst) {
    for (var i=0; i<lst.count(); i++) {
      var idx = lst.getIdByIndex(i);
      var item = lst.getItem(idx);
      if (item.markCheckbox) {
        lst.select(idx);
        return;
      }
    }
  },

  getMatchList: function(idx) {
    return {
      view: "list",
      id: idx + "_matches",
      autoheight: true,
      select: true,
      template: "<div class='title'>#matchName# @ #matchAddress# (#score#)</div>",
      type: {
        height: 40
      }
    }
  },

  shapeData: function(data) {
    for (var i=0; i<data.length; i++) {
      var rec = data[i];
      var x = rec["name"];
      rec["submittedName"] = x["last_name"] + ", " +
          x["first_name"] + " " +
          x["middle_name"] + " " +
          x["name_suffix"];

      rec["submittedAddress"] = this.getAddress(rec["address"]);
      rec["markCheckbox"] = 0;

      if (rec["matches"] === null) {
        continue;
      }

      var top_score = 0;
      var top_idx = -1;
      for (var j=0; j<rec["matches"].length; j++) {
        var match = rec["matches"][j];
        x = match["name"];
        match["matchName"] = x["last_name"] + ", " +
            x["first_name"] + " " +
            x["middle_name"] + " " +
            x["name_suffix"];

        match["matchAddress"] = this.getAddress(match["address"]);
        if (match["score"] > top_score) {
          top_score = match["score"];
          top_idx = j;
        }
      }
      if (top_score >= 65)
        rec["matches"][top_idx]["markCheckbox"] = 1;
    }
  },

  getAddress: function(addrObj) {
    var addr = "";
    if (addrObj["house_number"])
      addr = addrObj["house_number"];
    if (addrObj["pre_direction"])
      addr += " " + addrObj["pre_direction"];
    if (addrObj["street_name"])
      addr += " " + addrObj["street_name"];
    if (addrObj["street_type"])
      addr += " " + addrObj["street_type"];
    if (addrObj["suf_direction"])
      addr += " " + addrObj["suf_direction"];
    if (addrObj["unit"])
      addr += " " + addrObj["unit"];
    if (addrObj["city"]) {
      addr += ", " + addrObj["city"];
    }
    if (addrObj["zip"]) {
      addr += " " + addrObj["zip"];
    }
    return addr;
  },

  expandContract: function(value) {
    if (value == "Contract") {
      this.contract();
    } else {
      this.expand();
    }
  },

  expand: function() {
    var acc = $$("voterList");
    var items = acc.getChildViews();
    for (var i=0; i<items.length; i++) {
      items[i].expand();
    }
  },

  contract: function() {
    var acc = $$("voterList");
    var items = acc.getChildViews();
    for (var i=0; i<items.length; i++) {
      var lst = items[i].getChildViews()[0];
      var item = lst.getSelectedItem();
      if (item) {
        items[i].collapse();
      } else {
        items[i].expand();
      }
    }
  }
};

/*=====================================================================
Voter List Toolbar
=====================================================================*/
var voterListToolbar = {
  view: "toolbar",
  id: "voterListToolbar",
  height: 35,
  cols: [
    {view: "label", label: "My Voter List"},
    {
      view: "button",
      id: "cancelBtn",
      value: "Cancel",
      click: function() {
        voterListCtlr.clear();
        voterListPopupCtlr.hide();
      }
    },
    {
      view: "button",
      id: "exconBtn",
      value: "Contract",
      click: function() {
        var val = this.getValue();
        voterListCtlr.expandContract(val);
        if (val == "Contract") {
          this.setValue("Expand");
        } else {
          this.setValue("Contract");
        }
        this.refresh();
      }
    },
    {
      view: "button",
      id: "sendListBtn",
      value: "Send List",
      click: function() {
        voterListToolbarCtlr.send();
      }
    }
  ]
};

/*=====================================================================
Voter List Toolbar Controller
=====================================================================*/
var voterListToolbarCtlr = {
  init: function() {},

  send: function() {
    var data = [];
    for (var row=0; row<nrows; row++) {
      var lst = $$(row + "_matches");
      var item = lst.getSelectedItem();
      if (item) {
        var addr = "";
        if (item.address["house_number"])
          addr = item.address["house_number"];
        if (item.address["pre_direction"])
          addr += " " + item.address["pre_direction"];
        if (item.address["street_name"])
          addr += " " + item.address["street_name"];
        if (item.address["street_type"])
          addr += " " + item.address["street_type"];
        if (item.address["suf_direction"])
          addr += " " + item.address["suf_direction"];
        if (item.address["unit"])
          addr += " #" + item.address["unit"];

        data.push({
          last_name: item.name.last_name,
          first_name: item.name.first_name,
          middle_name: item.name.middle_name,
          name_suffix: item.name.name_suffix,
          address: addr,
          city: item.address.city,
          zip: item.address.zip,
          reg_date: item.reg_date,
          perm_abs: item.perm_abs,
          status: item.status,
          uocava: item.uocava
        });
      }
    }
    csvExportTableCtlr.save(data);
    voterListPopupCtlr.hide();
  }
};

/*=====================================================================
Voter List Panel
=====================================================================*/
var voterListPanel = {
  rows: [voterListToolbar, voterList]
};

/*=====================================================================
Voter List Panel Controller
=====================================================================*/
var voterListPanelCtlr = {
  init: function() {
    voterListToolbarCtlr.init();
    voterListCtlr.init();
  },

  load: function(data) {
    voterListCtlr.load(data);
  }
};
