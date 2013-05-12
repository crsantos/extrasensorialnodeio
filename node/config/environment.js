module.exports = function(app, express){
    
    // GENERAL
    app.configure(function() {
        app.use(express.logger('dev'));
        console.log ("General config :: [loaded] ");
    });

    // DEVELOPMENT
    app.configure('development', function() {
        console.log ("DEVELOPMENT config :: [loaded]");
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });

    // PRODUCTION
    app.configure('production', function() {
        console.log ("PRODUCTION config :: [§]");
        app.use(express.errorHandler());
    });
};