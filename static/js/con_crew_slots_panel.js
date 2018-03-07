/**
 * Created by Joe on 3/5/2018.
 */

/*=====================================================================
Contact Crew PD Grid
=====================================================================*/
var crewPDGrid = {
    view: "datatable",
    id: "crewPDGrid",
    columns: [
        {
            id: "jurisdiction_name",
            header: "Jurisdiction",
            editor: "text",
            adjust: true
        },
        {
            id: "ward",
            header: "Ward",
            readonly: true,
            adjust: true
        },
        {
            id: "precinct",
            header: "Pct",
            readonly: true,
            adjust: true
        },
        {
            id: "slots",
            header: "Slots",
            editor: "text",
            adjust: true
        },
        {
            id: "previous",
            header: "Previous",
            editor: "text",
            adjust: true
        },
        {
            id: "open_slots",
            header: "Open",
            editor: "text",
            adjust: true
        },
        {
            id: "filed",
            header: "Filed",
            editor: "text",
            adjust: true
        }
    ]
};

/*=====================================================================
Contact Crew PD Panel
=====================================================================*/
var crewPDPanel = {
    rows: [crewPDGrid]
};

/*=====================================================================
Contact Crew CC Grid
=====================================================================*/
var crewCCGrid = {
    view: "datatable",
    id: "crewCCGrid",
    columns: [
        {
            id: "jurisdiction_name",
            header: "Jurisdiction",
            editor: "text",
            adjust: true
        },
        {
            id: "ward",
            header: "Ward",
            readonly: true,
            adjust: true
        },
        {
            id: "precinct",
            header: "Pct",
            readonly: true,
            adjust: true
        },
        {
            id: "cc_names",
            header: "Members",
            editor: "text",
            adjust: true
        }
    ]
};

/*=====================================================================
Contact Crew CC Panel
=====================================================================*/
var crewCCPanel = {
    rows: [crewCCGrid]
};

/*=====================================================================
Contact Crew Ward Grid
=====================================================================*/
var crewWardGrid = {
    view: "datatable",
    id: "crewWardGrid",
    columns: [
        {
            id: "jurisdiction_name",
            header: "Jurisdiction",
            editor: "text",
            adjust: true
        },
        {
            id: "ward",
            header: "Ward",
            readonly: true,
            adjust: true
        },
        {
            id: "ward_names",
            header: "Members",
            editor: "text",
            adjust: true
        }
    ]
};

/*=====================================================================
Contact Crew Ward Panel
=====================================================================*/
var crewWardPanel = {
    rows: [crewWardGrid]
};

/*=====================================================================
Contact Crew Other Grid
=====================================================================*/
var crewOtherGrid = {
    view: "datatable",
    id: "crewOtherGrid",
    columns: [
        {
            id: "jurisdiction_name",
            header: "Jurisdiction",
            editor: "text",
            adjust: true
        },
        {
            id: "ward",
            header: "Ward",
            readonly: true,
            adjust: true
        },
        {
            id: "precinct",
            header: "Pct",
            readonly: true,
            adjust: true
        },
        {
            id: "oth_names",
            header: "Others",
            editor: "text",
            adjust: true
        }
    ]
};

/*=====================================================================
Contact Crew Other Panel
=====================================================================*/
var crewOtherPanel = {
    rows: [crewOtherGrid]
};

/*=====================================================================
Contact Crew Slots Views
=====================================================================*/
var conCrewSlotsPDView = {
    id: "conCrewSlotsPDView",
    rows: [crewPDPanel]
};

var conCrewSlotsCCView = {
    id: "conCrewSlotsCCView",
    rows: [crewCCPanel]
};

var conCrewSlotsWardView = {
    id: "conCrewSlotsWardView",
    rows: [crewWardPanel]
};

var conCrewSlotsOtherView = {
    id: "conCrewSlotsOtherView",
    rows: [crewOtherPanel]
};

/*=====================================================================
Contact Crew Slots Panel
=====================================================================*/
var conCrewSlotsPanel = {
    rows: [
        {
            view: "segmented",
            id: "conCrewSlotsPanel",
            value: "conCrewSlotsPDView",
            multiview: true,
            align: "center",
            padding: 5,
            options: [
                {value: "PD", id: "conCrewSlotsPDView"},
                {value: "CC", id: "conCrewSlotsCCView"},
                {value: "Ward", id: "conCrewSlotsWardView"},
                {value: "Other", id: "conCrewSlotsOtherView"}
            ]
        },
        {height: 5},
        {
            cells: [
                conCrewSlotsPDView,
                conCrewSlotsCCView,
                conCrewSlotsWardView,
                conCrewSlotsOtherView
            ]
        }
    ]
};

/*=====================================================================
Contact Crew Slots Panel Controller
=====================================================================*/
var conCrewSlotsPanelCtlr = {
    panel: null,

    init: function() {
        this.panel = $$("conCrewSlotsPanel");
    }
};