import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertOrder, InsertOrderItem, InsertPet, InsertUser, InsertVeterinaryAppointment, orderItems, orders, pets, users, veterinaryAppointments } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: { name: string; email: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(users).set({ name: data.name, email: data.email, updatedAt: new Date() }).where(eq(users.id, userId));
  return db.select().from(users).where(eq(users.id, userId)).limit(1).then((rows) => rows[0]);
}

export async function listActivePets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pets).where(and(eq(pets.userId, userId), eq(pets.status, "active"))).orderBy(desc(pets.createdAt));
}

export async function createPet(data: InsertPet) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(pets).values(data);
  const insertedId = Number(result[0].insertId);
  return db.select().from(pets).where(eq(pets.id, insertedId)).limit(1).then((rows) => rows[0]);
}

export async function updatePet(userId: number, petId: number, data: Partial<InsertPet>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(pets).set({ ...data, updatedAt: new Date() }).where(and(eq(pets.id, petId), eq(pets.userId, userId)));
  return db.select().from(pets).where(and(eq(pets.id, petId), eq(pets.userId, userId))).limit(1).then((rows) => rows[0]);
}

export async function archivePet(userId: number, petId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(pets).set({ status: "archived", updatedAt: new Date() }).where(and(eq(pets.id, petId), eq(pets.userId, userId)));
  return { success: true } as const;
}

export async function createOrder(order: InsertOrder, items: InsertOrderItem[]) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(orders).values(order);
  const orderId = Number(result[0].insertId);
  await db.insert(orderItems).values(items.map((item) => ({ ...item, orderId })));
  return db.select().from(orders).where(eq(orders.id, orderId)).limit(1).then((rows) => rows[0]);
}

export async function listOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const userOrders = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  if (!userOrders.length) return [];
  const allItems = await db.select().from(orderItems).where(eq(orderItems.orderId, userOrders[0].id));
  const itemRows = await Promise.all(userOrders.slice(1).map((order) => db.select().from(orderItems).where(eq(orderItems.orderId, order.id))));
  return userOrders.map((order, index) => ({ ...order, items: index === 0 ? allItems : itemRows[index - 1] }));
}

export async function createVeterinaryAppointment(data: InsertVeterinaryAppointment) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(veterinaryAppointments).values(data);
  const appointmentId = Number(result[0].insertId);
  return db.select().from(veterinaryAppointments).where(eq(veterinaryAppointments.id, appointmentId)).limit(1).then((rows) => rows[0]);
}

export async function listVeterinaryAppointments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(veterinaryAppointments).where(eq(veterinaryAppointments.userId, userId)).orderBy(desc(veterinaryAppointments.scheduledAt));
}
