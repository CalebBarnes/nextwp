export function convertPostStatusToDocumentStatus(postStatus) {
  switch (postStatus) {
    case "publish":
      return "published";
    case "draft":
    case "pending":
      return "modified";
    case "trash":
      return "deleted";
    case "auto-draft":
      return "added";
    // Add other cases as needed
    default:
      return "modified"; // Default case, assuming any other status implies a modification
  }
}
