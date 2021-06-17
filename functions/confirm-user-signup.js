const DynamoDB = require('aws-sdk/clients/dynamodb');
const DocumentClint = new DynamoDB.DocumentClient();
const Chance = require('chance');
const chance = new Chance();

const { USER_TABLE } = process.env;

module.exports.handler = async (event) => {
  if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const name = event.request.userAttributes['name'];
    const suffix = chance.string({ length: 8, alpha: 'upper', numeric: true });
    const screenName = `${name.replace(/[^a-zA-Z0-9]/g, '')}${suffix}`;

    const user = {
      id: event.userName,
      name: screenName,
      createdA: new Date().toJSON(),
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likeCount: 0
    };
    await DocumentClint.put({
      TableName: USER_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exits(id)'
    }).promise();
  } else {
    return event;
  }
};
