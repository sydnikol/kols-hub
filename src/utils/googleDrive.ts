/**
 * Stub for Google Drive sync.
 * Replace YOUR_CLIENT_ID with an OAuth2 client ID later.
 */
export async function authorizeDrive() {
  const clientId = "YOUR_CLIENT_ID";
  const scope = "https://www.googleapis.com/auth/drive.file";
  const redirectUri = window.location.origin;
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  window.location.href = authUrl;
}

export async function uploadToDrive(fileName: string, content: Blob) {
  // Placeholder: show offline-sync notice
  alert(`Simulated upload of ${fileName} to Google Drive.`);
}
