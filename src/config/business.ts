if (!import.meta.env.VITE_BUSINESS_ID) {
  throw new Error("VITE_BUSINESS_ID is not defined in your environment variables");
}

export const BUSINESS_ID = import.meta.env.VITE_BUSINESS_ID as string;