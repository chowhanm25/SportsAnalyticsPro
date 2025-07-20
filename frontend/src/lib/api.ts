const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getAllPlayers() {
  const response = await fetch(`${API_BASE_URL}/players/all`);
  if (!response.ok) {
    throw new Error('Failed to fetch players');
  }
  return response.json();
}

export async function getFilteredPlayers(filters: {
  team?: string;
  format?: string;
  gender?: string;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (filters.team) params.append('team', filters.team);
  if (filters.format) params.append('format', filters.format);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`${API_BASE_URL}/players?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch filtered players');
  }
  return response.json();
}

export async function createPlayer(playerData: any) {
  const response = await fetch(`${API_BASE_URL}/players`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(playerData),
  });
  if (!response.ok) {
    throw new Error('Failed to create player');
  }
  return response.json();
}

export async function predictPerformance(playerIds: number[]) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ player_ids: playerIds }),
  });
  if (!response.ok) {
    throw new Error('Failed to predict performance');
  }
  return response.json();
}