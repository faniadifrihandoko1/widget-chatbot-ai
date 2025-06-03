export const defaultConfig = {
  position: "bottom-right",
  primaryColor: "#dc2626",
  textColor: "#ffffff",
  backgroundColor: "#f9fafb",
  borderRadius: "50px",
  apiEndpoint:
    "https://agiqubisaai-api-dev-fhf0cwfdbnhqcfda.southeastasia-01.azurewebsites.net/chat",
  welcomeMessage:
    "Halo! Selamat datang di Altius People. Ada yang bisa saya bantu?",
};

export const setConfig = (config) => {
  // Update CSS variables based on config
  document.documentElement.style.setProperty(
    "--altius-primary-color",
    config.primaryColor || defaultConfig.primaryColor
  );
  document.documentElement.style.setProperty(
    "--altius-text-color",
    config.textColor || defaultConfig.textColor
  );
  document.documentElement.style.setProperty(
    "--altius-background-color",
    config.backgroundColor || defaultConfig.backgroundColor
  );
  document.documentElement.style.setProperty(
    "--altius-border-radius",
    config.borderRadius || defaultConfig.borderRadius
  );

  return { ...defaultConfig, ...config };
};
