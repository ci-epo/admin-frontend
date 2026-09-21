import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * Règle d'or (docs/instruction/architecture-hexagonale-nextjs.md) : les dépendances
 * pointent vers l'intérieur. Chaque couche liste ce qu'elle n'a pas le droit d'importer.
 * Un import relatif est toujours interdit : on passe par l'alias `@/…`.
 */
const RELATIVE_IMPORT = {
  regex: "^\\.{1,2}/",
  message: "Utiliser l'alias @/… (= src/…) plutôt qu'un chemin relatif.",
};

const forbid = (...groups) => ({
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        RELATIVE_IMPORT,
        ...groups.map((group) => ({
          group,
          message: "Dépendance interdite par l'architecture (voir docs/instruction).",
        })),
      ],
    },
  ],
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Code vendor du thème : on ne le lint pas, on ne le modifie pas.
      "public/**",
    ],
  },
  { files: ["src/**/*.{ts,tsx}", "__tests__/**/*.{ts,tsx}"], rules: forbid() },
  {
    files: ["src/types/**"],
    rules: forbid(
      ["@/app/**", "@/components/**", "@/hooks/**", "@/lib/**", "@/config/**"],
    ),
  },
  {
    files: ["src/lib/**"],
    rules: forbid(["@/app/**", "@/components/**", "@/hooks/**"]),
  },
  {
    files: ["src/hooks/**"],
    rules: forbid(["@/app/**", "@/components/**"]),
  },
  {
    files: ["src/components/ui/**"],
    rules: forbid(
      ["@/app/**", "@/components/sections/**", "@/hooks/**", "@/lib/**", "@/config/**"],
    ),
  },
  {
    files: ["src/components/sections/**"],
    rules: forbid(["@/app/**"]),
  },
];

export default eslintConfig;
