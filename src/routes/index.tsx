import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import { Rooms, RoomDetail } from '../pages/Rooms';
import { Stays, StayDetail } from '../pages/Stays';
import { PeopleList, PersonDetail } from '../pages/People';
import { EntityForm } from '../components/forms/EntityForms';
import { Checkins, CheckinForm, CheckinDetail } from '../pages/Checkins';
import { Checkouts, CheckoutForm } from '../pages/Checkouts';
import { Templates, TemplateForm } from '../pages/Templates';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import { NotFound } from '../components/ui/shared';
export function AppRoutes(){return <BrowserRouter><Routes><Route path="/login" element={<Login/>}/><Route element={<Layout/>}><Route index element={<Dashboard/>}/><Route path="quartos" element={<Rooms/>}/><Route path="quartos/novo" element={<EntityForm entity="room"/>}/><Route path="quartos/:id" element={<RoomDetail/>}/><Route path="quartos/:id/editar" element={<EntityForm entity="room"/>}/><Route path="hospedagens" element={<Stays/>}/><Route path="hospedagens/nova" element={<EntityForm entity="stay"/>}/><Route path="hospedagens/:id" element={<StayDetail/>}/><Route path="hospedes" element={<PeopleList/>}/><Route path="hospedes/novo" element={<EntityForm entity="guest"/>}/><Route path="hospedes/:id" element={<PersonDetail/>}/><Route path="hospedes/:id/editar" element={<EntityForm entity="guest"/>}/><Route path="empresas" element={<PeopleList company/>}/><Route path="empresas/novo" element={<EntityForm entity="company"/>}/><Route path="empresas/:id" element={<PersonDetail company/>}/><Route path="empresas/:id/editar" element={<EntityForm entity="company"/>}/><Route path="check-ins" element={<Checkins/>}/><Route path="check-ins/novo" element={<CheckinForm/>}/><Route path="check-ins/:id" element={<CheckinDetail/>}/><Route path="check-ins/:id/editar" element={<CheckinForm/>}/><Route path="check-outs" element={<Checkouts/>}/><Route path="check-outs/novo" element={<CheckoutForm/>}/><Route path="check-outs/:id/editar" element={<CheckoutForm/>}/><Route path="templates" element={<Templates/>}/><Route path="templates/novo" element={<TemplateForm/>}/><Route path="templates/:id/editar" element={<TemplateForm/>}/><Route path="configuracoes" element={<Settings/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></BrowserRouter>}
