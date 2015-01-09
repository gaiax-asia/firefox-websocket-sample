var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var ss = require("sdk/simple-storage");
var windows = require("sdk/windows").browserWindows;
var notifications = require("sdk/notifications");
var self             = require("sdk/self");
var {data}           = self;
var pageMod          = require("sdk/page-mod");
var pw               = require("sdk/page-worker");
var tabs = require("sdk/tabs");

var page_mod = pageMod.PageMod({
  include: "*",
  contentScriptFile: [data.url('jquery-1.11.2.min.js'), data.url('script.js')],
  contentStyleFile: [data.url('style.css')],
  onAttach: function(worker) {
    console.log('attached!');
    worker.port.on('mouseClick', function(data) {
      websocket_worker.port.emit('mouseClick', data);
    })
    panel.port.on('mark_page', function(to_username) {
      worker.port.emit('mark_page', to_username);
    })
  }
});

var toggle_button = ToggleButton({
  id: "ping_page",
  label: "Ping Page",
  icon: {
    "16": "./icon-16.png"
  },
  onChange: function(state) {
    if (state.checked) {
      panel.show({
        position: toggle_button
      })
    }
  }
})

var panel = panels.Panel({
  contentURL: data.url("panel.html"),
  contentScriptFile: [data.url('panel.js')],
  height: 100,
  onHide: function() {
    toggle_button.state('window', {checked: false});
  }
});

function websocket_init() {
  websocket_worker = pw.Page({
    contentScriptFile: data.url('websocket.js'),
  });

  websocket_worker.port.on('websocketOnMessage', function(response) {
    var no_http_pattern = /.*:\/\/(.*)/
    var matched;
    var attach_marker = function(tab) {
      tab.attach({
        contentScriptFile: [data.url('jquery-1.11.2.min.js'), data.url('marker.js')],
        contentScriptOptions: response
      })
    }

    for (var tab of tabs) {
      matched = tab.url.match(no_http_pattern)[1] == response.loc.match(no_http_pattern)[1]
      if (matched) {
        attach_marker(tab)
      }
    }
  })
}

panel.port.on('connect', function(from_username) {
  console.log('connecting');
  ss.storage.from_username = from_username;

  if (typeof websocket_worker != 'undefined') {
    websocket_worker.port.emit('destroy_connection', from_username);
  } else {
    websocket_init();
  };
  websocket_worker.port.emit('connect', from_username)
})

if (ss.storage.from_username) {
  websocket_init();
  websocket_worker.port.emit('connect', ss.storage.from_username)
}