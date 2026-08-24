export function normalizeRoomStatus(status: string) {
  return status.toLowerCase();
}

export function isAvailable(status: string) {
  const s = normalizeRoomStatus(status);
  return s === 'disponível' || s === 'disponivel';
}

export function isOccupied(status: string) {
  return normalizeRoomStatus(status) === 'ocupada';
}

export const roomStatusBadgeClass = (status: string) => {
  if (isAvailable(status)) return 'bg-emerald-100 text-emerald-700';
  if (isOccupied(status)) return 'bg-rose-100 text-rose-700';
  return 'bg-amber-100 text-amber-700';
};