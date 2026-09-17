import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { archivePet, createOrder, createPet, createVeterinaryAppointment, listActivePets, listOrders, listVeterinaryAppointments, updatePet, updateUserProfile } from "./db";
import { z } from "zod";

const petInput = z.object({
  name: z.string().trim().min(1).max(120),
  animal: z.enum(["dog", "cat", "other"]),
  breed: z.string().trim().max(120).optional().or(z.literal("")),
  age: z.string().trim().max(80).optional().or(z.literal("")),
  tracker: z.string().trim().max(160).optional().or(z.literal("")),
  photoUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

const orderInput = z.object({
  subtotalCents: z.number().int().nonnegative(),
  deliveryCents: z.number().int().nonnegative(),
  totalCents: z.number().int().nonnegative(),
  customerName: z.string().trim().min(1).max(160),
  address: z.string().trim().min(1).max(320),
  city: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(40),
  items: z.array(z.object({
    productId: z.string().trim().min(1).max(160),
    name: z.string().trim().min(1).max(160),
    type: z.string().trim().min(1).max(160),
    priceCents: z.number().int().nonnegative(),
    quantity: z.number().int().positive().max(99),
    image: z.string().max(2000).optional().or(z.literal("")),
  })).min(1).max(50),
});

const veterinaryInput = z.object({
  petId: z.number().int().positive().nullable().optional(),
  petName: z.string().trim().min(1).max(120),
  serviceType: z.enum(["deworm", "anti-rabies", "checkup", "full-checkup"]),
  scheduledAt: z.coerce.date(),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  account: router({
    updateProfile: protectedProcedure.input(z.object({ name: z.string().trim().min(1).max(120), email: z.string().trim().email().max(320) })).mutation(async ({ ctx, input }) => updateUserProfile(ctx.user.id, input)),
    pets: protectedProcedure.query(({ ctx }) => listActivePets(ctx.user.id)),
    addPet: protectedProcedure.input(petInput).mutation(({ ctx, input }) => createPet({ ...input, userId: ctx.user.id, animal: input.animal, breed: input.breed || null, age: input.age || null, tracker: input.tracker || null, photoUrl: input.photoUrl || null, notes: input.notes || null })),
    updatePet: protectedProcedure.input(petInput.extend({ id: z.number().int().positive() })).mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return updatePet(ctx.user.id, id, { ...data, breed: data.breed || null, age: data.age || null, tracker: data.tracker || null, photoUrl: data.photoUrl || null, notes: data.notes || null });
    }),
    archivePet: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => archivePet(ctx.user.id, input.id)),
    orders: protectedProcedure.query(({ ctx }) => listOrders(ctx.user.id)),
    veterinaryAppointments: protectedProcedure.query(({ ctx }) => listVeterinaryAppointments(ctx.user.id)),
    bookVeterinary: protectedProcedure.input(veterinaryInput).mutation(({ ctx, input }) => createVeterinaryAppointment({ ...input, userId: ctx.user.id, petId: input.petId ?? null, notes: input.notes || null, status: "pending" })),
    createOrder: protectedProcedure.input(orderInput).mutation(({ ctx, input }) => {
      const { items, ...order } = input;
      return createOrder({ ...order, userId: ctx.user.id, status: "confirmed" }, items.map((item) => ({ ...item, image: item.image || null, orderId: 0 })));
    }),
  }),
});

export type AppRouter = typeof appRouter;
