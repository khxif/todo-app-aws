import { PostConfirmationTriggerHandler } from 'aws-lambda';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { usersTable } from '../db/schema';

export const handler: PostConfirmationTriggerHandler = async event => {
  try {
    const attrs = event.request.userAttributes;

    const user = {
      email: attrs?.email,
      name: attrs?.name || attrs?.given_name || 'User',
      picture: attrs?.picture ?? '',
    };

    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user.email));

    if (!existingUser) await db.insert(usersTable).values(user);

    return event;
  } catch (error) {
    console.error('ERROR:', error);
    return event;
  }
};
