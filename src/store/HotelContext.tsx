import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Database } from '../domain/types';
import { localRepository } from '../services/storage';
interface Store { db: Database; mutate: (operation: (db: Database)=>void, message?: string)=>boolean; reset: ()=>void; toast: string; notify: (message: string)=>void; }
const Context = createContext<Store | null>(null);
export function HotelProvider({children}: {children: ReactNode}) {
 const [db,setDb]=useState(localRepository.load); const [toast,setToast]=useState('');
 function notify(message: string) { setToast(message); window.setTimeout(()=>setToast(current=>current===message?'':current),5000); }
 function mutate(operation:(draft:Database)=>void,message='Alterações salvas com sucesso.') { try { const draft=structuredClone(db); operation(draft); const persisted=localRepository.save(draft); setDb(draft); notify(persisted?message:'Alterações aplicadas nesta sessão. O navegador não permitiu salvar os dados locais.'); return true; } catch(error) { notify(error instanceof Error ? error.message : 'Não foi possível concluir a operação.'); return false; } }
 function reset() { const seed=localRepository.reset(); const saved=localRepository.save(seed); setDb(seed); notify(saved?'Dados de demonstração restaurados.':'Dados restaurados nesta sessão. Armazenamento local indisponível.'); }
 return <Context.Provider value={{db,mutate,reset,toast,notify}}>{children}</Context.Provider>;
}
export const useHotel = () => { const ctx=useContext(Context); if(!ctx) throw new Error('HotelProvider ausente'); return ctx; };
