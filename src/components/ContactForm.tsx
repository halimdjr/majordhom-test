"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation";

// Types
type Dispo = { day: string; hour: string; min: string };
type Status = "idle" | "submitting" | "success" | "error";

const DAYS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

export default function ContactForm() {

  // react-hook-form 
  const {
  register,
  handleSubmit,
  reset,
  trigger,
  formState: { errors },
} = useForm<ContactFormValues>({
  resolver: zodResolver(contactFormSchema),
  mode: "onSubmit",
  defaultValues: {
    civility: undefined,
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    requestType: undefined,
    message: "",
    availabilities: [],
  },
});

  // Etat local pour les dispos
  const [dispos, setDispos] = useState<Dispo[]>([]);
  const [day, setDay] = useState("Lundi");
  const [hour, setHour] = useState("7");
  const [min, setMin] = useState("0");

  //  Etat de la soumission 
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  // Gestion des dispos 
  const addDispo = () => {
    const existe = dispos.some(d => d.day === day && d.hour === hour && d.min === min);
    if (existe) return; // évite les doublons
    setDispos([...dispos, { day, hour, min }]);
  };

  const removeDispo = (i: number) => {
    setDispos(dispos.filter((_, idx) => idx !== i));
  };

  const formatDispo = (d: Dispo) =>
    `${d.day} à ${d.hour}h${d.min === "0" ? "00" : d.min}`;

  // Soumission 
  // handleSubmit appelle onSubmit Seulement si Zod valide tout
  const onSubmit = async (data: ContactFormValues) => {
    setStatus("submitting");
    setServerError(null);

    // On ajoute les dispos manuellement 
    const payload = {
      ...data,
      availabilities: dispos.map(d => ({
        day: d.day,
        hour: parseInt(d.hour),
        minute: parseInt(d.min),
      })),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Une erreur est survenue");
      }

      setStatus("success");
      reset();        // remet les champs a zero
      setDispos([]);  // vide les dispos
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl">

      {/* Image de fond */}
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/salon.png')" }} />
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenu */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="relative z-10 px-8 pt-6 pb-7 md:px-10 text-white"
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide mb-6">
          CONTACTEZ L&apos;AGENCE
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* COLONNE GAUCHE : VOS COORDONNÉES */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest mb-3">
              VOS COORDONNÉES
            </h2>

            {/* Civilité */}
            <div className="flex gap-6 mb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="Mme" className="accent-white"
                  {...register("civility")} />
                <span className="text-sm">Mme</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="M" className="accent-white"
                  {...register("civility")} />
                <span className="text-sm">M</span>
              </label>
            </div>
         {errors.civility && (
  <p className="text-xs text-orange-300 mb-2">Veuillez sélectionner votre civilité</p>
)}

            {/* Nom + Prénom */}
            <div className="grid grid-cols-2 gap-3 mb-1">
              <div>
                <input type="text" placeholder="Nom"
                  className="pill-input" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-xs text-orange-300 mt-1 ml-2">{errors.lastName.message}</p>
                )}
              </div>
              <div>
                <input type="text" placeholder="Prénom"
                  className="pill-input" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-xs text-orange-300 mt-1 ml-2">{errors.firstName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-1">
              <input type="email" placeholder="Adresse mail"
                className="pill-input" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-orange-300 mt-1 ml-2">{errors.email.message}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <input type="tel" placeholder="Téléphone"
                className="pill-input" {...register("phone")} />
              {errors.phone && (
                <p className="text-xs text-orange-300 mt-1 ml-2">{errors.phone.message}</p>
              )}
            </div>
          </section>

          {/* COLONNE DROITE : VOTRE MESSAGE */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest mb-3">
              VOTRE MESSAGE
            </h2>

            {/* Type de demande */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mb-1">
              {["visite", "rappel", "photos"].map((val, i) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value={val} className="accent-white"
                    {...register("requestType")} />
                  <span className="text-sm">
                    {["Demande de visite", "Être rappelé.e", "Plus de photos"][i]}
                  </span>
                </label>
              ))}
            </div>
            {errors.requestType && (
  <p className="text-xs text-orange-300 mb-2">Veuillez sélectionner un type de demande</p>
)}

            {/* Message */}
            <textarea
              placeholder="Votre message"
              rows={6}
              className="w-full rounded-2xl bg-white px-5 py-3 text-sm
                         text-gray-700 placeholder-gray-400 outline-none
                         resize-none focus:ring-2 focus:ring-orange-400"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-orange-300 mt-1 ml-2">{errors.message.message}</p>
            )}
          </section>
        </div>

        {/* BAS : DISPONIBILITÉS + ENVOYER*/}
        <div className="mt-6">
          <h2 className="text-xs font-semibold tracking-widest mb-3">
            DISPONIBILITÉS POUR UNE VISITE
          </h2>

          <div className="flex flex-wrap items-center gap-2 mb-3">

            {/* Jour */}
            <div className="relative">
              <select className="pill-select pr-7" value={day}
                onChange={e => setDay(e.target.value)}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
              <ChevronIcon />
            </div>

            {/* Heure */}
            <div className="relative">
              <select className="pill-select pr-7" value={hour}
                onChange={e => setHour(e.target.value)}>
                {Array.from({ length: 13 }, (_, i) => i + 8).map(h => (
                  <option key={h} value={h}>{h}h</option>
                ))}
              </select>
              <ChevronIcon />
            </div>

            {/* Minute */}
            <div className="relative">
              <select className="pill-select pr-7" value={min}
                onChange={e => setMin(e.target.value)}>
                {[0, 15, 30, 45].map(m => (
                  <option key={m} value={m}>{String(m).padStart(2,"0")}m</option>
                ))}
              </select>
              <ChevronIcon />
            </div>

            {/* Bouton Ajouter */}
            <button type="button" onClick={addDispo}
              className="rounded-full bg-[#3f1486] px-4 py-1.5 text-xs
                         font-semibold uppercase tracking-wider text-white
                         hover:brightness-110 transition leading-tight">
              Ajouter<br />Dispo
            </button>

            {/* Bouton Envoyer */}
            <div className="ml-auto self-center">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-full bg-[#fbad18] px-8 py-2.5 text-sm
                           font-semibold uppercase tracking-wider text-white
                           shadow-md hover:brightness-105 disabled:opacity-60
                           disabled:cursor-not-allowed transition"
              >
                {status === "submitting" ? "Envoi..." : "ENVOYER"}
              </button>
            </div>
          </div>

          {/* Tags des dispos */}
        
            <div className="flex flex-col gap-2 items-start max-h-[80px] overflow-y-auto h-[72px]
                scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent pr-1">
            {dispos.map((d, i) => (
              <span key={i} className="dispo-tag">
                {formatDispo(d)}
                <button type="button" onClick={() => removeDispo(i)}
                  className="text-gray-400 hover:text-gray-700">✕</button>
              </span>
            ))}
          </div>

          {/* Messages de retour après envoi */}
          {status === "success" && (
            <p className="mt-4 text-sm text-green-300">
              Votre demande a bien été envoyée !
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 text-sm text-red-300">
               {serverError ?? "Une erreur est survenue, veuillez réessayer."}
            </p>
          )}

        </div>
      </form>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500"
      viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 8.5L1.5 4h9L6 8.5z" />
    </svg>
  );
}