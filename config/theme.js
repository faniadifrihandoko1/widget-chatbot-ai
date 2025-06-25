// Konfigurasi tema untuk Altius Chat Widget
export const theme = {
  colors: {
    primary: "#1EC0AA",
    primaryDark: "#179e8c",
    secondary: "#10b981", // Warna untuk status terbuka
    text: {
      primary: "#ffffff",
      secondary: "#374151",
      muted: "#9ca3af",
    },
    background: {
      main: "#f9fafb",
      chat: "#f8fafc",
      input: "#ffffff",
    },
    border: "#1EC0AA",
    shadow: {
      light: "rgba(30, 192, 170, 0.15)",
      medium: "rgba(30, 192, 170, 0.2)",
      dark: "rgba(30, 192, 170, 0.12)",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    xxl: "24px",
  },
  borderRadius: {
    full: "50%",
    lg: "24px",
    md: "18px",
    sm: "12px",
    xs: "4px",
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: {
      sm: "14px",
      base: "16px",
      lg: "18px",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  layout: {
    widget: {
      position: "bottom-right",
      zIndex: "999999",
    },
    bubble: {
      size: "60px",
      iconSize: "24px",
    },
    popup: {
      width: "380px",
      height: "500px",
      mobile: {
        width: "calc(100vw - 40px)",
        height: "calc(100vh - 120px)",
      },
    },
  },
  transitions: {
    default: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
  animations: {
    typing: {
      duration: "1.4s",
      timing: "ease-in-out",
    },
    pulse: {
      duration: "2s",
      timing: "ease-in-out",
    },
  },
};

export default theme;
