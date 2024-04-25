import * as dotenv from 'dotenv';
dotenv.config();

import * as cognito from '@aws-sdk/client-cognito-identity-provider';

const congitoClient = new cognito.CognitoIdentityProviderClient({
  region: 'us-east-1',
});

import Chance from 'chance';
const chance = new Chance();

let firstName: string | undefined;

const createUser = () => {
  firstName = chance.first({ nationality: 'en' });

  const lastName = chance.first({ nationality: 'en' });
  const suffix = chance.string({ length: 8, pool: 'qwertyuiopasdfghjklx' });
  const email = `${firstName}-${lastName}-${suffix}@serverlesscreed.com`;
  const password = chance.string({ length: 10 });

  return {
    email,
    password,
  };
};

describe('Auth Test Flow', () => {
  let email: string | undefined;
  let password: string | undefined;
  let userPoolId: string | undefined;
  let clientId: string | undefined;

  beforeAll(() => {
    const user = createUser();
    email = user.email;
    password = user.password;
    userPoolId = process.env.USER_POOL_ID;
    clientId = process.env.CLIENT_POOL_ID;
  });

  it(`User exists in User Pool and User's Table`, async () => {
    console.log(`[${email}] = signing up...`);
    const signupCommand = new cognito.SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'name',
          Value: firstName,
        },
      ],
    });

    const signupResponse = await congitoClient.send(signupCommand);
    const userSub = signupResponse.UserSub;

    console.log(`[${userSub}] - confirming signup...`);
    const adminCommand: cognito.AdminConfirmSignUpCommandInput = {
      UserPoolId: userPoolId as string,
      Username: userSub as string,
    };

    try {
      await congitoClient.send(
        new cognito.AdminConfirmSignUpCommand(adminCommand)
      );
    } catch (e) {
      console.error('Error confirming sign up!');
    }
  });
});
