export async function getMaps() {
    const response = await fetch('/api/maps');
    if (!response.ok) throw new Error('Failed to fetch maps');
    return response.json();
  }
  
  export async function createMap(name: string) {
    const response = await fetch('/api/maps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to create map');
    return response.json();
  }
  
  export async function deleteMap(mapId: string) {
    const response = await fetch('/api/maps', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mapId })
    });
    if (!response.ok) throw new Error('Failed to delete map');
    return response.json();
  }