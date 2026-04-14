import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

//
// SALONS (multi-tenant)
//
export const salons = pgTable("salons", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  ownerName: text("owner_name"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

//
// USERS (admin / funcionários)
//
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  salonId: uuid("salon_id")
    .references(() => salons.id)
    .notNull(),

  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),

  role: text("role").default("admin"), // admin | staff

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

//
// CLIENTS
//
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),

  salonId: uuid("salon_id")
    .references(() => salons.id)
    .notNull(),

  name: text("name").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email"),
  notes: text("notes"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

//
// SERVICES
//
export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),

  salonId: uuid("salon_id")
    .references(() => salons.id)
    .notNull(),

  name: text("name").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  priceCents: integer("price_cents").notNull(),

  type: text("type"), // corte, unha, etc

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

//
// APPOINTMENTS (o coração do sistema)
//
export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),

  salonId: uuid("salon_id")
    .references(() => salons.id)
    .notNull(),

  clientId: uuid("client_id")
    .references(() => clients.id)
    .notNull(),

  serviceId: uuid("service_id")
    .references(() => services.id)
    .notNull(),

  userId: uuid("user_id").references(() => users.id), // quem vai atender

  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),

  priceCents: integer("price_cents").notNull(),

  paymentMethod: text("payment_method"), // pix, dinheiro, cartao
  status: text("status").default("agendado"),
  // agendado | confirmado | cancelado | concluido

  notes: text("notes"),

  googleEventId: text("google_event_id"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
