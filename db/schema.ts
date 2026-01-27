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
// Categories
// --------------------
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// --------------------
// Products
// --------------------
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => categories.id, { 
    onDelete: "set null" 
  }),
  sku: text("sku"),
  productNumber: text("product_number"), // e.g., "1", "2", "3"
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price").notNull(), // base price
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// --------------------
// Product Option Groups (e.g., "Size", "Extra Cheese")
// --------------------
export const productOptionGroups = pgTable("product_option_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g., "Size", "Toppings"
  required: boolean("required").default(false).notNull(),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// --------------------
// Product Options (sub-options within groups)
// --------------------
export const productOptions = pgTable("product_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  optionGroupId: uuid("option_group_id")
    .notNull()
    .references(() => productOptionGroups.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g., "Small (10\")", "Medium (12\")"
  price: numeric("price").notNull().default("0"), // price modifier
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// --------------------
// Orders
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
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// --------------------
// Order Items
// --------------------
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  basePrice: numeric("base_price").notNull(), // product price at time of order
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --------------------
// Order Item Options (tracks which options customer selected)
// --------------------
export const orderItemOptions = pgTable("order_item_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderItemId: uuid("order_item_id")
    .notNull()
    .references(() => orderItems.id, { onDelete: "cascade" }),
  optionGroupId: uuid("option_group_id")
    .notNull()
    .references(() => productOptionGroups.id, { onDelete: "cascade" }),
  optionId: uuid("option_id")
    .notNull()
    .references(() => productOptions.id, { onDelete: "cascade" }),
  optionName: text("option_name").notNull(), // snapshot for historical records
  priceModifier: numeric("price_modifier").notNull(), // price at time of order
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --------------------
// RELATIONS
// --------------------

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  stores: many(stores),
  orders: many(orders),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  owner: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
  weeklyRanges: many(storeWeeklyRanges),
  dateOverrides: many(storeDateOverridesFlat),
  categories: many(categories),
  products: many(products),
  orders: many(orders),
}));

export const storeWeeklyRangesRelations = relations(storeWeeklyRanges, ({ one }) => ({
  store: one(stores, {
    fields: [storeWeeklyRanges.storeId],
    references: [stores.id],
  }),
}));

export const storeDateOverridesFlatRelations = relations(storeDateOverridesFlat, ({ one }) => ({
  store: one(stores, {
    fields: [storeDateOverridesFlat.storeId],
    references: [stores.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  optionGroups: many(productOptionGroups),
  orderItems: many(orderItems),
}));

export const productOptionGroupsRelations = relations(
  productOptionGroups,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productOptionGroups.productId],
      references: [products.id],
    }),
    options: many(productOptions),
    orderItemOptions: many(orderItemOptions),
  })
);

export const productOptionsRelations = relations(productOptions, ({ one, many }) => ({
  optionGroup: one(productOptionGroups, {
    fields: [productOptions.optionGroupId],
    references: [productOptionGroups.id],
  }),
  orderItemOptions: many(orderItemOptions),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  selectedOptions: many(orderItemOptions),
}));

export const orderItemOptionsRelations = relations(orderItemOptions, ({ one }) => ({
  orderItem: one(orderItems, {
    fields: [orderItemOptions.orderItemId],
    references: [orderItems.id],
  }),
  optionGroup: one(productOptionGroups, {
    fields: [orderItemOptions.optionGroupId],
    references: [productOptionGroups.id],
  }),
  option: one(productOptions, {
    fields: [orderItemOptions.optionId],
    references: [productOptions.id],
  }),
}));

// --------------------
// TYPES
// --------------------

export type User = typeof users.$inferInsert;
export type Store = typeof stores.$inferSelect;
export type StoreInsert = typeof stores.$inferInsert;

export type StoreWeeklyRange = typeof storeWeeklyRanges.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type ProductInsert = typeof products.$inferInsert;

export type ProductOptionGroup = typeof productOptionGroups.$inferSelect;
export type ProductOptionGroupInsert = typeof productOptionGroups.$inferInsert;

export type ProductOption = typeof productOptions.$inferSelect;
export type ProductOptionInsert = typeof productOptions.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type OrderInsert = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type OrderItemInsert = typeof orderItems.$inferInsert;

export type OrderItemOption = typeof orderItemOptions.$inferSelect;
export type OrderItemOptionInsert = typeof orderItemOptions.$inferInsert;