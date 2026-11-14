import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Check, Mail, MessageCircle, Wifi } from "lucide-react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge, Field, Info } from "../ui/shared";
import { useHotel } from "../../store/HotelContext";
import {
  companyService,
  guestService,
  roomService,
  stayService,
  checkinService,
  checkoutService,
  templateService,
  templatePreview,
  activeEntries,
} from "../../services/hotel";
import { dateLabel, nowLocal } from "../../lib/utils";
export type Action = {
  kind:
    | "maintenance"
    | "finish"
    | "cancelStay"
    | "deleteGuest"
    | "deleteCompany"
    | "deleteRoom"
    | "deleteTemplate"
    | "cancelCheckin"
    | "cancelCheckout"
    | "message"
    | "reschedule"
    | "checkoutDetail"
    | "templateDetail"
    | "restore";
  id: string;
};
export function ActionDialog({
  action,
  close,
}: {
  action: Action | null;
  close: () => void;
}) {
  return action ? (
    <DialogBody
      key={`${action.kind}-${action.id}`}
      action={action}
      close={close}
    />
  ) : null;
}
function DialogBody({
  action: { kind, id },
  close,
}: {
  action: Action;
  close: () => void;
}) {
  const { db, mutate, notify, reset } = useHotel();
  const navigate = useNavigate();
  const stay = db.stays.find((s) => s.id === id);
  const room = db.rooms.find((r) => r.id === (stay?.roomId || id));
  const guest = db.guests.find((g) => g.id === id);
  const company = db.companies.find((c) => c.id === id);
  const entry = db.checkins.find((c) => c.id === id);
  const co = db.checkouts.find((c) => c.id === id);
  const template = db.templates.find((t) => t.id === id);
  const entries = db.checkins.filter((c) =>
    kind === "deleteGuest"
      ? c.guestId === id
      : kind === "deleteCompany"
        ? c.companyId === id
        : c.stayId === id && c.status === "Ativo",
  );
  const checkoutCount = db.checkouts.filter((c) =>
    entries.some((e) => e.id === c.checkinId),
  ).length;
  const [reason, setReason] = useState("");
  const [date, setDate] = useState(
    kind === "reschedule" ? stay?.end || nowLocal() : nowLocal(),
  );
  const [simultaneous, setSimultaneous] = useState(true);
  const [channel, setChannel] = useState("WhatsApp");
  const [templateId, setTemplateId] = useState(db.templates[0]?.id || "");
  const titles: Record<Action["kind"], string> = {
    maintenance: "Iniciar manutenção",
    finish: "Finalizar hospedagem",
    cancelStay: "Cancelar hospedagem",
    deleteGuest: "Excluir hóspede permanentemente",
    deleteCompany: "Excluir empresa permanentemente",
    deleteRoom: "Excluir quarto",
    deleteTemplate: "Excluir template",
    cancelCheckin: "Cancelar check-in",
    cancelCheckout: "Cancelar check-out",
    message: "Enviar informações ao hóspede",
    reschedule: "Alterar previsão de saída",
    checkoutDetail: "Detalhes do check-out",
    templateDetail: "Pré-visualização do template",
    restore: "Restaurar dados de demonstração",
  };
  const destructive =
    kind.startsWith("delete") ||
    kind.startsWith("cancel") ||
    kind === "restore";
  function confirm() {
    if (kind === "restore") {
      reset();
      close();
      return;
    }
    const success = mutate(
      (draft) => {
        switch (kind) {
          case "maintenance":
            roomService.status(draft, id, "Em manutenção", reason);
            break;
          case "finish":
            stayService.finish(draft, id, date, simultaneous);
            break;
          case "cancelStay":
            stayService.cancel(draft, id);
            break;
          case "deleteGuest":
            guestService.remove(draft, id);
            break;
          case "deleteCompany":
            companyService.remove(draft, id);
            break;
          case "deleteRoom":
            roomService.remove(draft, id);
            break;
          case "deleteTemplate":
            templateService.remove(draft, id);
            break;
          case "cancelCheckin":
            checkinService.cancel(draft, id);
            break;
          case "cancelCheckout":
            checkoutService.cancel(draft, id);
            break;
          case "reschedule":
            stayService.reschedule(draft, id, date);
            break;
        }
      },
      destructive
        ? "Operação concluída nos dados de demonstração."
        : "Alterações salvas com sucesso.",
    );
    if (success) {
      close();
      if (kind === "deleteGuest") navigate("/hospedes");
      if (kind === "deleteCompany") navigate("/empresas");
      if (kind === "deleteRoom") navigate("/quartos");
    }
  }
  const messageGuest = db.guests.find((g) => g.id === entry?.guestId);
  const messageTemplate = db.templates.find((t) => t.id === templateId);
  const messageStay = db.stays.find((s) => s.id === entry?.stayId);
  const messageRoom = db.rooms.find((r) => r.id === messageStay?.roomId);
  return (
    <Dialog
      open
      onOpenChange={(open) => !open && close()}
      title={titles[kind]}
      description={
        kind === "message"
          ? "Prepare uma mensagem com as informações da estadia. Envio apenas simulado."
          : kind === "templateDetail"
            ? "Exemplo preenchido com os dados da demonstração."
            : "Confira os dados e confirme a operação."
      }
      wide={kind === "message"}
    >
      <div className="dialog-body">
        {kind === "maintenance" && (
          <>
            <div className="summary-strip">
              <strong>Quarto {room?.number}</strong>
              <Badge>{room?.status}</Badge>
            </div>
            <Field label="Motivo da manutenção *">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Descreva o serviço necessário..."
                required
              />
            </Field>
            <div className="notice amber">
              <AlertTriangle size={18} />O quarto ficará indisponível para novas
              hospedagens até o encerramento da manutenção.
            </div>
          </>
        )}
        {(kind === "finish" || kind === "cancelStay") && (
          <>
            <div className="summary-strip">
              <strong>
                {stay?.id} · Quarto {room?.number}
              </strong>
              <Badge>{stay?.status}</Badge>
            </div>
            <p className="muted">
              {entries.length} check-in(s) ativo(s) nesta hospedagem:
            </p>
            <div className="affected-list">
              {entries.length ? (
                entries.map((c) => (
                  <div key={c.id}>
                    <span>
                      {db.guests.find((g) => g.id === c.guestId)?.name}
                    </span>
                    <Badge>{c.modality}</Badge>
                  </div>
                ))
              ) : (
                <p>Nenhum check-in pendente.</p>
              )}
            </div>
            {kind === "finish" && (
              <>
                {entries.length > 0 && (
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={simultaneous}
                      onChange={(e) => setSimultaneous(e.target.checked)}
                    />
                    Realizar check-outs pendentes simultaneamente
                  </label>
                )}
                <Field label="Data e hora de saída conjunta *">
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Field>
              </>
            )}
            <div className="notice amber">
              <AlertTriangle size={18} />
              {kind === "cancelStay"
                ? "Os check-ins ativos serão cancelados em conjunto. O quarto ficará Aguardando limpeza."
                : "O quarto ficará Aguardando limpeza. A liberação deve ser realizada manualmente."}
            </div>
          </>
        )}
        {(kind === "deleteGuest" || kind === "deleteCompany") && (
          <>
            <div className="summary-strip">
              <strong>{guest?.name || company?.name}</strong>
            </div>
            <div className="info-grid">
              <Info label="Check-ins relacionados">{entries.length}</Info>
              <Info label="Check-outs relacionados">{checkoutCount}</Info>
            </div>
            <div className="notice red">
              <AlertTriangle size={20} />A exclusão é permanente e
              irreversível. Os check-ins, check-outs e informações de hospedagem relacionados também serão
              excluídos.
            </div>
          </>
        )}
        {[
          "deleteRoom",
          "deleteTemplate",
          "cancelCheckin",
          "cancelCheckout",
        ].includes(kind) && (
          <div className="notice amber">
            <AlertTriangle size={20} />
            <div>
              {kind === "deleteRoom"
                ? `Excluir o quarto ${room?.number}? Quartos com histórico não podem ser excluídos.`
                : kind === "deleteTemplate"
                  ? `Excluir o template “${template?.name}”? Esta ação é permanente.`
                  : kind === "cancelCheckout"
                    ? "O check-out será cancelado e o check-in será reativado, desde que a hospedagem esteja ativa e haja capacidade."
                    : "O check-in será cancelado. A hospedagem continuará ativa."}
            </div>
          </div>
        )}
        {kind === "restore" && (
          <div className="notice red">
            <AlertTriangle size={20} />
            Todos os cadastros e alterações locais serão substituídos pelos
            dados iniciais da demonstração. Esta ação não pode ser desfeita.
          </div>
        )}
        {kind === "reschedule" && (
          <>
            <p>
              Hospedagem {stay?.id} · Quarto {room?.number}. A nova previsão
              será compartilhada por todos os check-ins.
            </p>
            <Field label="Nova previsão de saída *">
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Field>
          </>
        )}
        {kind === "message" && (
          <>
            <div className="summary-strip">
              <strong>{messageGuest?.name}</strong>
              <span>Quarto {messageRoom?.number}</span>
            </div>
            <div className="channel-options">
              <button
                className={channel === "WhatsApp" ? "selected" : ""}
                onClick={() => setChannel("WhatsApp")}
              >
                <MessageCircle size={18} />
                WhatsApp
              </button>
              <button
                title={
                  messageGuest?.email
                    ? "Usar e-mail"
                    : "Este hóspede não possui e-mail cadastrado."
                }
                disabled={!messageGuest?.email}
                className={channel === "E-mail" ? "selected" : ""}
                onClick={() => setChannel("E-mail")}
              >
                <Mail size={18} />
                E-mail
              </button>
            </div>
            {!messageGuest?.email && (
              <small className="muted">
                E-mail indisponível: o hóspede não possui endereço cadastrado.
              </small>
            )}
            <Field label="Template">
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              >
                <option value="">Selecione um template</option>
                {db.templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="message-preview">
              {messageTemplate
                ? templatePreview(db, messageTemplate.content, id)
                : "Cadastre ou selecione um template para pré-visualizar."}
            </div>
            <div className="notice blue">
              <Wifi size={18} />
              Quarto {messageRoom?.number} · Wi-Fi: {db.settings.wifi}
            </div>
          </>
        )}
        {kind === "templateDetail" && (
          <>
            <h3>{template?.name}</h3>
            <div className="message-preview">
              {templatePreview(db, template?.content || "")}
            </div>
          </>
        )}
        {kind === "checkoutDetail" &&
          co &&
          (() => {
            const c = db.checkins.find((c) => c.id === co.checkinId);
            const s = db.stays.find((s) => s.id === c?.stayId);
            return (
              <div className="info-grid">
                <Info label="Hóspede">
                  {db.guests.find((g) => g.id === c?.guestId)?.name}
                </Info>
                <Info label="Status">
                  <Badge>{co.status}</Badge>
                </Info>
                <Info label="Entrada">{dateLabel(c?.entry)}</Info>
                <Info label="Saída">{dateLabel(co.exit)}</Info>
                <Info label="Hospedagem">
                  <Link to={`/hospedagens/${s?.id}`} onClick={close}>
                    {s?.id}
                  </Link>
                </Info>
                <Info label="Observações">{co.notes}</Info>
              </div>
            );
          })()}
      </div>
      <div className="dialog-footer">
        <Button variant="outline" onClick={close}>
          {kind === "templateDetail" || kind === "checkoutDetail"
            ? "Fechar"
            : "Voltar"}
        </Button>
        {kind === "message" ? (
          <Button
            disabled={!messageTemplate}
            onClick={() => {
              notify(
                `Simulação concluída: mensagem preparada para ${messageGuest?.name} via ${channel}. Nenhum envio real foi realizado.`,
              );
              close();
            }}
          >
            <Check size={16} />
            Simular envio
          </Button>
        ) : kind === "checkoutDetail" ? (
          <Button asChild>
            <Link to={`/check-outs/${id}/editar`} onClick={close}>
              Editar check-out
            </Link>
          </Button>
        ) : (
          kind !== "templateDetail" && (
            <Button
              variant={destructive ? "destructive" : "default"}
              disabled={
                (kind === "maintenance" && !reason.trim()) ||
                ((kind === "finish" || kind === "reschedule") && !date)
              }
              onClick={confirm}
            >
              {kind === "maintenance"
                ? "Iniciar manutenção"
                : kind === "finish"
                  ? "Finalizar hospedagem"
                  : kind === "reschedule"
                    ? "Salvar previsão"
                    : destructive
                      ? "Confirmar"
                      : "Salvar"}
            </Button>
          )
        )}
      </div>
    </Dialog>
  );
}
