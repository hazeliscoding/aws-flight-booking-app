import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { ResourcesConfig,AuthConfig } from '@aws-amplify/core';

const config: ResourcesConfig = {
 Auth: {
  Cognito: {
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
    userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string,
    signUpVerificationMethod: "code",
 }
}
}
export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});
