"use client";

import { Amplify } from "aws-amplify";
import { ResourcesConfig } from "@aws-amplify/core";

const config: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string,
      signUpVerificationMethod: "code",
    },
  },
};

Amplify.configure(config, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
