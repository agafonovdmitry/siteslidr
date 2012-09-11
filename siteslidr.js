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
            'url': 'siteslidr_0.html',
            'duration': 5,
            'transition': 'fade'
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
                var siteid = SiteSlidr.add(config.sites[i])
                stage.sites.push({'site': $('#'+ siteid), 'id': siteid} );
            }
            stage.current = 0;
            stage.root.fadeIn();
            return true;
        };

    // Public interface

    window.SiteSlidr = {

        'version': function () {
            return VERSION.join('.');
        },

        // Create site frame and add to stage.
        // Initial state is hidden and url XXX TODO not loaded XXX.
        'add': function (siteconfig) {
            console.log('add()');
            var siteframe = $("<iframe id='" +
                siteconfig.id + "' class='SiteSlidr_Frame' src='" +
                siteconfig.url + "'></iframe>").hide();
            stage.root.append(siteframe);
            return siteconfig.id;
        },

        'delete': function (siteid) {
            console.log('delete()');
            return false;
        },

        'go': function (siteid) {
            console.log('go()');
            stage.sites[stage.current].site.fadeOut(1000, function () {
                stage.sites[1].site.fadeIn(1000);
            });
        },

        'pause': function () {
            console.log('pause()');
            if (stage.timeout) {
                window.clearTimeout(stage.timeout);
                stage.timeout = null;
            }
        },

        'play': function () {
            console.log('play()');
            if (!stage.timeout) {
                stage.timeout = window.setTimeout(SiteSlidr.next, 5000);
            }
        },

        'rewind': function () {
            console.log('rewind()');
            SiteSlidr.go(stage.sites[0])
        },

        'stop': function () {
            return this.pause() && this.rewind();
        },

        'next': function () {
            console.log('next()');
            stage.sites[stage.current].site.fadeOut(1000, function () {
                if (stage.current === stage.sites.length) {
                    stage.current = 0;
                } else {
                    stage.current += 1;
                }
                console.log(stage.sites);
                stage.sites[stage.current].site.fadeIn(1000);
            });
            window.clearTimeout(stage.timeout);
            stage.timeout = window.setTimeout(SiteSlidr.next, 5000);
        },

        'previous': function () {
            console.log('previous()');
            return false;
        },

        'run': function (config) {
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
            SiteSlidr.rewind();
            SiteSlidr.play();
            console.log(stage);
//            stage.sites[1].fadeOut(1000, function () {
//                stage.sites[1].fadeIn(1000);
//            });
        }

    };
}());
