/**
 * Utility to resolve the handler path for serverless functions
 * Converts an absolute file path to a relative path suitable for serverless.yml
 */
export const handlerPath = (context: string): string => {
  let relativePath = `${context
    .split(process.cwd())[1]
    .substring(1)
    .replace(/\\/g, "/")}`;

  if (relativePath.startsWith("src/main/")) {
    relativePath = relativePath.replace("src/main/", "");
  }

  return relativePath;
};
