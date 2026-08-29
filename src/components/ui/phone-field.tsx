"use client";

import { useId, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { cn } from "@/lib/utils";

/**
 * Normalise un numéro au format E.164, seul accepté par le composant.
 *
 * Les numéros enregistrés portent souvent leurs espaces de lecture
 * (« +229 01 97 12 34 56 »). Passés tels quels, la bibliothèque refusait la
 * valeur initiale, écrivait une erreur dans la console et laissait le champ
 * vide: le donneur croyait devoir ressaisir son numéro.
 */
function toE164(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const compact = value.replace(/[\s.\-()]/g, "");
  return /^\+[1-9]\d{6,14}$/.test(compact) ? compact : undefined;
}

/**
 * Champ de saisie de numéro de téléphone international : sélecteur de pays
 * (drapeau + indicatif) et formatage automatique selon le pays choisi.
 * Compatible formulaire (input caché portant le `name`) ou contrôlé.
 */
export function PhoneField({
  name,
  value,
  onChange,
  defaultValue = "",
  defaultCountry = "BJ",
  placeholder = "Numéro de téléphone",
  disabled,
  className,
  id,
}: {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  defaultCountry?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(() => toE164(defaultValue) ?? "");
  const current = controlled ? toE164(value) : internal;

  function handleChange(next: string | undefined) {
    const v = next ?? "";
    if (!controlled) setInternal(v);
    onChange?.(v);
  }

  return (
    <div
      className={cn(
        "border-input bg-background focus-within:ring-ring focus-within:ring-offset-background flex h-10 w-full items-center rounded-md border px-3 text-sm shadow-sm transition-colors focus-within:ring-2 focus-within:ring-offset-2",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <PhoneInput
        id={inputId}
        international
        countryCallingCodeEditable={false}
        defaultCountry={defaultCountry as never}
        value={current || undefined}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
      />
      {name ? <input type="hidden" name={name} value={current ?? ""} /> : null}
    </div>
  );
}
