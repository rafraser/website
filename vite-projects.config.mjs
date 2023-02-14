import { readFileSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { plugin as elm } from 'vite-plugin-elm';

/**
 * This Vite configuration is used exclusively for building the applications in /projects
 * These are individual SPAs, independent from the Astro blog
 *
 * This is a little hacky - ideally I should be able to get Astro to handle this part when it builds
 * Hopefully at some point I'll figure that out for myself!
 *
 * Not everything in /projects will be an SPA
 * Load projects/index.json to determine which projects need to be built
 *
 * This file also assumes that the Astro build process has run *first*
 * Do not clear out the dist/ folder, and don't copy the public/ folder again
 */
const projectList = JSON.parse(readFileSync(resolve(__dirname, 'projects/index.json')))["vite-pages"];
const projectInput = projectList.reduce((obj, project) => {
    obj[project] = resolve(__dirname, `projects/${project}/index.html`)
    return obj
}, {});

export default defineConfig({
    plugins: [vue(), react(), elm()],
    build: {
        emptyOutDir: false,
        copyPublicDir: false,
        rollupOptions: {
            input: projectInput
        }
    }
});