var FlaskSplit = (function () {
    function validate_experiment_name(experiment_name) {
        if (typeof experiment_name != 'string') {
            throw Error('Experiment name must be a string.');
        }
        if (experiment_name.length == 0) {
            throw Error('Experiment name must be at least one character.');
        }
    }

    function validate_alternatives(alternatives) {
        var alternative;
        if (alternatives.length < 2) {
            throw Error('Must have at least 2 alternatives.');
        }
        for (var i = 0; i < alternatives.length; ++i) {
            alternative = alternatives[i];
            if (typeof alternative != 'string') {
                throw Error('Alternatives must be strings.');
            }
            if (alternative.length == 0) {
                throw Error('Alternatives must be at least one character.');
            }
        }
    }

    function validate_callback(callback) {
        if (typeof callback != 'function') {
            throw Error('Callback must be a function.');
        }
    }

    function validate_reset(reset) {
        if (reset !== true && reset !== false) {
            throw Error('Reset must be true, false or unspecified.');
        }
    }

    function ab_test_request(experiment_name, alternatives, callback) {
        var data = {
            experiment_name: experiment_name,
            alternatives: alternatives
        };
        $.ajax('/split-js/ab-test', {
            accepts: 'application/json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(data),
            dataType: 'json',
            error: function (err) {
                callback(undefined, err);
            },
            processData: false,
            success: function (data) {
                callback(data.alternative);
            },
            type: 'POST'
        });
    }

    function finished_request(experiment_name, reset) {
        var data = {
            experiment_name: experiment_name,
            reset: reset
        };
        $.ajax('/split-js/finished', {
            accepts: 'application/json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(data),
            dataType: 'json',
            processData: false,
            type: 'POST'
        });
    }

    function ab_test(experiment_name, alternatives, callback) {
        validate_experiment_name(experiment_name);
        validate_alternatives(alternatives);
        validate_callback(callback);
        ab_test_request(experiment_name, alternatives, callback);
    }

    function finished(experiment_name, reset) {
        if (arguments.length < 2) {
            reset = true;
        }
        validate_experiment_name(experiment_name);
        validate_reset(reset);
        finished_request(experiment_name, reset);
    }

    return {
        ab_test: ab_test,
        finished: finished
    };
}());

try {
    module.exports = FlaskSplit;
} catch (e) {
    // Ignore "module is not defined".
}
