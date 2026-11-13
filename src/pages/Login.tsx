import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  MapPin,
  BedDouble,
  Coffee,
  Wifi,
} from "lucide-react";
import { Brand } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Field } from "../components/ui/shared";
export default function Login() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <section className="login-story">
        <Brand />
        <div className="login-architecture">
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="login-story-copy">
          <span className="eyebrow light">BEM-VINDO AO HOTEL MORENO</span>
          <h1>
            Hospitalidade em
            <br />
            cada detalhe.
            <br />
            <em>Gestão em um só lugar.</em>
          </h1>
          <p>
            Mais organização para a sua equipe.
            <br />
            Mais cuidado para quem chega.
          </p>
        </div>
        <div className="login-location">
          <MapPin size={16} />
          Itajobi, São Paulo · Desde a chegada, sinta-se em casa.
        </div>
      </section>
      <section className="login-form-panel">
        <div className="demo-pill">
          <span /> Ambiente de demonstração
        </div>
        <div className="login-form-content">
          <span className="login-welcome">SEU DIA COMEÇA AQUI</span>
          <h2>Que bom ter você de volta.</h2>
          <p>Acesse o painel administrativo do Hotel Moreno.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <Field label="Usuário ou e-mail">
              <input
                name="username"
                placeholder="administrador"
                autoComplete="username"
                defaultValue="administrador"
                required
              />
            </Field>
            <Field label="Senha">
              <div className="password-input">
                <input
                  name="password"
                  type={show ? "text" : "password"}
                  defaultValue="demonstracao"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>
            <Button type="submit">
              Entrar no painel
              <ArrowRight size={17} />
            </Button>
          </form>
          <div className="login-notice">
            <ShieldCheck size={18} />
            <p>
              Este é um acesso simulado. Utilize qualquer usuário e senha para
              conhecer o sistema.
            </p>
          </div>
        </div>
        <footer>Hotel Moreno</footer>
      </section>
    </div>
  );
}
