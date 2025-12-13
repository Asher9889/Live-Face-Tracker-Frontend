import { ZodAny, ZodOptional } from "zod";

export function isFieldRequired(schema: any, fieldName: string) {
  let field: ZodAny = schema.shape[fieldName];

  if (!field) return false;

  // unwrap optional
  if (field instanceof ZodOptional) {
    return false;
  }

  // If it isn't optional → it's required
  return true;
}
