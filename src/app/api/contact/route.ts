import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {

    // Lire le corps de la requête
    const body = await request.json();

    // Valider avec Zod
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Données invalides",
          // met les erreurs dans un format lisible
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Enregistrer en base de données via Prisma
    const created = await prisma.contactRequest.create({
      data: {
        civility:    data.civility,
        lastName:    data.lastName,
        firstName:   data.firstName,
        email:       data.email,
        phone:       data.phone,
        requestType: data.requestType,
        message:     data.message,
        availabilities: {
          create: data.availabilities.map(a => ({
            day:    a.day,
            hour:   a.hour,
            minute: a.minute,
          })),
        },
      },
      include: { availabilities: true },
    });

    return NextResponse.json(
      { ok: true, id: created.id },
      { status: 201 }
    );

  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json(
      { error: "Erreur serveur, veuillez réessayer plus tard." },
      { status: 500 }
    );
  }
}