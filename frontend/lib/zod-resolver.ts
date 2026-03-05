import { toNestErrors, validateFieldsNatively } from "@hookform/resolvers";
import type { FieldError, FieldErrors, Resolver } from "react-hook-form";
import { ZodError } from "zod";

interface ParseableSchema {
  parseAsync: (values: unknown) => Promise<unknown>;
}

export function zodResolverV4(schema: ParseableSchema): Resolver<any> {
  return async (values, _, options) => {
    try {
      const data = await schema.parseAsync(values);

      if (options.shouldUseNativeValidation) {
        validateFieldsNatively({}, options);
      }

      return {
        values: data as any,
        errors: {} as FieldErrors,
      } as any;
    } catch (error) {
      if (error instanceof ZodError) {
        const flatErrors: Record<string, FieldError> = {};

        for (const issue of error.issues) {
          const key = issue.path.join(".");
          if (!key || flatErrors[key]) {
            continue;
          }

          flatErrors[key] = {
            type: issue.code,
            message: issue.message,
          };
        }

        const nestedErrors = toNestErrors(flatErrors, options) as FieldErrors;

        if (options.shouldUseNativeValidation) {
          validateFieldsNatively(flatErrors, options);
        }

        return {
          values: {},
          errors: nestedErrors as any,
        } as any;
      }

      throw error;
    }
  };
}
