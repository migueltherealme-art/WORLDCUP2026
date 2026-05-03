import { useState } from "react";
import "./styles.css";

// -----------------------------
// FLAGS
// -----------------------------
const flags = {
  Mexico: "🇲🇽",
  "South Africa": "🇿🇦",
  "Korea Republic": "🇰🇷",
  Czechia: "🇨🇿",
  Canada: "🇨🇦",
  "Bosnia-Herzegovina": "🇧🇦",
  Qatar: "🇶🇦",
  Switzerland: "🇨🇭",
  Brazil: "🇧🇷",
  Morocco: "🇲🇦",
  Haiti: "🇭🇹",
  Scotland: "🏴",
  USA: "🇺🇸",
  Paraguay: "🇵🇾",
  Australia: "🇦🇺",
  Turkiye: "🇹🇷"
};

// -----------------------------
// CORES
// -----------------------------
const teamColors = {
  Mexico: "#16a34a",
  "South Africa": "#f97316",
  "Korea Republic": "#ef4444",
  Czechia: "#2563eb",
  Canada: "#dc2626",
  "Bosnia-Herzegovina": "#1d4ed8",
  Qatar: "#a855f7",
  Switzerland: "#ef4444",
  Brazil: "#22c55e",
  Morocco: "#b91c1c",
  Haiti: "#f59e0b",
  Scotland: "#2563eb",
  USA: "#3b82f6",
  Paraguay: "#dc2626",
  Australia: "#facc15",
  Turkiye: "#dc2626"
};

// -----------------------------
// GRUPOS
// -----------------------------
const groupsData = [
  { group: "A", teams: [
    { name: "Mexico", code: "MEX" },
    { name: "South Africa", code: "RSA" },
    { name: "Korea Republic", code: "KOR" },
    { name: "Czechia", code: "CZE" }
  ]},
  { group: "B", teams: [
    { name: "Canada", code: "CAN" },
    { name: "Bosnia-Herzegovina", code: "BIH" },
    { name: "Qatar", code: "QAT" },
    { name: "Switzerland", code: "SUI" }
  ]},
  { group: "C", teams: [
    { name: "Brazil", code: "BRA" },
    { name: "Morocco", code: "MAR" },
    { name: "Haiti", code: "HAI" },
    { name: "Scotland", code: "SCO" }
  ]},
  { group: "D", teams: [
    { name: "USA", code: "USA" },
    { name: "Paraguay", code: "PAR" },
    { name: "Australia", code: "AUS" },
    { name: "Turkiye", code: "TUR" }
  ]}
];

// -----------------------------
// CROMOS
// -----------------------------
const createStickers = (code) =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `${code}${i + 1}`,
    owned: false,
    duplicates: 0
  }));

const generateTeams = () =>
  groupsData.flatMap((g) =>
    g.teams.map((t) => ({
      name: t.name,
      code: t.code,
      group: g.group,
      stickers: createStickers(t.code)
    }))
  );

export default function App() {
  const [teams, setTeams] = useState(generateTeams());
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // -----------------------------
  const findSticker = (query) => {
    if (!query) return null;

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      const index = team.stickers.findIndex(
        s => s.id.toLowerCase() === query.toLowerCase()
      );

      if (index !== -1) {
        return {
          teamIndex: i,
          team,
          sticker: team.stickers[index]
        };
      }
    }
    return null;
  };

  // -----------------------------
  const toggleOwned = (ti, si) => {
    const copy = [...teams];
    const s = copy[ti].stickers[si];
    s.owned = !s.owned;
    if (!s.owned) s.duplicates = 0;
    setTeams(copy);
  };

  const addDuplicate = (ti, si) => {
    const copy = [...teams];
    const s = copy[ti].stickers[si];
    if (s.owned) s.duplicates++;
    setTeams(copy);
  };

  const removeDuplicate = (ti, si) => {
    const copy = [...teams];
    const s = copy[ti].stickers[si];
    if (s.duplicates > 0) s.duplicates--;
    setTeams(copy);
  };

  // -----------------------------
  const getStats = (team) => {
    const total = team.stickers.length;
    const owned = team.stickers.filter(s => s.owned).length;
    return { total, owned, percent: owned / total };
  };

  const global = () => {
    let total = 0;
    let owned = 0;

    teams.forEach(t => {
      total += t.stickers.length;
      owned += t.stickers.filter(s => s.owned).length;
    });

    return owned / total;
  };

  const color = (v) =>
    v < 0.3 ? "#ef4444" : v < 0.7 ? "#f59e0b" : "#22c55e";

  // -----------------------------
  if (selectedTeam !== null) {
    const team = teams[selectedTeam];
    const accent = teamColors[team.name] || "#60a5fa";

    return (
      <div className="container">
        <button className="back" onClick={() => setSelectedTeam(null)}>
          ← voltar
        </button>

        <h2>{flags[team.name]} {team.name}</h2>

        <div className="grid">
          {team.stickers.map((s, i) => (
            <div key={s.id} className="card" style={{ borderColor: accent }}>
              <div className="id">{s.id}</div>

              <div className="actions">
                <button
                  style={{ borderColor: accent, color: accent }}
                  onClick={() => toggleOwned(selectedTeam, i)}
                >
                  {s.owned ? "✔ Tenho" : "○ Tenho"}
                </button>

                <button
                  style={{ borderColor: accent, color: accent }}
                  onClick={() => addDuplicate(selectedTeam, i)}
                >
                  ➕
                </button>

                <button
                  style={{ borderColor: accent, color: accent }}
                  onClick={() => removeDuplicate(selectedTeam, i)}
                >
                  ➖
                </button>

                <span>x{s.duplicates}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const g = global();

  return (
    <div className="container">
      <h1>Sticker Collection - World Cup 2026</h1>

      <input
        className="search"
        placeholder="MEX1, BRA5..."
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          setSearchResult(findSticker(value));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && searchResult) {
            setSelectedTeam(searchResult.teamIndex);
          }
        }}
      />

      {/* SEARCH RESULT */}
      {search && (
        <div className="searchBox">
          {!searchResult && <div>❌ Não encontrado</div>}

          {searchResult && (
            <>
              <div>✔ {searchResult.sticker.id}</div>
              <div>
                {searchResult.sticker.owned ? "✔ Tens" : "○ Não tens"}
              </div>
              <div>🔁 Repetidos: {searchResult.sticker.duplicates}</div>

              <button onClick={() => setSelectedTeam(searchResult.teamIndex)}>
                Ir para equipa →
              </button>
            </>
          )}
        </div>
      )}

      <h3>{(g * 100).toFixed(0)}%</h3>

      <div className="bar">
        <div className="fill" style={{ width: `${g * 100}%`, background: color(g) }} />
      </div>

      {groupsData.map(gr => (
        <div key={gr.group} className="groupBox">
          <h2>Grupo {gr.group}</h2>

          {teams
            .filter(t => t.group === gr.group)
            .map(t => {
              const stats = getStats(t);
              const accent = teamColors[t.name];

              return (
                <div
                  key={t.code}
                  className="teamCard"
                  style={{ borderColor: accent }}
                  onClick={() => setSelectedTeam(teams.indexOf(t))}
                >
                  {flags[t.name]} {t.name} ({t.code})

                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    {stats.owned}/{stats.total} • {(stats.percent * 100).toFixed(0)}%
                  </div>
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
}
