import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const pets = mysqlTable("pets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  name: varchar("name", { length: 120 }).notNull(),
  animal: mysqlEnum("animal", ["dog", "cat", "other"]).notNull(),
  breed: varchar("breed", { length: 120 }),
  age: varchar("age", { length: 80 }),
  tracker: varchar("tracker", { length: 160 }),
  photoUrl: text("photoUrl"),
  notes: text("notes"),
  status: mysqlEnum("status", ["active", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Pet = typeof pets.$inferSelect;
export type InsertPet = typeof pets.$inferInsert;

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  status: mysqlEnum("status", ["pending", "confirmed", "shipped", "delivered", "cancelled"]).default("confirmed").notNull(),
  subtotalCents: int("subtotalCents").notNull(),
  deliveryCents: int("deliveryCents").notNull(),
  totalCents: int("totalCents").notNull(),
  customerName: varchar("customerName", { length: 160 }).notNull(),
  address: varchar("address", { length: 320 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull().references(() => orders.id),
  productId: varchar("productId", { length: 160 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  type: varchar("type", { length: 160 }).notNull(),
  priceCents: int("priceCents").notNull(),
  quantity: int("quantity").notNull(),
  image: text("image"),
});
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

export const veterinaryAppointments = mysqlTable("veterinaryAppointments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  petId: int("petId").references(() => pets.id),
  petName: varchar("petName", { length: 120 }).notNull(),
  serviceType: mysqlEnum("serviceType", ["deworm", "anti-rabies", "checkup", "full-checkup"]).notNull(),
  scheduledAt: timestamp("scheduledAt").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type VeterinaryAppointment = typeof veterinaryAppointments.$inferSelect;
export type InsertVeterinaryAppointment = typeof veterinaryAppointments.$inferInsert;

export const groomingAppointments = mysqlTable("groomingAppointments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  petId: int("petId").references(() => pets.id),
  petName: varchar("petName", { length: 120 }).notNull(),
  serviceType: mysqlEnum("serviceType", ["bath-blow-dry", "full-groom", "haircut-trim", "nail-trim"]).notNull(),
  scheduledAt: timestamp("scheduledAt").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type GroomingAppointment = typeof groomingAppointments.$inferSelect;
export type InsertGroomingAppointment = typeof groomingAppointments.$inferInsert;

export const daycareReservations = mysqlTable("daycareReservations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  petId: int("petId").references(() => pets.id),
  petName: varchar("petName", { length: 120 }).notNull(),
  stayType: mysqlEnum("stayType", ["half-day", "full-day"]).notNull(),
  scheduledAt: timestamp("scheduledAt").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type DaycareReservation = typeof daycareReservations.$inferSelect;
export type InsertDaycareReservation = typeof daycareReservations.$inferInsert;
