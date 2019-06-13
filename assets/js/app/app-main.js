/**
 *
 */
define([
        'jquery',
        'snapsvg',
        'elements',
        'functions'],
    function ($, Snap, elements, functions) {

        var init = function () {

            functions.drawLandscape();

            functions.getOverlayTexts();

            functions.setOverlay("start");

            functions.drawViewfinder();

            functions.getAnimals();

            functions.setEventHandlers();

            functions.loadSounds();

            // Array Remove - By John Resig (MIT Licensed)
            Array.prototype.remove = function (from, to) {
                var rest = this.slice((to || from) + 1 || this.length);
                this.length = from < 0 ? this.length + from : from;
                return this.push.apply(this, rest);
            }
        };

        return {
            init: init
        };

    });