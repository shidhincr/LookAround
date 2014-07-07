"use strict";

// cw: Because javascript really should have had one as a built-in by now.
// From http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
