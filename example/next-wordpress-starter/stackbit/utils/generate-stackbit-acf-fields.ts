export function generateStackbitFieldsFromACF(apiResponse) {
  const acfFields = apiResponse.schema.properties.acf.properties;

  console.log(acfFields.modules);
  // Function to map ACF field types to Stackbit field types
  function mapACFToStackbitField(acfField, fieldName) {
    switch (acfField.type) {
      case "string":
        return {
          type: "string",
          name: fieldName,
          label: capitalizeFirstLetter(fieldName),
        };
      case "integer":
        return {
          type: "number",
          name: fieldName,
          label: capitalizeFirstLetter(fieldName),
        };
      case "array":
        return {
          type: "list",
          name: fieldName,
          label: capitalizeFirstLetter(fieldName),
        };
      // Add more cases for other ACF field types
      default:
        return {
          type: "string",
          name: fieldName,
          label: capitalizeFirstLetter(fieldName),
        };
    }
  }

  // Function to capitalize the first letter of a string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Generate Stackbit fields array
  let stackbitFields = [];

  Object.entries(acfFields).forEach(([fieldName, field]) => {
    if (Array.isArray(field.type)) {
      // Handling 'modules' as flexible content
      let listItems = field.items.oneOf.map((layout) => {
        let fields = Object.entries(layout.properties).map(([key, value]) =>
          mapACFToStackbitField(value, key)
        );
        return { type: "object", fields: fields };
      });
      stackbitFields.push({
        type: "list",
        name: fieldName,
        label: capitalizeFirstLetter(fieldName),
        items: listItems,
      });
    } else {
      // Map as a regular field
      stackbitFields.push(mapACFToStackbitField(field, fieldName));
    }
  });
  console.log({ stackbitFields });
  console.log(stackbitFields[0]?.items);
  // console.log("items: ", stackbitFields[0].items);
  return stackbitFields;
}
