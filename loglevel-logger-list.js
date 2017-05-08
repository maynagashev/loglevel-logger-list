/**
 * Plugin for https://github.com/pimterry/loglevel
 *
 * Created by maynagashev (https://github.com/maynagashev).
 *
 * Custom plugin for loglevel for handling loggers list.
 * Rewrites original method getLogger, adds hook for auto-registering new loggers in public list.
 *
 * Also helper methods added: log.all(level), log.only(name, level), log.except(exceptName, level).
 * Note: all helpers affect only custom loggers in list, and doesn't affect default logger.
 */

(function (log) {

    // Public list of loggers
    log.list = [];

    // Register all new loggers in public list
    var original  = log.getLogger;
    log.getLogger = function (name) {

        // Add logger to public list if not in list yet.
        if (log.list.indexOf(name) === -1) {
            log.list.push(name);
        }
        return original(name);
    };

    /* Helpers */

    // Set specified level for all loggers in public list
    log.all = function (level) {
        log.list.map(function (name) {
            log.getLogger(name).setLevel(level);
            verbose(name, level);
        })

    };

    // Set level for specified logger
    log.only = function (name, level) {
        log.getLogger(name).setLevel(level);
        verbose(name, level);
    };

    // Set level for all loggers except specified name
    log.except = function (exceptName, level) {
        log.list.map(function (name) {
            if (name === exceptName) return;
            log.getLogger(name).setLevel(level);
            verbose(name, level);
        })
    };

    // Scoped method to display changes via default logger
    function verbose(name, level) {
        log.info('log.getLogger("'+name+'").setLevel("'+level+'");');
    }

})(window.log);