import { actualizaciones } from "@/app/novedades/data"

// Export the latest version from the actualizaciones array
// Use optional chaining and provide a fallback version in case actualizaciones is undefined or empty
export const latestVersion = actualizaciones?.[0]?.version || "1.0.0"