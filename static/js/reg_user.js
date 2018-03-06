/**
 * Created by Joe on 6/25/2017.
 */

var regUserForm = {
  view: "form",
  id: "regUserForm",
  elements: [
    {view: "text", name: "next", hidden: true},
    {view: "text", name: "csrf_token", hidden: true},
    {
      view: "text",
      label: "Email:",
      name: "email",
      width: 200,
      validate: isEmail,
      invalidMessage: "Invalid email address",
      on: {
        onBlur: function() {
          // check to see if exists in volunteers
        }
      }
    },
    {
      view: "button",
      label: "Generate Password",
      id: "genPwButton"

    },
    {
      view: "text",
      label: "Password:",
      name: "password",
      type: "password",
      width: 200,
      validate: webix.rules.isNotEmpty(),
      invalidMessage: "Must have password!"
    },
    {
      view: "text",
      label: "Retype Password:",
      name: "password_confirm",
      type: "password",
      width: 200,
      validate: webix.rules.isNotEmpty(),
      invalidMessage: "Must confirm password!"
    },
    {
      view: "button",
      label: "Register",
      id: "regButton",
      click: function() {
        var values = $$("regUserForm").getValues();
        var url = Flask.url_for("security.register");
        var dct = {
          email: values["email"],
          password: values["password"],
          password_confirm: values["password_confirm"]
        };
        webix.ajax().post(url, dct, {
          error: function(text, data, XmlHttpRequest) {
            var msg = "Error " + XmlHttpRequest.status + ": " + XmlHttpRequest.statusText;
            webix.message({type: "error", text: msg});
          },
          success: function(text, data, XmlHttpRequest) {
            webix.message("bingo");
          }
        });
      }
    }
  ]
};