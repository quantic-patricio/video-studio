import { useState, useMemo } from "react";
import { Player } from "@remotion/player";
import { componentRegistry, type ComponentEntry } from "./registry";

export const App: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    componentRegistry[0]?.id ?? null,
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return componentRegistry;
    const q = search.toLowerCase();
    return componentRegistry.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }, [search]);

  const selected = componentRegistry.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="showcase-layout">
      <aside className="showcase-sidebar">
        <div className="showcase-sidebar-header">
          <h1>Components</h1>
          <input
            type="text"
            className="showcase-search"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="showcase-list">
          {filtered.length === 0 ? (
            <div style={{ padding: "16px", color: "#6b7280", fontSize: 14 }}>
              {componentRegistry.length === 0
                ? "No shared components yet."
                : "No matches."}
            </div>
          ) : (
            filtered.map((entry) => (
              <div
                key={entry.id}
                className={`showcase-item ${selectedId === entry.id ? "active" : ""}`}
                onClick={() => setSelectedId(entry.id)}
              >
                <div className="showcase-item-name">{entry.name}</div>
                <div className="showcase-item-desc">{entry.description}</div>
              </div>
            ))
          )}
        </div>

        <div className="showcase-count">
          {componentRegistry.length} component
          {componentRegistry.length !== 1 ? "s" : ""}
        </div>
      </aside>

      <main className="showcase-preview">
        {selected ? (
          <ComponentPreview entry={selected} />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

const ComponentPreview: React.FC<{ entry: ComponentEntry }> = ({ entry }) => {
  return (
    <>
      <div className="showcase-preview-header">
        <span className="showcase-preview-title">{entry.name}</span>
        <span className="showcase-preview-path">{entry.path}</span>
      </div>

      <div className="showcase-preview-body">
        <Player
          component={entry.component}
          compositionWidth={1920}
          compositionHeight={1080}
          durationInFrames={entry.durationInFrames}
          fps={30}
          controls
          loop
          style={{
            width: "100%",
            maxWidth: 960,
            aspectRatio: "16 / 9",
            borderRadius: 8,
            overflow: "hidden",
          }}
        />
      </div>

      {entry.props && Object.keys(entry.props).length > 0 && (
        <div className="showcase-preview-props">
          <h3>Props</h3>
          {Object.entries(entry.props).map(([key, type]) => (
            <div key={key} className="showcase-prop-row">
              <span className="showcase-prop-label">{key}</span>
              <span className="showcase-prop-value">{type}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const EmptyState: React.FC = () => (
  <div className="showcase-empty">
    <div className="showcase-empty-icon">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    </div>
    <div className="showcase-empty-text">
      {componentRegistry.length === 0
        ? "No shared components yet. They will appear here as they are created."
        : "Select a component to preview."}
    </div>
  </div>
);
