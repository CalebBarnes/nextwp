import { Model } from "@stackbit/types";

export async function toStackbitModels(models: unknown[]): Promise<Model[]> {
  return models.map((model) => {
    return {
      type: "data",
      name: model.type,

      fields: Object.entries(model.schema.properties).map(([key, property]) => {
        console.log({ key, property });

        return {
          name: key,
          description: property.description,
          required: !!property.required,
          default: property.default,
        };
      }),
    };
  });
}

function jsonSchemaTypeToStackbitFieldType(type: string): string {
  if (Array.isArray(type)) {
    return "array";
  } else {
    switch (type) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      case "object":
        return "object";
      default:
        return "string";
    }
  }
}
