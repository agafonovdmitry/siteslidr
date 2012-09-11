/**
 * @fileOverview SiteSlidr: Live sites presentation tool
 * @author Dmitry Agafonov <Dmitry@Agafonov.pp.ru>
 * @version 0.0.1
 */


"use strict";

(function () {

    // Private data and functions

    var VERSION = [0, 0, 1],

        // Default settings for an app
        defaults = {
            'background': '#333'
        },

        // Default site settings
        // (site is a synonym for slide here and below)
        site_defaults = {
            'id': null,
            'url': 'siteslidr_0.html',
            'duration': 1000,
            'transition': {'type': 'fade', 'duration': 100},
            'elem': null,
            'show': function (callback) {
                //console.log(this);
                this.elem.fadeIn(this.transition.duration, callback);
            },
            'hide': function (callback) {
                //console.log(this);
                this.elem.fadeOut(this.transition.duration, callback);
            }
        },

        // Runtime data
        stage = {
            'root': null,
            'title': null,
            'overlay': null,
            'sites': [],
            'current': 0,
            'background': null,
            'timer': null
        },

        // XXX remove???
        fatal_error = function (e) {
            console.log(e);
            throw ('Error.');
        },

        // We need own reference to jQuery
        // Will be set by init()
        $ = null,

        // Set all things up
        init = function (config) {
            console.log('init()');
            // Is stage ready?
            if (stage.root) {
                return true;
            }

            // Check and install jQuery lib
            // XXX TODO install from cdn if not available here XXX
            $ = window.jQuery;

            // Prepare the stage, if not defined by user
            stage.root = $('#SiteSlidr_Stage');
            if (stage.root.length === 0) {
                stage.root = $('<div id="SiteSlidr_Stage"></div>').hide();
                $('body').append(stage.root);
            }

            // Add all the slides to stage
            for (var i = config.sites.length - 1; i >= 0; i--) {
                stage.sites.push(add(config.sites[i]));
            }
//            console.log(stage.sites)
            stage.current = 0;
            stage.root.fadeIn();
            return true;
        },

        version = function () {
            return VERSION.join('.');
        },

        // Create site frame and add to stage.
        // Initial state is hidden and url XXX TODO not loaded XXX.
        add = function (siteconfig) {
            console.log('add()');
            var site = $.extend({}, site_defaults, siteconfig);
            site.elem = $("<iframe id='" +
                site.id + "' class='SiteSlidr_Frame' src='" +
                site.url + "'></iframe>").hide();
            stage.root.append(site.elem);
            return site;
        },

        del = function (siteid) {
            console.log('del()');
            return false;
        },

        go = function (siteid) {
            console.log('go()');
            stage.sites[stage.current].hide();
            stage.sites[1].show();
//            stage.sites[stage.current].site.fadeOut(1000, function () {
//                stage.sites[1].site.fadeIn(1000);
//            });
        },

        pause = function () {
            console.log('pause()');
            if (stage.timeout) {
                window.clearTimeout(stage.timeout);
                stage.timeout = null;
            }
        },

        play = function () {
            console.log('play()');
            if (!stage.timeout) {
                stage.timeout = window.setTimeout(next, 500);
            }
        },

        rewind = function () {
            console.log('rewind()');
            go(stage.sites[0])
        },

        stop = function () {
            return this.pause() && this.rewind();
        },

        next = function () {
            console.log('next()');
            stage.sites[stage.current].hide(function () {
                if (stage.current === stage.sites.length - 1) {
                    stage.current = 0;
                } else {
                    stage.current += 1;
                }
                console.log(stage.current);
                stage.sites[stage.current].show();
            });
            window.clearTimeout(stage.timeout);
            stage.timeout = window.setTimeout(next, 500);
        },

        previous = function () {
            console.log('previous()');
            return false;
        },

        run = function (config) {
            try {
                if (config.sites[0].url === '') {
                    throw ('NotConfigured');
                } else {
                    init(config);
                }
            } catch (e) {
                fatal_error('SiteSlidr was not properly configured:' + e + ' ' +
                'Read the docs at http://github.com/agafonovdmitry/siteslidr');
            }
            rewind();
            play();
//            console.log(stage);
        }

    //
    // Public interface
    //
    window.SiteSlidr = {
        'run': run
    };

}());
