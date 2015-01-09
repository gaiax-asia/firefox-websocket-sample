var coords = self.options.coords
var mark = document.createElement('div')
var mark_size = 16 // unit: px
var mark_size_half = mark_size/2
var mark_options = {
  width: mark_size + "px",
  height: mark_size + "px",
  top: (coords[1] - mark_size_half) + "px",
  left: (coords[0] - mark_size_half) + "px",
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

$mark.appendTo('body').fadeOut(7312, function(){this.remove()});