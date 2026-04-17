import { z } from "zod";

// Validation d'un créneau de disponibilité
export const availabilitySchema = z.object({
  day: z.enum(["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
});

// Validation du formulaire complet
export const contactFormSchema = z.object({
  civility: z.enum(["Mme", "M"], {
    errorMap: () => ({ message: "Veuillez sélectionner une civilité" }),
  }),
  lastName: z
    .string()
    .trim()
    .min(1, "Le nom est requis")
    .max(100, "Le nom est trop long"),
  firstName: z
    .string()
    .trim()
    .min(1, "Le prénom est requis")
    .max(100, "Le prénom est trop long"),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide"),
  phone: z
    .string()
    .trim()
    .min(6, "Numéro de téléphone invalide")
    .regex(/^[0-9+\s().-]+$/, "Numéro de téléphone invalide"),
  requestType: z.enum(["visite", "rappel", "photos"], {
    errorMap: () => ({ message: "Veuillez sélectionner un type de demande" }),
  }),
  message: z
    .string()
    .trim()
    .min(1, "Le message est requis")
    .max(2000, "Message trop long (2000 caractères max)"),
  availabilities: z.array(availabilitySchema).max(20, "Trop de créneaux"),
});

// Types TypeScript deduits automatiquement du schéma Zod
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type AvailabilityValue = z.infer<typeof availabilitySchema>;