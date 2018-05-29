/**
 * Created by Joe on 5/2/2018.
 */

var AbstractTurf = function() {
  if (this.constructor == AbstractTurf)
    throw new Error("Cannot instantiate abstract class");
};

AbstractTurf.prototype.setNext = function(next) {
  this.next = next;
};

var CountyClass = function() {
  AbstractTurf.apply(this, arguments);
};

CountyClass.prototype = Object.create(AbstractTurf.prototype, {
  "constructor": CountyClass
});