export default async function getNextVersion() {
  try {
    const response = await fetch('/api/system/version');
    const data = await response.json();
    return data.version;
  } catch (error) {
    console.error('Error fetching version:', error);
    return '0';
  }
}
