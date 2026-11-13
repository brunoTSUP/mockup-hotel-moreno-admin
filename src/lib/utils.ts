import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const dateLabel = (value?: string, pattern = 'dd/MM/yyyy · HH:mm') => value && isValid(parseISO(value)) ? format(parseISO(value), pattern, { locale: ptBR }) : '—';
export const nowLocal = () => format(new Date(), "yyyy-MM-dd'T'HH:mm");
export const today = () => format(new Date(), 'yyyy-MM-dd');
export const uid = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0,8)}`;
export const normalized = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
