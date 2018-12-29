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
              suggest: [],
              on: {
                onBlur: function() {
                  coaFormCtlr.load_cities(this.getValue());
                }
              }
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
  elementsConfig: {labelPosition: "top"}

};

var coaFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("coaForm");
  },

  load_zips: function() {
    this.frm.elements.zipcode.define("suggest", streets.chain().simplesort('zipcode').data().
        map(function (obj) { return obj.zipcode; }));
  },

  load_cities: function(zipcode) {
    var rec = streets.findOne({zipcode: zipcode});
    this.frm.elements.city.setValue(rec.city);

    var street_opts = [];
    var sts = streets.chain().find({zipcode: zipcode}).simplesort("display_name").data().
        map(function(obj) { return obj.display_name; });
    sts.forEach(function(st) {
      if (!street_opts.includes(st))
        street_opts.push(st);
    });
    //this.frm.elements.street.define("suggest", sts);
    this.frm.elements.street.define("options", street_opts);

    this.set_focus("street");
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
    var p = streets.findOne({
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
    coaFormCtlr.load_zips();
    this.popup.show();
    coaFormCtlr.set_focus("zipcode");
  },

  hide: function() {
    this.popup.hide();
  }
};
