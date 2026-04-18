import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import {
  insertGuestbookEntry,
  listGuestbookEntries,
} from "./services/guestbookService";
import type {
  GuestbookEntry,
  GuestbookInsertPayload,
} from "./types/guestbook";
import AuthPanel from "./components/AuthPanel";
import GuestbookForm from "./components/GuestbookForm";
import GuestbookList from "./components/GuestbookList";
import UserBar from "./components/UserBar";
import "./App.css";

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listGuestbookEntries()
      .then((data) => {
        if (!cancelled) setEntries(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAdd = useCallback(
    async (payload: GuestbookInsertPayload) => {
      const entry = await insertGuestbookEntry(payload);
      setEntries((prev) => [entry, ...prev]);
    },
    []
  );

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-row">
          <div className="app__header-text">
            <h1 className="app__title">방명록</h1>
            <p className="app__subtitle">이름과 한마디를 남겨 주세요.</p>
          </div>
          <div className="app__header-auth">
            {authLoading ? (
              <span className="app__auth-loading" aria-hidden>
                …
              </span>
            ) : user ? (
              <UserBar />
            ) : (
              <AuthPanel />
            )}
          </div>
        </div>
      </header>

      <main className="app__main">
        {user ? (
          <GuestbookForm onSubmit={handleAdd} />
        ) : (
          <p className="app__guest-hint" role="status">
            {authLoading
              ? ""
              : "글을 남기려면 로그인하거나 회원가입해 주세요."}
          </p>
        )}
        <GuestbookList entries={entries} loading={loading} />
      </main>
    </div>
  );
}
