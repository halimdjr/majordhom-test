"use client";
import { useState } from "react";

export default function ContactForm() {
  const [dispos, setDispos] = useState([
  { day: "Lundi", hour: "9", min: "45" },
  { day: "Lundi", hour: "9", min: "45" },
]);
  const [day, setDay] = useState("Lundi");
  const [hour, setHour] = useState("0");
  const [min, setMin] = useState("0");

  const addDispo = () => {
    setDispos([...dispos, { day, hour, min }]);
  };

  const removeDispo = (i: number) => {
    setDispos(dispos.filter((_, idx) => idx !== i));
  };

  const formatDispo = (d: { day: string; hour: string; min: string }) =>
    `${d.day} à ${d.hour}h${d.min === "0" ? "" : d.min}`;

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/salon.png')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenu */}
      <div className="relative z-10 px-8 pt-7 pb-8 md:px-10 text-white">

        {/* Titre */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide mb-6">
          CONTACTEZ L&apos;AGENCE
        </h1>

       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── Colonne gauche ── */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest mb-3">
              VOS COORDONNÉES
            </h2>

            <div className="flex gap-6 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="civility" value="Mme" className="accent-white" />
                <span className="text-sm">Mme</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="civility" value="M" className="accent-white" />
                <span className="text-sm">M</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input type="text" placeholder="Nom" className="pill-input" />
              <input type="text" placeholder="Prénom" className="pill-input" />
            </div>
            <div className="mb-3">
              <input type="email" placeholder="Adresse mail" className="pill-input" />
            </div>
            <div>
              <input type="tel" placeholder="Téléphone" className="pill-input" />
            </div>
          </section>

          {/* ── Colonne droite ── */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest mb-3">
              VOTRE MESSAGE
            </h2>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3">
              {["visite", "rappel", "photos"].map((val, i) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="requestType" value={val} className="accent-white" />
                  <span className="text-sm">
                    {["Demande de visite", "Être rappelé.e", "Plus de photos"][i]}
                  </span>
                </label>
              ))}
            </div>

    
            <textarea
              placeholder="Votre message"
              rows={6}
              className="w-full rounded-2xl bg-white px-5 py-3 text-sm
                         text-gray-700 placeholder-gray-400 outline-none
                         resize-none focus:ring-2 focus:ring-orange-400"
            />
          </section>
        </div>

        {/* Disponibilités + Bouton envoyer*/}
<div className="mt-6">
  <h2 className="text-xs font-semibold tracking-widest mb-3">
    DISPONIBILITÉS POUR UNE VISITE
  </h2>

 
  <div className="flex flex-wrap items-center gap-2 mb-3">

    <div className="relative">
      <select className="pill-select pr-7" value={day} onChange={e => setDay(e.target.value)}>
        {["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]
          .map(d => <option key={d}>{d}</option>)}
      </select>
      <ChevronIcon />
    </div>

    <div className="relative">
      <select className="pill-select pr-7" value={hour} onChange={e => setHour(e.target.value)}>
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i}>{i}h</option>
        ))}
      </select>
      <ChevronIcon />
    </div>

    <div className="relative">
      <select className="pill-select pr-7" value={min} onChange={e => setMin(e.target.value)}>
        {[0, 15, 30, 45].map(m => (
          <option key={m} value={m}>{String(m).padStart(2, "0")}m</option>
        ))}
      </select>
      <ChevronIcon />
    </div>

    <button
      type="button"
      onClick={addDispo}
      className="rounded-full bg-[#3f1486] px-4 py-1.5 text-xs
           font-semibold uppercase tracking-wider text-white
           hover:brightness-110 transition leading-tight"
    >
      Ajouter<br />Dispo
    </button>

    {/* Boutton Envoyer*/}
    <div className="ml-auto self-center">
      <button
        type="button"
        className="rounded-full bg-[#fbad18] px-8 py-2.5 text-sm
           font-semibold uppercase tracking-wider text-white
           shadow-md hover:brightness-105 transition"
      >
        ENVOYER
      </button>
    </div>
  </div>

  {/* Tags */}
  <div className="flex flex-col gap-2 items-start">
    {dispos.map((d, i) => (
      <span key={i} className="dispo-tag">
        {formatDispo(d)}
        <button type="button" onClick={() => removeDispo(i)}
          className="text-gray-400 hover:text-gray-700">✕</button>
      </span>
    ))}
  </div>
</div>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500"
      viewBox="0 0 12 12" fill="currentColor"
    >
      <path d="M6 8.5L1.5 4h9L6 8.5z" />
    </svg>
  );
}