export default function Loading() {
  returnss (
    <div className="status-page" role="status" aria-live="polite">
      <span className="spinner spinner--dark" aria-hidden="true" />
      <span className="status-code">DeSinaHub</span>
      <p>Loading…</p>
    </div>
  );
}
