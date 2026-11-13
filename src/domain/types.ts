export type RoomStatus = 'Disponível' | 'Ocupado' | 'Aguardando limpeza' | 'Em manutenção';
export type StayStatus = 'Ativa' | 'Concluída' | 'Cancelada';
export type EntryStatus = 'Ativo' | 'Concluído' | 'Cancelado';
export interface Room { id: string; number: string; capacity: number; password: string; status: RoomStatus; reason?: string }
export interface Stay { id: string; roomId: string; start: string; end: string; status: StayStatus }
export interface Guest { id: string; name: string; nationality: string; document: string; issuer: string; phone: string; email: string; city: string; state: string; address: string; birthday: string }
export interface Company { id: string; name: string; tradeName: string; document: string; phone: string; email: string }
export interface Checkin { id: string; stayId: string; guestId: string; modality: 'PF' | 'PJ'; companyId: string; entry: string; notes: string; status: EntryStatus }
export interface Checkout { id: string; checkinId: string; exit: string; notes: string; status: 'Concluído' | 'Cancelado' }
export interface Template { id: string; name: string; content: string }
export interface Settings { name: string; wifi: string; password: string; info: string }
export interface Database { rooms: Room[]; stays: Stay[]; guests: Guest[]; companies: Company[]; checkins: Checkin[]; checkouts: Checkout[]; templates: Template[]; settings: Settings }
export type Collection = Exclude<keyof Database, 'settings'>;
