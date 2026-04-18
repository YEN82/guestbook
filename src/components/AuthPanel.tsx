import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./AuthPanel.css";

export default function AuthPanel() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password || busy) return;

    setBusy(true);
    try {
      if (mode === "login") {
        const { error: err } = await signIn(trimmedEmail, password);
        if (err) {
          setError(err.message);
          return;
        }
      } else {
        const { error: err, needsEmailConfirmation } = await signUp(
          trimmedEmail,
          password
        );
        if (err) {
          setError(err.message);
          return;
        }
        if (needsEmailConfirmation) {
          setInfo(
            "확인 메일을 보냈습니다. 메일함에서 링크를 눌러 가입을 완료해 주세요."
          );
          setPassword("");
          return;
        }
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-panel">
      <div className="auth-panel__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className={
            mode === "login"
              ? "auth-panel__tab auth-panel__tab--active"
              : "auth-panel__tab"
          }
          aria-selected={mode === "login"}
          onClick={() => {
            setMode("login");
            setError(null);
            setInfo(null);
          }}
        >
          로그인
        </button>
        <button
          type="button"
          role="tab"
          className={
            mode === "signup"
              ? "auth-panel__tab auth-panel__tab--active"
              : "auth-panel__tab"
          }
          aria-selected={mode === "signup"}
          onClick={() => {
            setMode("signup");
            setError(null);
            setInfo(null);
          }}
        >
          회원가입
        </button>
      </div>

      <form className="auth-panel__form" onSubmit={handleSubmit} noValidate>
        <div className="auth-panel__field">
          <label className="auth-panel__label" htmlFor="auth-email">
            이메일
          </label>
          <input
            id="auth-email"
            className="auth-panel__input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={busy}
          />
        </div>
        <div className="auth-panel__field">
          <label className="auth-panel__label" htmlFor="auth-password">
            비밀번호
          </label>
          <input
            id="auth-password"
            className="auth-panel__input"
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={busy}
          />
        </div>

        {error ? (
          <p className="auth-panel__message auth-panel__message--error">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="auth-panel__message auth-panel__message--info">
            {info}
          </p>
        ) : null}

        <button className="auth-panel__submit" type="submit" disabled={busy}>
          {busy
            ? "처리 중…"
            : mode === "login"
              ? "로그인"
              : "회원가입"}
        </button>
      </form>
    </div>
  );
}
