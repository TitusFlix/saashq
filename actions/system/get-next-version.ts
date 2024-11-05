export async function getNextVersion() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/system/version`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.version;
  } catch (error) {
    console.error('Error fetching version:', error);
    return 'unknown';
  }
}
