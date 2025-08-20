module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          bg: "#FFFFFF", // azul clarito
          bg_h: "#F5F5F5", // azul clarito
          primary: "#1D2125", // azul principal
          primary_h: "#1D2125", // azul principal
          secondary: "#2A3964", // azul oscuro
          secondary_h: "#2A3964", // azul oscuro
          border: "#f3f4f6", // azul oscuro
          border_h: "#B0B0B0", // azul oscuro
          accent: "#E47400", // un color suelto (rosa fuerte)
          accent_h: "#E47400", // un color suelto (rosa fuerte)
          success: "#28a745", // Verde éxito
          danger: "#dc3545",  // Rojo error
          warning: "#ffc107",
        },
        dark: {
          bg: "#FFFFFF", // azul clarito
          bg_h: "#F5F5F5", // azul clarito
          primary: "#1D2125", // azul principal
          primary_h: "#1D2125", // azul principal
          secondary: "#2A3964", // azul oscuro
          secondary_h: "#2A3964", // azul oscuro
          border: "#f3f4f6", // azul oscuro
          border_h: "#B0B0B0", // azul oscuro
          accent: "#E47400", // un color suelto (rosa fuerte)
          accent_h: "#E47400", // un color suelto (rosa fuerte)ç
          success: "#28a745", // Verde éxito
          danger: "#dc3545",  // Rojo error
          warning: "#ffc107",
        },
      },},
  },
  plugins: [],
}
