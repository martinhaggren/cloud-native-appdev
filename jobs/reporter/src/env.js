const env = require('env-var');

const isLocal = !env.get('COPILOT_SERVICE_NAME').asString();
const ddbTable = env.get('CONTENT_NAME_DDB_TABLE_NAME').asString()

module.exports = {
    isLocal,
    ddbTable
};