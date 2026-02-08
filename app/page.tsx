"use client";

import { useCallback, useMemo, useState } from "react";
import { composeSong } from "@/lib/composer";
import { generateLyrics, type GeneratedLyrics, type SongLength } from "@/lib/lyrics";

type GenerationState = "idle" | "creating" | "ready";

const lengthOptions: { value: SongLength; label: string }[] = [
  { value: "short", label: "ചുരുങ്ങിയത്" },
  { value: "medium", label: "ഹൃദയ സ്പർശം" },
  { value: "long", label: "ആഴമുള്ള" }
];

export default function Home() {
  const [selectedLength, setSelectedLength] = useState<SongLength>("medium");
  const [generationState, setGenerationState] = useState<GenerationState>("idle");
  const [lyrics, setLyrics] = useState<GeneratedLyrics | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setGenerationState("creating");
    setError(null);

    try {
      const generatedLyrics = generateLyrics(selectedLength);
      setLyrics(generatedLyrics);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      const composition = await composeSong(generatedLyrics.verses);
      setAudioUrl(composition.audioUrl);
      setGenerationState("ready");
    } catch (err) {
      console.error(err);
      setGenerationState("idle");
      setError("നിങ്ങളുടെ ഗാനം സൃഷ്ടിക്കുന്നതിനിടെ പിശക് സംഭവിച്ചു. ദയവായി വീണ്ടും ശ്രമിക്കുക.");
    }
  }, [audioUrl, selectedLength]);

  const callToActionLabel = useMemo(() => {
    switch (generationState) {
      case "creating":
        return "ഗാനം പാകം ചെയ്യുന്നു...";
      case "ready":
        return "മറ്റൊരു പ്രണയ വിരുന്ന്";
      default:
        return "എന്റെ പ്രണയ ഗാനം സൃഷ്ടിക്കുക";
    }
  }, [generationState]);

  return (
    <main>
      <section
        style={{
          background: "var(--card)",
          borderRadius: "24px",
          border: "1px solid var(--border)",
          boxShadow: "0 40px 120px rgba(15, 23, 42, 0.6)",
          padding: "2.5rem 3rem",
          backdropFilter: "blur(18px)"
        }}
      >
        <header style={{ marginBottom: "2rem" }}>
          <p style={{
            fontSize: "0.8rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#fda4af",
            margin: 0
          }}>
            Serenade Studio
          </p>
          <h1
            style={{
              margin: "0.5rem 0 0",
              fontSize: "2.75rem",
              lineHeight: 1.1,
              fontWeight: 700
            }}
          >
            Malayalam Romance Muse
          </h1>
          <p style={{ color: "#cbd5f5", maxWidth: "38ch", marginTop: "0.75rem" }}>
            ഹൃദയത്തെ താളത്തിലെടുക്കുന്ന മലയാള പ്രണയഗാനങ്ങൾ — സ്വയമായി എഴുതുക, സംഗീതം സൃഷ്ടിക്കുക, മൊത്തം പാടൽ ഡൗൺലോഡ് ചെയ്യുക.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            alignItems: "stretch"
          }}
        >
          <div
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              borderRadius: "18px",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              padding: "1.75rem"
            }}
          >
            <h2 style={{ marginTop: 0 }}>ആലാപന കോൺസോൾ</h2>
            <label
              htmlFor="length"
              style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", opacity: 0.8 }}
            >
              ഗാനം എത്രത്തോളം ആഴമുള്ളതാവണം?
            </label>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {lengthOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedLength(option.value)}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "12px",
                    border: option.value === selectedLength ? "1px solid transparent" : "1px solid rgba(148, 163, 184, 0.25)",
                    background: option.value === selectedLength ? "linear-gradient(120deg, var(--accent), var(--accent-dark))" : "rgba(15, 23, 42, 0.9)",
                    color: "#f8fafc",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    fontWeight: 500
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={generationState === "creating"}
              style={{
                marginTop: "1.75rem",
                width: "100%",
                padding: "0.95rem 1.25rem",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(120deg, var(--accent), var(--accent-dark))",
                color: "#fff",
                fontSize: "1.05rem",
                fontWeight: 600,
                cursor: generationState === "creating" ? "wait" : "pointer",
                boxShadow: "0 20px 40px rgba(251, 113, 133, 0.35)",
                transition: "transform 0.2s ease"
              }}
            >
              {callToActionLabel}
            </button>

            {error && (
              <p style={{ color: "#fda4af", marginTop: "1rem", fontSize: "0.95rem" }}>{error}</p>
            )}
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.45)",
              borderRadius: "18px",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem"
            }}
          >
            <h2 style={{ margin: 0 }}>പാട്ടിന്റെ വരികൾ</h2>

            {lyrics ? (
              <div style={{ display: "grid", gap: "1.5rem" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.6rem" }}>{lyrics.title}</h3>
                  <p style={{ margin: "0.35rem 0", color: "#e0f2fe" }}>Malayalam Love Ballad</p>
                </div>

                {lyrics.verses.map((verse, index) => (
                  <div
                    key={`verse-${index}`}
                    style={{
                      padding: "1rem 1.25rem",
                      background: "rgba(30, 41, 59, 0.65)",
                      borderRadius: "12px",
                      border: "1px solid rgba(148, 163, 184, 0.16)",
                      boxShadow: "inset 0 0 40px rgba(15, 23, 42, 0.5)"
                    }}
                  >
                    <p style={{
                      fontSize: "0.8rem",
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color: "rgba(248, 250, 252, 0.6)",
                      margin: "0 0 0.75rem"
                    }}>
                      {`ചരണം ${index + 1}`}
                    </p>
                    {verse.map((line, lineIndex) => (
                      <p key={lineIndex} style={{ margin: "0.25rem 0", lineHeight: 1.6 }}>
                        {line}
                      </p>
                    ))}
                  </div>
                ))}

                <div
                  style={{
                    padding: "1rem 1.25rem",
                    borderRadius: "12px",
                    background: "rgba(190, 18, 60, 0.18)",
                    border: "1px solid rgba(251, 113, 133, 0.35)"
                  }}
                >
                  <p style={{
                    fontSize: "0.8rem",
                    letterSpacing: "0.38em",
                    textTransform: "uppercase",
                    margin: 0,
                    color: "rgba(255, 228, 230, 0.7)"
                  }}>
                    പല്ലവി
                  </p>
                  <p style={{ marginTop: "0.75rem", lineHeight: 1.7 }}>{lyrics.refrain}</p>
                </div>

                <div
                  style={{
                    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
                    paddingTop: "1rem"
                  }}
                >
                  <p style={{ color: "rgba(226, 232, 240, 0.8)", fontStyle: "italic" }}>{lyrics.outro}</p>
                </div>
              </div>
            ) : (
              <p style={{ color: "rgba(226, 232, 240, 0.75)", lineHeight: 1.7 }}>
                നിങ്ങളുടെ ആത്മാവിന് അനുയോജ്യമായ മലയാള പ്രണയഗാനം സൃഷ്ടിക്കാൻ മുകളിൽ നിന്നും ഒരു mood തിരഞ്ഞെടുക്കുക. ഗാനം തയ്യാറായാൽ കുറച്ച് മണിക്കൂറുകൾക്കുള്ളിൽ തന്നെ നിങ്ങൾക്ക് കേൾക്കാനും ഡൗൺലോഡ് ചെയ്യാനും കഴിയും.
              </p>
            )}

            {generationState === "creating" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.85rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(96, 165, 250, 0.25)",
                  color: "#bfdbfe"
                }}
              >
                <span role="img" aria-label="waves">
                  🎧
                </span>
                സംഗീതം ചേർത്തുകൊണ്ടിരിക്കുന്നു...
              </div>
            )}

            {audioUrl && generationState === "ready" && (
              <div
                style={{
                  marginTop: "auto",
                  display: "grid",
                  gap: "1rem",
                  padding: "1.25rem",
                  borderRadius: "14px",
                  background: "rgba(248, 113, 116, 0.12)",
                  border: "1px solid rgba(248, 113, 116, 0.45)"
                }}
              >
                <p style={{ margin: 0, fontWeight: 600 }}>നിങ്ങളുടെ ഗാനമം തയ്യാറാണ്</p>
                <audio controls src={audioUrl} style={{ width: "100%" }} />
                <a
                  href={audioUrl}
                  download={`${lyrics?.title ?? "romantic-malayalam-song"}.wav`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    background: "rgba(15, 23, 42, 0.65)",
                    color: "#f1f5f9",
                    fontWeight: 500,
                    textDecoration: "none"
                  }}
                >
                  🎵 ഗാനം ഡൗൺലോഡ് ചെയ്യുക
                </a>
              </div>
            )}
          </div>
        </section>
      </section>

      <footer style={{ marginTop: "1.5rem", textAlign: "center", color: "rgba(148, 163, 184, 0.65)" }}>
        <small>Generated harmonies are algorithmic approximations crafted in-browser for instant inspiration.</small>
      </footer>
    </main>
  );
}
