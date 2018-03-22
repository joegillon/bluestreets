/**
 * Created by Joe on 3/13/2017.
 */

function add2list(list_name, sort_fld, obj) {
  //$$(list_name).data.push(obj);
  var list_id = $$(list_name).add(obj);
  $$(list_name).data.sort(sort_fld, "asc");
  $$(list_name).refresh();
  $$(list_name).select(list_id);
}

function twoDigits(d) {
  if (0 <= d && d < 10) return "0" + d.toString();
  return d.toString();
}

function toSQLDate(d) {
  return d.getFullYear().toString() + "-" +
    twoDigits(d.getMonth() + 1) + "-" +
    twoDigits(d.getDate());
}

function toSQLDateTime(d, t) {
  return toSQLDate(d) + " " +
      twoDigits(t.getHours()) + ":" +
      twoDigits(t.getMinutes());
}

function phone_prettify(phone) {
  if (!phone) return "";
  if (phone.match(/^\(\d{3}\)\d{3}-\d{4}$/)) return phone;
  return "(" + phone.substr(0,3) + ")" + phone.substr(3,3) + "-" + phone.substr(6);
}

function phone_uglify(phone) {
  return phone.replace(/\D/g, '');
}

function isPhone(value) {
  value = phone_uglify(value);
  return value == "" || value.match(/^\d{10}$/);
}

function isZip(value) {
  return value == "" || value.match(/^\d{5}$/);
}

function isEmail(value) {
  return value == "" || value.match(/(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})/);
}

function sortByName(a, b) {
  if (a.last_name == b.last_name) {
    if (a.first_name == b.first_name) {
      return (a.middle_name > b.middle_name) ? 1 : -1;
    } else {
      return (a.first_name > b.first_name) ? 1 : -1;
    }
  } else {
    return (a.last_name > b.last_name) ? 1 : -1;
  }
}

function ajaxAsyncGet(url, params) {
  webix.ajax(url, params).
    then(function(result) {
      return result.json();
  }).
    fail(function(xhr) {
      var response = JSON.parse(xhr.response);
      throw resonse.error.message;
  });
}

function ajaxAsyncPost(url, params) {
  webix.ajax().post(url, params).
    then(function(result) {
      return result.json();
  }).
    fail(function(xhr) {
      var response = JSON.parse(xhr.response);
      webix.message({type: "error", text: response.error.message});
  });
}

function ajaxSyncGet(url, params, result) {
  webix.ajax().sync().get(url, params, {
    error: function (text, data, XmlHttpRequest) {
      msg = "Error " + XmlHttpRequest.status + ": " + XmlHttpRequest.statusText;
      webix.message({type: "error", text: msg});
      result = null;
    },
    success: function (text, data, XmlHttpRequest) {
      result = data.json();
    }
  });
}

function wholeName(names) {
  var result = names.last + ", " + names.first;
  if (names.middle) {
    result += " " + names.middle;
  }
  if (names.suffix) {
    result += ", " + names.suffix;
  }
  return result;
}

function wholeAddress(addr) {
  var result = addr.street_address;
  if (addr.city) {
    result += ", " + addr.city;
  }
  return result;
}

var redLocationFields = [
  "jurisdiction", "ward", "precinct", "city", "county", "zip"
];

var pinkLocationFields = [
  "voter_id", "state_house", "state_senate", "congress"
];

function missingLocationData(rec) {
  var result = [];
  for (var i=0; i<redLocationFields.length; i++) {
    if (!rec.hasOwnProperty(redLocationFields[i]) || rec[redLocationFields[i]] == "") {
      result.push(redLocationFields[i]);
    }
  }
  if (result) {
    return result;
  }
}

function sortAddress(a, b) {
  var numA = parseInt(a.address);
  var numB = parseInt(b.address);
  var stA = a.address.match(/[A-Z A-Z]+/)[0].trim();
  var stB = b.address.match(/[A-Z A-Z]+/)[0].trim();
  if (stA == stB)
    return (numA > numB) ? 1 : -1;
  else
    return (stA > stB) ? 1 : -1;
}

function exportGrid(grid) {
  var filename = prompt("Enter a filename", "Data");
  if (filename === null) {
    return;
  }

  webix.csv.delimiter.rows = "\n";
  webix.csv.delimiter.cols = ",";
  webix.toCSV(grid, {
    ignore: {"id": true},
    filename: filename
  });
}

function getWebixList(list) {
  var items = [];
  for (var i=0; i<list.count(); i++) {
    items.push(list.getItem(list.getIdByIndex(i)));
  }
  return items;
}