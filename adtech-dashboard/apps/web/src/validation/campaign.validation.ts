import * as z from "zod";

export const campaignSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    description: z.string().max(500, "Description is too long").optional(),
    budget: z.coerce.number().min(1, "Budget must be at least $1"),
    daily_budget: z.coerce.number().min(1, "Daily budget must be at least $1"),
    status: z.enum(["draft", "active", "paused", "completed", "archived"]),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    targeting: z
      .object({
        countries: z.array(z.string()).optional(),
        devices: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  });

export type CampaignFormValues = z.infer<typeof campaignSchema>;
