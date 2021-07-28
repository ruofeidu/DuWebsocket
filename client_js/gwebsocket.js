"use strict";
var connection = null;
var clientID = 0;

function utf8_to_b64( str ) {
  return window.btoa(unescape(encodeURIComponent( str )));
}

function b64_to_utf8( str ) {
  return decodeURIComponent(escape(window.atob( str )));
}

var IP = b64_to_utf8("Zy5kdXJ1b2ZlaS5jb20=");
var PREFIX_GET = "get ";
var PREFIX_SET = "set ";
var APP_NAME = "App";
var PORT = 8585;

function connect() {
  var serverUrl;
  var scheme = "ws";
  if (document.location.protocol === "https:") {
    scheme += "s";
  }
  serverUrl = scheme + "://" + IP;

  connection = new WebSocket(serverUrl, "json");
  // console.log("Created WebSocket");

  connection.onopen = function(evt) {
    console.log("On open WebSocket");
    // document.getElementById("text").disabled = false;
    // document.getElementById("send").disabled = false;
  };

  connection.onmessage = function(evt) {
    // console.log("On Message");
    var msg = evt.data;
    // var msg = JSON.parse(evt.data);
    // console.log("Message received: ");
    // console.dir(msg);

    var pos = msg.indexOf(':');
    if (pos < 0) {
      return;
    }
    var k = msg.substr(0, pos);
    var v = msg.substr(pos + 1);

    if (k == $("#keyword").val()) {
      $("#result").val(v);
    }
  };
  // console.log("Created OnMessage");
}

function send(str) {
  connection.send(str);
  // document.getElementById("text").value = "";
}

function set(k, v) {
  send(PREFIX_SET + k + " " + v);
}

function get(k) {
  send(PREFIX_GET + k);
}

$(document).ready(function() {

  connect();

  $("#gGet").click(function() {
    console.log($("#keyword").val());
    get($("#keyword").val());
  });

  $("#gSet").click(function() {
    console.log($("#keyword").val());
    console.log($("#result").val());

    set($("#keyword").val(), $("#result").val());
  });
});

