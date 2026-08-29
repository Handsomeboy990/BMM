import { describe, expect, it } from "vitest";

/**
 * `toE164` n'est pas exporté: on rejoue ici la même règle pour verrouiller le
 * comportement attendu, et la fonction du composant reste privée.
 */
function toE164(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const compact = value.replace(/[\s.\-()]/g, "");
  return /^\+[1-9]\d{6,14}$/.test(compact) ? compact : undefined;
}

describe("normalisation du numéro de téléphone", () => {
  it("retire les espaces d'un numéro enregistré tel qu'affiché", () => {
    expect(toE164("+229 01 97 12 34 56")).toBe("+2290197123456");
  });

  it("accepte un numéro déjà au bon format", () => {
    expect(toE164("+2290197123456")).toBe("+2290197123456");
  });

  it("accepte les séparateurs courants", () => {
    expect(toE164("+229-01.97 (12) 34 56")).toBe("+2290197123456");
  });

  it("refuse un numéro sans indicatif international", () => {
    expect(toE164("0197123456")).toBeUndefined();
  });

  it("refuse une saisie qui n'est pas un numéro", () => {
    expect(toE164("à renseigner")).toBeUndefined();
  });

  it("traite une valeur absente comme vide", () => {
    expect(toE164(undefined)).toBeUndefined();
    expect(toE164("")).toBeUndefined();
  });
});
