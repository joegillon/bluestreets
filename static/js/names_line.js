/**
 * Created by Joe on 8/7/2017.
 */

var namesLine = {
  cols: [
    {
      view: "text",
      label: "Last Name",
      labelAlign: "left",
      name: "last_name",
      width: 200,
      validate: webix.rules.isNotEmpty,
      invalidMessage: "Last name required"
    },
    {
      view: "text",
      label: "First Name",
      labelAlign: "left",
      name: "first_name",
      width: 100,
      validate: webix.rules.isNotEmpty,
      invalidMessage: "First name required"
    },
    {
      view: "text",
      label: "Middle",
      labelAlign: "left",
      name: "middle_name",
      width: 100
    },
    {
      view: "text",
      label: "Suffix",
      labelAlign: "left",
      name: "name_suffix",
      width: 50
    }
  ]
};