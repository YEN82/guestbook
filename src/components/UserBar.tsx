import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./UserBar.css";

export default function UserBar() {
  const { user, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const email = user?.email ?? "";

  async function handleSignOut() {
    if (busy) return;
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="user-bar">
      <span className="user-bar__email" title={email}>
        {email}
      </span>
      <button
        type="button"
        className="user-bar__logout"
        onClick={handleSignOut}
        disabled={busy}
      >
        {busy ? "…" : "로그아웃"}
      </button>
    </div>
  );
}
