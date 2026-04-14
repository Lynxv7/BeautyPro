import {
  pgTable,
  pgEnum,
  text,
  integer,
  numeric,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

//
// SALONS
//
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled",
  "completed",
  "cancelled",
  "no_show",
]);

export const salons = pgTable("salons", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  name: text("name").notNull(),

  ownerName: text("owner_name"),

  // ownerId sem FK explícito para evitar dependência circular com users
  ownerId: text("owner_id").notNull().default(""),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

//
// USERS (Better Auth)
//
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  name: text("name").notNull(),

  email: text("email").notNull().unique(),

  emailVerified: boolean("email_verified").default(false),

  image: text("image"),

  // Preenchido automaticamente após criação do salão
  salonId: text("salon_id"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//
// ACCOUNTS (Better Auth)
//
export const accounts = pgTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  providerId: text("provider_id").notNull(),
  accountId: text("account_id").notNull(),

  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),

  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    withTimezone: true,
  }),

  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),

  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//
// SESSIONS (Better Auth)
//
export const sessions = pgTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("user_id")
    .notNull()
    .references(() => users.id),

  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  token: text("token").notNull().unique(),

  ipAddress: text("ip_address"),

  userAgent: text("user_agent"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//
// VERIFICATION (Better Auth)
//
export const verifications = pgTable("verifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  identifier: text("identifier").notNull(),

  value: text("value").notNull(),

  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//
// CLIENTS
//
export const clients = pgTable("clients", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  salonId: text("salon_id")
    .notNull()
    .references(() => salons.id),

  name: text("name").notNull(),

  whatsapp: text("whatsapp"),

  email: text("email"),

  notes: text("notes"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

//
// SERVICES
//
export const services = pgTable("services", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  salonId: text("salon_id")
    .notNull()
    .references(() => salons.id),

  name: text("name").notNull(),

  durationMinutes: integer("duration_minutes").notNull(),

  priceCents: integer("price_cents").notNull(),

  type: text("type"),

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

//
// APPOINTMENTS
//
export const appointments = pgTable("appointments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  salonId: text("salon_id")
    .notNull()
    .references(() => salons.id),

  clientId: text("client_id")
    .notNull()
    .references(() => clients.id),

  serviceId: text("service_id")
    .notNull()
    .references(() => services.id),

  startsAt: timestamp("starts_at", {
    withTimezone: true,
  }).notNull(),

  status: appointmentStatusEnum("status").default("scheduled").notNull(),

  priceCents: integer("price_cents").notNull().default(0),

  // Preenchido ao concluir
  paymentMethod: text("payment_method"), // "card" | "cash" | "pix"
  amountPaidCents: integer("amount_paid_cents"),
  amountOwedCents: integer("amount_owed_cents"),

  notes: text("notes"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

//
// RELATIONS
//
export const salonRelations = relations(salons, ({ many }) => ({
  clients: many(clients),
  services: many(services),
  appointments: many(appointments),
}));

export const clientRelations = relations(clients, ({ one, many }) => ({
  salon: one(salons, { fields: [clients.salonId], references: [salons.id] }),
  appointments: many(appointments),
}));

export const serviceRelations = relations(services, ({ one, many }) => ({
  salon: one(salons, { fields: [services.salonId], references: [salons.id] }),
  appointments: many(appointments),
}));

export const appointmentRelations = relations(appointments, ({ one }) => ({
  salon: one(salons, {
    fields: [appointments.salonId],
    references: [salons.id],
  }),
  client: one(clients, {
    fields: [appointments.clientId],
    references: [clients.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));

// TS Types
export type Salon = typeof salons.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type AppointmentStatus =
  (typeof appointmentStatusEnum.enumValues)[number];
