import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Use the SWC plugin

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
})