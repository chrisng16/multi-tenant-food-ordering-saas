import {
  boolean,
  check,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { relations, sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("sessions_userId_idx").on(table.userId)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("accounts_userId_idx").on(table.userId)],
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

// --------------------
// TENANT: Stores
// --------------------
export const stores = pgTable(
  "stores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logoUrl: text("logo_url"),
    description: text("description"),
    timezone: text("time_zone").notNull(),
    phone: text("phone"),
    email: text("email"),
    address: text("address"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("stores_user_id_idx").on(table.userId),
    index("stores_slug_idx").on(table.slug),
    check("slug_not_empty", sql`${table.slug} <> ''`),
  ],
);

// --------------------
// Store Weekly Operating Hours
// --------------------
export const dayOfWeekEnum = pgEnum("day_of_week", [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
]);

export const storeWeeklyRanges = pgTable(
  "store_weekly_ranges",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),
    startMin: integer("start_min").notNull(),
    endMin: integer("end_min").notNull(),
    label: text("label"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("weekly_ranges_store_day_idx").on(
      table.storeId,
      table.dayOfWeek,
      table.startMin,
    ),
  ],
);

export const overrideStatusEnum = pgEnum("override_status", [
  "closed",
  "open",
  "open24",
]);

export const storeDateOverridesFlat = pgTable(
  "store_date_overrides_flat",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),

    // Local date in store timezone, YYYY-MM-DD
    localDate: text("local_date").notNull(),

    // closed | open | open24
    status: overrideStatusEnum("status").notNull(),

    // Minutes since midnight local; nullable for status-only rows
    startMin: integer("start_min"),
    endMin: integer("end_min"),

    label: text("label"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index("override_flat_store_date_idx").on(t.storeId, t.localDate, t.startMin),
    unique("override_flat_unique_range").on(
      t.storeId,
      t.localDate,
      t.startMin,
      t.endMin,
    ),
  ],
);

// --------------------
// Menu Items
// --------------------
export const menuItems = pgTable("menu_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// --------------------
// Add-ons for Menu Items
// --------------------
export const menuItemAddOns = pgTable("menu_item_addons", {
  id: uuid("id").defaultRandom().primaryKey(),
  menuItemId: uuid("menu_item_id")
    .notNull()
    .references(() => menuItems.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: numeric("price").notNull().default("0"),
  required: boolean("required").default(false).notNull(), // required vs optional
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --------------------
// Orders (customer orders)
// --------------------
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status", {
    enum: ["pending", "confirmed", "completed", "cancelled"],
  })
    .default("pending")
    .notNull(),
  totalPrice: numeric("total_price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --------------------
// Order Items (links orders to menu items + addons chosen)
// --------------------
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: uuid("menu_item_id")
    .notNull()
    .references(() => menuItems.id, { onDelete: "cascade" }),
  quantity: numeric("quantity").notNull().default("1"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItemAddOns = pgTable("order_item_addons", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderItemId: uuid("order_item_id")
    .notNull()
    .references(() => orderItems.id, { onDelete: "cascade" }),
  addOnId: uuid("addon_id")
    .notNull()
    .references(() => menuItemAddOns.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  stores: many(stores),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  users: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const storesRelations = relations(stores, ({ one }) => ({
  owner: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferInsert;
export type Store = typeof stores.$inferSelect;
export type StoreInsert = typeof stores.$inferInsert;
export type StoreWeeklyRange = typeof storeWeeklyRanges.$inferInsert;
