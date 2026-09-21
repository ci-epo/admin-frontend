import "@testing-library/jest-dom";

// config/env.ts lève une erreur à l'import si cette variable manque.
process.env.NEXT_PUBLIC_API_BASE_URL ??= "http://localhost:3001";
