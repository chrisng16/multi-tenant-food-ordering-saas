import { boolean, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
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

export const sessions = pgTable("sessions", {
    id: uuid("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("account_id").notNull(),
    providerId: uuid("provider_id").notNull(),
    userId: uuid("user_id")
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
});

export const verifications = pgTable("verifications", {
    id: uuid("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});


// --------------------
// TENANT: Stores
// --------------------
export const stores = pgTable("stores", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(), // for subdomains or /store/[slug]
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

// --------------------
// Store Users (roles per tenant)
// --------------------
export const storeUsers = pgTable("store_users", {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id")
        .notNull()
        .references(() => stores.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["owner", "manager"] }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
    status: text("status", { enum: ["pending", "confirmed", "completed", "cancelled"] })
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
