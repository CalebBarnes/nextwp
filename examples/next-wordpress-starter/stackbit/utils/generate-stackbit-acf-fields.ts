export function generateStackbitACFFieldValues(item, acfModelSchema) {
  const acfFieldSchema = acfModelSchema?.fields || [];

  function mapField(field, fieldValue) {
    console.log("mapField: ", field, fieldValue);
    if (field.type === "list" && fieldValue === false) {
      fieldValue = [];
    }
    switch (field.type) {
      case "string":
      case "text":
      case "richText":
      case "enum":
        return {
          type: field.type,
          name: field.name,
          label: field.label,
          value: fieldValue,
        };
      case "list":
        return {
          type: "list",
          name: field.name,
          label: field.label,
          items: fieldValue.map((subItem) => {
            return mapObjectFields(field.items.fields, subItem);
          }),
        };
      case "object":
        return mapObjectFields(field.fields, fieldValue);
      default:
        return {
          type: field.type,
          name: field.name,
          label: field.label,
          value: fieldValue,
        };
    }
  }

  function mapObjectFields(fields, objectData) {
    const result = {};
    fields.forEach((field) => {
      if (objectData[field.name] !== undefined) {
        result[field.name] = mapField(field, objectData[field.name]);
      }
    });
    return {
      type: "object",
      fields: result,
    };
  }

  const acfFieldValues = {};
  Object.entries(item.acf || {}).forEach(([fieldName, fieldValue]) => {
    const fieldSchema = acfFieldSchema.find(
      (field) => field.name === fieldName
    );
    if (fieldSchema) {
      acfFieldValues[fieldName] = mapField(fieldSchema, fieldValue);
    }
  });

  return { type: "object", fields: acfFieldValues };
}

// export function generateStackbitACFFieldValues(item, acfModelSchema) {
//   const acfFieldSchema = acfModelSchema?.fields || [];

//   function getFieldType(fieldName) {
//     return (
//       acfFieldSchema.find((field) => field.name === fieldName)?.type || "string"
//     );
//   }

//   function createFieldStructure(fieldName, fieldValue) {
//     const fieldType = getFieldType(fieldName);

//     if (fieldType === "list" && Array.isArray(fieldValue)) {
//       const listItems = fieldValue.map((subItem) => {
//         if (typeof subItem === "object" && subItem !== null) {
//           const fields = Object.entries(subItem)
//             .map(([subFieldName, subFieldValue]) => {
//               if (subFieldName === "acf_fc_layout") {
//                 return null; // Skip acf_fc_layout field
//               }
//               return {
//                 type: getFieldType(subFieldName),
//                 name: subFieldName,
//                 label: capitalizeFirstLetter(subFieldName),
//                 value: subFieldValue,
//               };
//             })
//             .filter((field) => field !== null); // Remove null fields

//           return { type: "object", fields };
//         } else {
//           return { type: "string", value: subItem };
//         }
//       });

//       return { type: "list", items: listItems };
//     } else {
//       return {
//         type: fieldType,
//         name: fieldName,
//         label: capitalizeFirstLetter(fieldName),
//         value: fieldValue,
//       };
//     }
//   }

//   function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   }

//   const acfFieldValues = {};
//   Object.entries(item.acf || {}).forEach(([fieldName, fieldValue]) => {
//     acfFieldValues[fieldName] = createFieldStructure(fieldName, fieldValue);
//   });

//   return { type: "object", fields: acfFieldValues };
// }
