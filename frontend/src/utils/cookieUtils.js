// utils/cookieUtils.js
export const getAuthData = () => {
  const authDataCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authData="))
    ?.split("=")[1];

  if (authDataCookie) {
    try {
      // Decode the URL-encoded cookie value before parsing it as JSON
      const decodedCookie = decodeURIComponent(authDataCookie);
      return JSON.parse(decodedCookie);
    } catch (error) {
      console.error("Error parsing authData cookie:", error);
      return null; // Return null if parsing fails
    }
  }

  return null; // Return null if the cookie is not found
};

export const getToken = () => {
  const authData = getAuthData();
  return authData ? authData.token : null;
};