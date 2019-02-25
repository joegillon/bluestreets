/**
 * Created by Joe on 2/10/2019.
 */

/*=====================================================================
Group View Panel
=====================================================================*/
var grpViewPanel = {
  id: "grpViewPanel",
  cols: [grpListPanel, grpDetailsPanel],
  autowidth: true
};

var grpViewPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("grpViewPanel");
    grpListPanelCtlr.init();
    grpDetailsPanelCtlr.init();
    $$("grpDetailsForm").bind($$("grpList"));
  }
};

/*=====================================================================
Membership View Panel
=====================================================================*/
var memViewPanel = {
  id: "memViewPanel",
  cols: [memListPanel, memDetailsPanel],
  autowidth: true
};

var memViewPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("memViewPanel");
    memListPanelCtlr.init();
    memDetailsPanelCtlr.init();
    //$$("memForm").bind($$("memList"));
  }
};

/*=====================================================================
Group Management Panel
=====================================================================*/
var grpMgtPanel = {
  container: "content_container",
  rows: [
    {
      view: "segmented",
      id: "grpTabBar",
      value: "grpViewPanel",
      multiview: true,
      optionWidth: 80,
      align: "left",
      padding: 5,
      options: [
        {value: "Groups", id: "grpViewPanel"},
        {value: "Members", id: "memViewPanel"}
      ]
    },
    {height: 5},
    {
      cells: [grpViewPanel, memViewPanel],
      autowidth: true
    }
  ]
};

var grpMgtPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("grpMgtPanel");
    grpViewPanelCtlr.init();
    memViewPanelCtlr.init();

    $$("grpList").attachEvent("onAfterSelect", function(id) {
      id = parseInt(id);
      memListCtlr.load(id);
      var group = getGroup(id);
      memFormToolbarCtlr.setLabel(group.name);
      memFormCtlr.enableContactSelect(false);
      memFormCtlr.clear();
    });

    $$("dropGroupBtn").attachEvent("onItemClick", function() {
      webix.confirm("Are you sure you want to drop this group?", "confirm-warning", function(yes) {
        if (yes) {
          var grp_id = grpListPanelCtlr.getSelectedGroupId();
          var url = Flask.url_for("grp.drop", {grp_id: grp_id});

          ajaxDao.get(url, function(data) {
            dropGroup(grp_id);
            grpListCtlr.load(data["groups"]);
            grpDetailsFormCtlr.clear();
            webix.message("Group dropped!");
          });
        }
      });
    });

    $$("addGroupBtn").attachEvent("onItemClick", function() {
      grpDetailsFormCtlr.clear();
      memListCtlr.clear();
    });

    $$("saveGroupBtn").attachEvent("onItemClick", function() {
      var values = grpDetailsFormCtlr.getValues();
      if (values !== null) {

        if (values.hasOwnProperty('_id'))
          delete values._id;

        var op = (values.id == "") ? "grp.add" : "grp.update";
        var url = Flask.url_for(op);

        ajaxDao.post(url, values, function(data) {
          if (op == "grp.update") {
            updateGroup(values);
          } else {
            values.id = data.id;
            addGroup(values);
          }
          grpListCtlr.load(getAllGroups());
          grpListCtlr.select(values.id);
          webix.message("Group saved!");
        });
      }
    });

    $$("memList").attachEvent("onSelectChange", function() {
      memFormCtlr.enableContactSelect(false);
      var membership = $$("memList").getSelectedItem();
      $$("memForm").elements.contact_name.setValue(membership.contact_name);
      $$("memForm").elements.role.setValue(membership.role);
      $$("memForm").elements.comment.setValue(membership.comment);
      $$("memForm").elements.id.setValue(membership.id);
      $$("memForm").elements.group_id.setValue(membership.group_id);
      $$("memForm").elements.contact_id.setValue(membership.contact_id);
    });

    $$("dropMemberBtn").attachEvent("onItemClick", function(id) {
      webix.confirm("Are you sure you want to drop this membership?", "confirm-warning", function(yes) {
        if (yes) {
          var mem_id = parseInt($$("memList").getSelectedId());
          var url = Flask.url_for("mem.drop", {mem_id: mem_id});

          ajaxDao.get(url, function(data) {
            dropMembership(mem_id);
            memListCtlr.load(data["groups"]);
            memFormCtlr.clear();
            webix.message("Membership dropped!");
          });
        }
      });
    });

    $$("addMemberBtn").attachEvent("onItemClick", function() {
      var group_id = grpListPanelCtlr.getSelectedGroupId();
      memFormCtlr.clear();
      var nonmembers = getNonMembers(group_id);
      memDetailsPanelCtlr.loadContacts(nonmembers);
    });

    $$("saveMemberBtn").attachEvent("onItemClick", function() {
      var values = memFormCtlr.getValues();
      if (values !== null) {

        if (values.id == "") {
          grpMgtPanelCtlr.addMembership(values)
        } else {
          grpMgtPanelCtlr.updateMembership(values);
        }
      }
    });
  },

  addMembership: function(values) {
    values.contact_id = values.contact_name;
    delete values.contact_name;
    values.group_id = grpListPanelCtlr.getSelectedGroupId();

    var url = Flask.url_for("mem.add");
    ajaxDao.post(url, values, function(data) {
      values.id = data.mem_id;
      addMembership(values);
      grpMgtPanelCtlr.reloadMembership(values);
      memListCtlr.load(values.group_id);
      webix.message("Member added!");

    })
  },

  updateMembership: function(values) {
    var url = Flask.url_for("mem.update");

    ajaxDao.post(url, values, function(data) {
      updateMembership(values);
      grpMgtPanelCtlr.reloadMembership(values);
      webix.message("Member updated!");
    });
  },

  reloadMembership: function(values) {
    memListCtlr.load(values.group_id);
//     $$("memList").select(values.id);
  }

};
