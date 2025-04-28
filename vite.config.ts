import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'



// https://vite.dev/config/
export default defineConfig({
    base: './',
    plugins: [react(), tailwindcss()],
    server: {
        open: false,
        port: 3000
    },
    define: {
        global: "window",
        'process.env': {
            NODE_ENV: process.env.NODE_ENV,
            VITE_TOKEN_SECRET: process.env.VITE_TOKEN_SECRET,
            VITE_SERVER_BASE_URL: process.env.VITE_SERVER_BASE_URL,
        },
        'import.meta.env': {
            NODE_ENV: process.env.NODE_ENV,
            VITE_TOKEN_SECRET: process.env.VITE_TOKEN_SECRET,
            VITE_SERVER_BASE_URL: process.env.VITE_SERVER_BASE_URL, 
        },
    },
    build: {
        outDir: 'dist',
    },
    css: {
        postcss: './postcss.config.ts',
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),

            "@src": path.resolve(__dirname, "./src"),
            "@utils": path.resolve(__dirname, "./src/utils"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@routes": path.resolve(__dirname, "./src/routes"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),

            
        },
    },
})

/*
Can you help make this code more efficient, scrolling thing the available flights makes the page lag, and it shouldn't be considering the fact that we have just 10 test data that are being rendered

also I need you to help me redesign the page for
1. The filter side, where they can filter by stop, time and price should be made to be invisible for smaller screen and should be able to slide in and out from left to right, displaying "ON TOP - z-index" of the lists of flights,
2. Also on the left side of the page, we should also have another sidebar that slides in and out (from right to left) when users click to view a particular flight, something that slides out and shows the details of that particular flight when the view button is clicked 
3. Edit each of the other components that needs editing and rebuilding, Don't hold back, build as best as possible 
4. Design for high responsiveness, ranging from texts, to buttons, to containers and so on, high responsiveness
5. If it requires that you will need some possible UI libraries to achieve the best, please use it and don't hold back
6.  If it doesn't require it, the we leave it and we should be good to go
7. The image attached, is the UI inspiration image with which this implementation was done, so please make sure to incorporate the design in the image
*/