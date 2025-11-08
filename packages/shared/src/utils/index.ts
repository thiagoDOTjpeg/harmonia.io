import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";


/**
 * Formata uma data ISO string para "X tempo atrás"
 * @param isoString - Data em formato ISO (ex: "2024-11-05T14:30:00Z")
 * @returns String formatada (ex: "2 horas", "3 dias")
 */
export function formatTimeAgo(isoString?: string | null): string {
  if (!isoString) return "Nunca";

  try {
    const date = parseISO(isoString);
    const distance = formatDistanceToNow(date, {
      locale: ptBR,
      addSuffix: false,
    });
    return distance
      .replace(/^cerca de /, "")
      .replace(/^quase /, "")
      .replace(/^mais de /, "")
      .replace(/^menos de /, "");
  } catch {
    return "Data inválida";
  }
}

/**
 * Formata uma data ISO string para formato completo
 * @param isoString - Data em formato ISO
 * @returns String formatada (ex: "05/11/2024 às 14:30")
 */
export function formatFullDate(isoString?: string | null): string {
  if (!isoString) return "-";

  try {
    const date = parseISO(isoString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return "Data inválida";
  }
}