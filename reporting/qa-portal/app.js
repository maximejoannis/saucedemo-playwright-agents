(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const key = 'saucedemo-qa-theme';
  const preferred = () => {
    const saved = localStorage.getItem(key);
    return saved === 'light' || saved === 'dark'
      ? saved
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  };
  const apply = (theme) => {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    toggle?.setAttribute('aria-pressed', String(dark));
    toggle?.setAttribute('aria-label', `Activer le thème ${dark ? 'clair' : 'sombre'}`);
  };
  apply(preferred());
  toggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(key, next);
    apply(next);
  });
  // Point d’extension minimal pour une future injection par la CI.
  if (window.portalData?.generatedAt) {
    document.body.dataset.portalGeneratedAt = String(window.portalData.generatedAt);
  }
})();
