/**
 * Plugin for https://github.com/pimterry/loglevel
 *
 * Created by maynagashev (https://github.com/maynagashev).
 *
 * Custom plugin for loglevel for handling loggers list.
 * Rewrites original method getLogger, adds hook for auto-registering new loggers in public list.
 *
 * Also helper methods added:
 *      log.all(level)                  - set specified level for all custom loggers
 *      log.set(name, level)            - also can pass an array of names
 *      log.except(exceptName, level)   - set level for all, except specified, also can pass an array of excepted names
 *      log.loggers()                   - show list of registered loggers with current level value
 *
 * New Props:
 *      log.list                        - array of registered loggers
 *      log.levels                      - available levels array
 *
 * Note: all helpers affect only custom loggers in list, and doesn't affect default logger.
 */

(function (log) {

    var levels = ['trace', 'debug', 'info', 'warn', 'error', 'silent'];

    log.levels = levels;    // Public list of available levels

    log.list = [];          // Public list of loggers, use log.loggers() to inspect current levels

    // Register all new loggers in public list
    var original  = log.getLogger;
    log.getLogger = function (name) {
        
        // Add logger to public list if not in list yet.
        if (log.list.indexOf(name) === -1) {
            log.list.push(name);
        }
        return original(name);
    };

    // Show list of registered loggers with current level value
    log.loggers = function () {
        log.list.map(function (name) {
            var level = levels[log.getLogger(name).getLevel()];
            var text  = level + ' => ' + name;
            (level === 'silent') ? log.warn(text) : log.info(text);
        });
        return log.list.length;
    };

    // Set level for all custom loggers at once
    log.all = function (level) {
        log.list.map(function (name) {
            log.getLogger(name).setLevel(level);
            verbose(name, level);
        })
    };

    // Set level for specified logger (or array of loggers)
    log.set = function (name, level) {
        if (name.constructor === Array) {
            name.map(function (n) {
                log.getLogger(n).setLevel(level);
                verbose(n, level);
            });
        }
        else {
            log.getLogger(name).setLevel(level);
            verbose(name, level);
        }
    };

    // Set level for all loggers except specified name (or array of names)
    log.except = function (exceptName, level) {
        var exceptArray = (exceptName.constructor === Array) ? exceptName : [];
        log.list.map(function (name) {
            // if name excepted OR exists in excepted array, then skip
            if (name === exceptName || exceptArray.indexOf(name) !== -1) return;

            log.getLogger(name).setLevel(level);
            verbose(name, level);
        })
    };

    // Scoped method to display changes via default logger
    function verbose(name, level) {
        log.info('log.getLogger("' + name + '").setLevel("' + level + '");');
    }

})(window.log);