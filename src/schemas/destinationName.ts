import z from "zod";

export const destinationAISchema = z.object({
  destinationName: z.string().min(1, "Please select destination"),
});

export type DestinationAIDataTYpe = z.infer<typeof destinationAISchema>;
