//port and other server side information come in here

var environments = {};

environments.staging = {
    'port': 8000,
    'envName': 'staging',
    'hashingSecret': 'thisIsASecret'
}

environments.production = {
    'port': 5050,
    'envName': 'production',
    'hashingSecret': 'thisIsASecret'
}

var environment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

var environmentToExport = typeof(environments[environment]) == 'object' ? environments[environment] : environments.staging

module.exports = environmentToExport;