/**
 * @fileOverview SiteSlidr: Live sites presentation tool
 * @author Dmitry Agafonov <Dmitry@Agafonov.pp.ru>
 * @version 0.0.1
 */


"use strict";

(function () {

    // Private data and functions

    var VERSION = [0, 0, 1],

        stage = {
            'prepared': false,
            'title': null,
            'overlay': null,
            'sites': [],
            'background': null
        },

        site_defaults = {
            'url': 'siteslidr_0.html',
            'duration': 5,
            'transition': 'fade'
        },

        fatal_error = function (e) {
            console.log(e);
            throw ('Error.');
        },

        // We need own reference to jQuery
        // Will be set by init()
        $ = null,

        init = function () {
            console.log('init()');
            // Is everything is ready?
            if (stage.prepared) {
                return true;
            }

            // Check and install jQuery lib
            // XXX TODO XXX
            $ = window.jQuery;

            // Prepare stage
            document.write("<iframe id='SiteA' src='site_a.html'></iframe>");
            document.write("<iframe id='SiteB' src='site_b.html'></iframe>");
            stage.prepared = true;
            return true;
        };

    // Public interface

    window.SiteSlidr = {

        'version': function () {
            return VERSION.join('.');
        },

        'add': function (siteconfig) {
            console.log('add()');
            return false;
        },

        'delete': function (siteid) {
            console.log('delete()');
            return false;
        },

        'go': function (siteid) {
            console.log('go()');
            return false;
        },

        'pause': function () {
            console.log('pause()');
            return true;
        },

        'rewind': function () {
            console.log('rewind()');
            return true;
        },

        'stop': function () {
            return this.pause() && this.rewind();
        },

        'next': function () {
            console.log('next()');
            return false;
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
                    init();
                    this.go(config.sites[0].id);
                }
            } catch (e) {
                fatal_error('SiteSlidr was not configured. Read the docs at http://github.com/agafonovdmitry/siteslidr');
            }
            $('#SiteB').fadeOut(1000, function () {
                $('#SiteB').fadeIn(1000);
            });
        }

    };
}());
