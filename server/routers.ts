import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { archivePet, createPet, listActivePets, updatePet, updateUserProfile } from "./db";
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
    updateProfile: protectedProcedure.input(z.object({ name: z.string().trim().min(1).max(120), email: z.string().trim().email().max(320) })).mutation(async ({ ctx, input }) => {
      return updateUserProfile(ctx.user.id, input);
    }),
    pets: protectedProcedure.query(({ ctx }) => listActivePets(ctx.user.id)),
    addPet: protectedProcedure.input(petInput).mutation(({ ctx, input }) => createPet({ ...input, userId: ctx.user.id, animal: input.animal, breed: input.breed || null, age: input.age || null, tracker: input.tracker || null, photoUrl: input.photoUrl || null, notes: input.notes || null })),
    updatePet: protectedProcedure.input(petInput.extend({ id: z.number().int().positive() })).mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return updatePet(ctx.user.id, id, { ...data, breed: data.breed || null, age: data.age || null, tracker: data.tracker || null, photoUrl: data.photoUrl || null, notes: data.notes || null });
    }),
    archivePet: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => archivePet(ctx.user.id, input.id)),
  }),
});

export type AppRouter = typeof appRouter;
