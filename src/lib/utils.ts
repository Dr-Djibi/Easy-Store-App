export function formatPrice(prix: number, currency: string = 'GNF'): string {
  const formatted = Math.round(prix).toLocaleString('fr-FR');
  return `${formatted} ${currency}`;
}

export function generateSlug(nom: string): string {
  return nom
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}
