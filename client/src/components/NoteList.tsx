import React, { useCallback, useEffect, useState } from "react";
import {
  getNotes,
  handleCreateNote,
  deleteNote,
  updateNote,
} from "../services/note";
import type { Note } from "../types/note";

const NoteList = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const isEditing = editId !== "";

  const refreshNotes = useCallback(async () => {
    const data = await getNotes();
    setNotes(data);
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        await refreshNotes();
      } catch {
        setLoadFailed(true);
        setError("We couldn't load your notes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchNotes();
  }, [refreshNotes]);

  const retryLoad = async () => {
    setError("");
    setIsLoading(true);
    try {
      await refreshNotes();
      setLoadFailed(false);
    } catch {
      setError("We couldn't load your notes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditId("");
    setMsg("");
  };

  const modeHandler = (note: Note) => {
    setEditId(note._id);
    setMsg(note.title);
    setError("");
    document.getElementById("note-title")?.focus();
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (msg.trim().length === 0 || isSaving) {
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      if (isEditing) {
        await updateNote(editId, msg);
      } else {
        await handleCreateNote(msg);
      }

      await refreshNotes();
      cancelEdit();
    } catch {
      setError(
        isEditing
          ? "We couldn't update that note. Please try again."
          : "We couldn't save your note. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteHandler = async (id: string) => {
    setError("");
    setDeletingId(id);
    try {
      await deleteNote(id);
      await refreshNotes();
      if (editId === id) {
        cancelEdit();
      }
    } catch {
      setError("We couldn't delete that note. Please try again.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-200/40 blur-3xl"
      />
      <section className="relative mx-auto w-full max-w-3xl">
        <header className="mb-9 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 rounded-xl text-sm font-bold tracking-tight text-slate-800">
            <span className="grid size-10 place-items-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="size-5"
              >
                <path
                  d="M8 5.5h8M8 9.5h8M8 13.5h5m-8 7 3.2-3.2H18a2 2 0 0 0 2-2v-11a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16.2Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-base">little notes</span>
          </div>
          <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-500">
            YOUR PERSONAL SPACE
          </span>
        </header>

        <div className="mb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
            Make room for what matters
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                A little room
                <br className="hidden sm:block" /> to think.
              </h1>
              <p className="mt-3 max-w-md text-base leading-7 text-slate-500">
                Keep the small things close, so your mind can focus on the big
                ones.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 shadow-sm">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span>
                <span className="font-semibold text-slate-900">
                  {notes.length}
                </span>{" "}
                {notes.length === 1 ? "note" : "notes"}
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={submitHandler}
          className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.28)] sm:flex sm:items-center sm:gap-3 sm:p-4"
        >
          <label htmlFor="note-title" className="sr-only">
            Note title
          </label>
          <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="size-5 shrink-0 text-slate-400"
            >
              <path
                d="M12 5v14m7-7H5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              id="note-title"
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Write down a thought..."
              maxLength={240}
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 sm:flex-none"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving || msg.trim().length === 0}
              className="flex-1 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:bg-violet-300 disabled:shadow-none sm:flex-none"
            >
              {isSaving ? "Saving..." : isEditing ? "Save changes" : "Add note"}
            </button>
          </div>
        </form>

        {error && (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {error}
          </p>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Your notes</h2>
          <span className="text-xs font-medium text-slate-400">
            {isLoading ? "Loading..." : "Saved just for you"}
          </span>
        </div>

        {isLoading ? (
          <ul aria-label="Loading notes" className="grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <li
                key={item}
                className="h-24 animate-pulse rounded-2xl border border-slate-200/80 bg-white"
              />
            ))}
          </ul>
        ) : loadFailed ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              Your notes aren&apos;t available right now.
            </p>
            <button
              type="button"
              onClick={() => void retryLoad()}
              className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-violet-600"
            >
              Try again
            </button>
          </div>
        ) : notes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center">
            <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-violet-50 text-violet-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="size-6"
              >
                <path
                  d="M8 5h8a2 2 0 0 1 2 2v12H6V7a2 2 0 0 1 2-2Zm1 4h6m-6 4h6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h3 className="font-semibold text-slate-800">A fresh page</h3>
            <p className="mt-1 text-sm text-slate-500">
              Your notes will find a home here. Add your first one above.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {notes.map((note) => (
              <li
                key={note._id}
                className="group flex min-h-24 items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
              >
                <p className="min-w-0 flex-1 whitespace-pre-wrap break-words py-1 text-sm leading-6 text-slate-700">
                  {note.title}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => modeHandler(note)}
                    aria-label={`Edit note: ${note.title}`}
                    className="grid size-9 place-items-center rounded-lg text-slate-400 transition hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-2 focus-visible:outline-violet-600"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-4"
                    >
                      <path
                        d="m15 5 4 4M4 20l4.5-1 10.8-10.8a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteHandler(note._id)}
                    disabled={deletingId === note._id}
                    aria-label={`Delete note: ${note.title}`}
                    className="grid size-9 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-rose-600 disabled:cursor-wait disabled:opacity-50"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-4"
                    >
                      <path
                        d="M5 7h14m-12 0 1 13h8l1-13M9 7V4h6v3m-5 4v5m4-5v5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default NoteList;
