self.port.on("mark_page", function(to_username) {
  var mark = document.createElement('div')
  var mark_size = 16 // unit: px
  var mark_size_half = mark_size/2
  var mark_options = {
    width: mark_size + "px",
    height: mark_size + "px",
  }
  var property_value;
  var style = "";
  for (var property in mark_options) {
    property_value = mark_options[property];
    style = style + property + ":" + property_value + "; ";
  }

  mark.setAttribute("style", style)
  mark.setAttribute("class", 'ping_page-mark')
  var $mark = $(mark);
  $mark.appendTo('body')

  document.onmousemove = function(e) {
    $mark.css({
      top: e.pageY - mark_size_half,
      left: e.pageX - mark_size_half
    })
  }

  document.onmousedown = function(e) {
    document.onmousemove = null
    $mark.remove();
    console.log("lolwat=>", e.pageY, e.clientY);
    self.port.emit('mouseClick', JSON.stringify({to_username: to_username, loc: window.location.href, coords: [e.pageX, e.pageY]}));
    document.onmousedown = null
  }
})