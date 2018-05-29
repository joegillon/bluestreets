/**
 * Created by Joe on 8/7/2017.
 */

var addressLine = {
  cols: [
    {
      view: "text",
      label: "Address",
      name: "address",
      width: 300
    },
    {
      view: "text",
      label: "City",
      name: "city",
      value: "",
      width: 100
      //suggest: cities
    },
    {
      view: "text",
      label: "Zip",
      name: "zipcode",
      width: 70,
      validate: isZip,
      invalidMessage: "Invalid zip code"
    }
  ]
};
