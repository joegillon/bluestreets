/**
 * Created by Joe on 12/25/2018.
 */

/*=====================================================================
Change of Address Form
=====================================================================*/
var coaForm = {
  view: "form",
  id: "coaForm",
  width: 550,
  elements: [
    {
      rows: [
        {
          cols: [
            {
              view: "text",
              name: "zipcode",
              label: "Zipcode",
              //width: 200,
              suggest: []
            },
            {
              view: "text",
              name: "city",
              label: "City",
              //width: 300,
              suggest: []
            }
          ]
        },
        {
          view: "combo",
          name: "street",
          label: "Street",
          options: []
        },
        {
          cols: [
            {
              view: "text",
              name: "house_number",
              label: "House #",
              on: {
                onBlur: function() {
                  coaFormCtlr.process();
                }
              }
            },
            {
              view: "text",
              name: "unit",
              label: "Unit"
            }
          ]
        },
        {
          view: "text",
          name: "address",
          label: "Address",
          readonly: true
        },
        {
          view: "text",
          name: "precinct",
          label: "Precinct",
          readonly: true
        }
      ]
    }
  ],
  elementsConfig: {
    labelPosition: "top",
    attributes: {autocomplete: "new-password"}
  }

};

var coaFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("coaForm");
    this.frm.elements["zipcode"].define("options", zipcodeOptions);
    this.frm.elements["city"].define("options", cityOptions);
  },

  set_focus: function(ctl) {
    this.frm.focus(ctl);
  },

  process: function() {
    var vals = this.frm.getValues();
    var addr = vals["house_number"] + " " + vals["street"] + ", " +
        vals["city"] + " " + vals.zipcode;
    this.frm.elements.address.setValue(addr);

    var house_number = parseInt(vals.house_number);
    var odd_even = (house_number % 2 == 0) ? "E": "O";
    var p = streetsCollection.findOne({
      zipcode: vals.zipcode,
      display_name: vals.street,
      house_num_low: {'$lte': house_number},
      house_num_high: {'$gte': house_number},
      odd_even: {'$in': ["B", odd_even]}
    });
    if (p)
    {
      this.frm.elements.precinct.setValue(p.jurisdiction_code + ", " + p.ward + ", " + p.precinct);
    } else {
      this.frm.elements.precinct.setValue("Invalid address!");
    }
  }
};

/*=====================================================================
Change of Address Popup
=====================================================================*/
var coaPopup = {
  view: "window",
  id: "coaPopup",
  move: true,
  resize: true,
  top: 20,
  left: 20,
  autowidth: true,
  autoheight: true,
  position: "center",
  modal: true,
  head: {
    cols: [
      {
        view: "label",
        css: "popup_header",
        label: "Change of Address"
      },
      {
        view: "button",
        value: "Cancel",
        click: "coaPopupCtlr.hide();"
      },
      {
        view: "button",
        value: "Submit",
        click: "coaPopupCtlr.submit();"
      }
    ]
  },
  body: {
    cols: [coaForm]
  }
};

var coaPopupCtlr = {
  popup: null,

  init: function() {
    this.popup = $$("coaPopup");
    coaFormCtlr.init();
  },

  show: function() {
    this.popup.show();
    coaFormCtlr.set_focus("zipcode");
  },

  hide: function() {
    this.popup.hide();
  }
};
