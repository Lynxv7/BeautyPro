import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      account: schema.accounts,
      session: schema.sessions,
      verification: schema.verifications,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // Expõe salonId no objeto user retornado pela session
  user: {
    additionalFields: {
      salonId: {
        type: "string",
        required: false,
        defaultValue: null,
        input: false,
      },
    },
  },

  // Cria o salão automaticamente após o usuário ser criado
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const salonId = crypto.randomUUID();

          await db.insert(schema.salons).values({
            id: salonId,
            name: `Salão de ${user.name}`,
            ownerName: user.name,
            ownerId: user.id,
          });

          await db
            .update(schema.users)
            .set({ salonId })
            .where(eq(schema.users.id, user.id));
        },
      },
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = AuthSession["user"];
