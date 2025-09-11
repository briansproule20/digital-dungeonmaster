import Echo from '@merit-systems/echo-next-sdk';

export const { 
  handlers, 
  getUser,
  isSignedIn,
  openai,
  anthropic
} = Echo({
  appId: "411d193c-df4f-4fc1-9fd5-26e4eed7eb94"
});

export { signIn, useEcho } from '@merit-systems/echo-next-sdk/client';