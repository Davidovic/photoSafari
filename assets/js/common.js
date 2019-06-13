/**
 *
 */
requirejs.config({
    baseUrl: "assets/js",
    paths: {
        app: 'app',
        jquery: [
            // Load from CDN
            '//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min',
            // Local fallback
            'lib/jquery-3.1.1.min'
        ],
        snapsvg: 'lib/snap.svg-min',
        elements: 'app/elements',
        functions: 'app/functions'
    }
});