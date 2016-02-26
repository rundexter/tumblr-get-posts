var _ = require('lodash'),
    util = require('./util.js');

var request = require('request').defaults({
    baseUrl: 'https://api.tumblr.com/v2/'
});

var pickInputs = {
        'base-hostname': 'base_hostname',
        'api_key': 'api_key',
        'type': 'type',
        'limit': 'limit',
        'offset': 'offset'
    },
    pickOutputs = {
        '-': {
            keyName: 'response.posts',
            fields: {
                'blog_name': 'blog_name',
                'id': 'id',
                'post_url': 'post_url',
                'type': 'type',
                'timestamp': 'timestamp',
                'date': 'date',
                'reblog_key': 'reblog_key',
                'tags': 'tags'
            }
        }
    };

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var inputs = util.pickStringInputs(step, pickInputs),
            uriLink = 'blog/' + inputs.base_hostname + '/posts' + (inputs.type? '/' + inputs.type : '');

        if (!inputs.base_hostname || !inputs.api_key)
            return this.fail('A [base-hostname, api_key] need for this module');

        //send API request
        request.put({
            url: uriLink,
            qs: _.omit(inputs, ['base-hostname', 'type']),
            json: true
        }, function (error, response, body) {
            if (error)
                this.fail(error);

            else if (_.parseInt(response.statusCode) !== 200)
                this.fail(body);

            else
                this.complete(util.pickResult(body, pickOutputs));
        }.bind(this));
    }
};
