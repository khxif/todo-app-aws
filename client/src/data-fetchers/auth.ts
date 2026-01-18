import { fetchUserAttributes } from 'aws-amplify/auth';

export async function getAuthenticatedUser() {
  const user = await fetchUserAttributes();
  return user;
}
