const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const env       = require('./env');

async function reportMostRecentContentRequest() {

    const dynamoDbClientConfig = {
        region: 'eu-north-1',
    };

    if (env.isLocal) {
        dynamoDbClientConfig.endpoint = 'http://host.docker.internal:8000'; // Local DynamoDB URL
        dynamoDbClientConfig.credentials = { // Dummy credentials for local DynamoDB
            accessKeyId: 'dummy',
            secretAccessKey: 'dummy'
        };
    }

    const client = new DynamoDBClient(dynamoDbClientConfig);
    const docClient = DynamoDBDocumentClient.from(client);

    try {
        const command = new ScanCommand({
            TableName: env.ddbTable
        });

        const response = await docClient.send(command);
        const items = response.Items;

        // If data in database contains 'ts'
        const sortedItems = items.map(item => ({
            requestId: item.requestId,
            ts: item.data.ts
        })).sort((a, b) => new Date(b.ts) - new Date(a.ts))
            .slice(0, 5);

        // If data in database does not contains 'ts'
        // const sortedItems = items.map(item => ({
        //     requestId: item.requestId,
        // })).sort((a, b) => new Date(b.requestId) - new Date(a.requestId))
        //    .slice(0, 5);

        console.log("Most recent 5 requests:", sortedItems);
    } catch (error) {
        console.error("Error fetching requests from db:", error);
    }
}

reportMostRecentContentRequest();
