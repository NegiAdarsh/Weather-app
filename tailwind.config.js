module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ], // Specifies that Tailwind should scan all files in the 'src' directory with .js, .jsx, .ts, and .tsx extensions to generate the CSS.
  
  theme: {
    extend: {}, // This is where you can extend the default theme (e.g., adding custom colors, spacing, etc.).
  },
  
  plugins: [], // You can add Tailwind CSS plugins here if needed.
}
