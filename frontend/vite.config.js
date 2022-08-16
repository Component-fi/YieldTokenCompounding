import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const path = require('path');

export default ({ mode }) => {
    return defineConfig({
        plugins: [react()],
        define: {
            "process.env.NODE_ENV": `"${mode}"`,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        }
    })
}

