/**
 * @fileOverview SiteSlidr: Live sites presentation tool
 * @author Dmitry Agafonov <Dmitry@Agafonov.pp.ru>
 * @version 0.0.1
 */


"use strict";

(function () {

    // Private data and functions

    var VERSION = [0, 0, 1],

        version = function () {
            return VERSION.join('.');
        },

        // Default settings for an app
        defaults = {
            'background': '#333'
        },

        // Default site settings
        // (site is a synonym for slide here and below)
        site_defaults = {
            'id': null,
            'url': 'siteslidr_0.html',
            'duration': 5000,
            'transition': {'type': 'fade', 'duration': 500},
            'elem': null
        },

        // Runtime data
        stage = {
            'root': null,
            'title': null,
            'overlay': null,
            'sites': [],
            'current': 0,
            'next': 0,
            'total': 0,
            'background': null,
            'timer': null,
            'busy': false
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
//            console.log('init()');
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

            stage.root.append('<div id="SiteSlidr_Overlay"></div>');

            stage.root.append('<div id="SiteSlidr_Control"><p></p></div>');
            var ctlPlay = $('<span id="SiteSlidr_Play">Play</span>').on('click', function () {
                play(false);
            });
            var ctlStop = $('<span id="SiteSlidr_Stop">Stop</span>').on('click', stop);
            var ctlPause = $('<span id="SiteSlidr_Pause">Pause</span>').on('click', pause);
            var ctlPrevious = $('<span id="SiteSlidr_Previous">Previous</span>').on('click', previous);
            var ctlNext = $('<span id="SiteSlidr_Next">Next</span>').on('click', next);
            $('#SiteSlidr_Control p')
                .append(ctlStop)
                .append(ctlPlay)
                .append(ctlPause)
                .append(ctlPrevious)
                .append(ctlNext)
                .append('<span id="SiteSlidr_Counter"></span>');

            // Apply user's defaults
            $.extend(site_defaults, config.site_defaults);

            // Add all the slides to stage
            for (var i = config.sites.length - 1; i >= 0; i--) {
                add(config.sites[i]);
            }
            //console.log(stage.sites)
            stage.current = 0;
            stage.root.fadeIn();
            return true;
        },

        // Create site frame and add to stage.
        // Initial state is hidden and url XXX TODO not loaded XXX.
        add = function (siteconfig) {
//            console.log('add()');
            var site = $.extend({}, site_defaults, siteconfig);
            site.elem = $("<iframe id='" +
                site.id + "' class='SiteSlidr_Frame' src='" +
                site.url + "'></iframe>").hide();
            // Don't mess presentation by long transitions
            if (site.transition.duration > site.duration/2) {
                site.transition.duration = site.duration/2;
            }
            stage.root.append(site.elem);
            stage.sites.unshift(site);
            stage.total = stage.sites.length;
            return site.id;
        },

        del = function (siteid) {
//            console.log('del()');
            return false;
        },

//        go = function (siteid) {
//            console.log('go()');
//            stage.sites[stage.current].hide();
//            stage.sites[1].show();
//        },

        pause = function () {
//            console.log('pause()');
            if (stage.timeout) {
                window.clearTimeout(stage.timeout);
                stage.timeout = null;
                $('#SiteSlidr_Control')
                    .addClass('paused')
                    .removeClass('playing');
            }
        },

        rewind = function () {
//            console.log('rewind()');
            stage.next = 0;
            switcher();
        },

        stop = function () {
            pause();
            rewind();
        },

        // Hide current and show new slide
        switcher = function () {
//            console.log('switcher('+stage.current+','+stage.next+')');
            var cur = stage.sites[stage.current],
                nxt = stage.sites[stage.next];
            $('#SiteSlidr_Counter').html((stage.next + 1) + '/' + stage.total);
            if (stage.busy) {
                console.log('Stage busy!');
                return;
            }
            stage.busy = true;
            nxt.elem.addClass('front').fadeIn(nxt.transition.duration, function () {
                nxt.elem.removeClass('front');
                if (cur.id !== nxt.id) {
                    cur.elem.hide();
                }
                stage.current = stage.next;
                stage.busy = false;
            });
        },

        play = function (forward) {
            //console.log('play()');
            window.clearTimeout(stage.timeout);
            if (forward !== false) {
                next();
            }
            stage.timeout = window.setTimeout(play, stage.sites[stage.next].duration);
            $('#SiteSlidr_Control')
                .addClass('playing')
                .removeClass('paused');
        },

        next = function () {
            //console.log('next()');
            stage.next = stage.current + 1;
            if (stage.next === stage.total) {
                stage.next = 0;
            }
            switcher();
        },

        previous = function () {
            console.log('previous()');
            stage.next = stage.current - 1;
            if (stage.next === -1) {
                stage.next = stage.total - 1;
            }
            switcher();
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
            play(false);
//            console.log(stage);
        }

    //
    // Public interface
    //
    window.SiteSlidr = {
        'run': run
    };

}());
