// Button label that rolls up to a copy of itself on hover (CSS only, see .btn-roll).
export function Roll({ children }: { children: string }) {
  return (
    <span className="btn-roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
