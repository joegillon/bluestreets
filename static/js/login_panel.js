/**
 * Created by Joe on 12/7/2017.
 */

/*=====================================================================
Login Form
=====================================================================*/
var loginForm = {
  view: "form",
  id: "loginForm",
  elements: [
    {
      view: "text",
      name: "username",
      label: "Username",
      width: 300,
      invalidMessage: "Username is required!"
    },
    {
      view: "text",
      name: "password",
      label: "Password",
      type: "password",
      width: 300,
      invalidMessage: "Password is required!"
    },
    {
      view: "button",
      value: "Login",
      type: "form",
      click: function() {
        loginFormCtlr.login();
      }
    }
  ],
  rules: {
    "username": webix.rules.isNotEmpty,
    "password": webix.rules.isNotEmpty
  }
};

/*=====================================================================
Login Form Controller
=====================================================================*/
var loginFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("loginForm");
  },

  login: function() {
    if (!this.frm.validate())
      return null;

    var values = this.frm.getValues();

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("usr.login");
    ajaxDao.post(url, values, function(response) {
      if (response.error) {
        webix.message({type: "error", text: response.error})
      }
      else
        webix.message(response.msg);
    })
  }
};

/*=====================================================================
Login Panel
=====================================================================*/
var loginPanel = {
  type: "space",
  css: "panel_layout",
  rows: [loginForm]
};

/*=====================================================================
Login Panel Controller
=====================================================================*/
var loginPanelCtlr = {
  init: function() {
    loginFormCtlr.init();
  }
};