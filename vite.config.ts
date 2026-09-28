import { defineConfig } from 'vite'

// Home Assistant loads a Lovelace resource as a single ES module from /local, so everything -
// including lit - has to be inlined. No externals, no code splitting, no hashed filename: the
// resource URL in HA is fixed and cache-busted by a ?v= query instead.
export default defineConfig({
    build: {
        lib: {
            entry: 'src/lg-washing-card.ts',
            formats: ['es'],
            fileName: () => 'lg-washing-card.js',
        },
        rollupOptions: {
            output: { inlineDynamicImports: true },
        },
        target: 'es2021',
        minify: 'esbuild',
        // Off: the bundle is committed and served as-is, and a map that is not published
        // alongside it only earns a 404 in every browser that loads the card.
        sourcemap: false,
        emptyOutDir: true,
    },
})
