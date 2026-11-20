(() => {
  "use strict";
  const data = window.METEOPATH_DATA;
  const entries = Object.values(window.METEOPATH_CURRICULUM).flat();
  const relations = data.companies.reduce((total, org) => total + org.references.length, 0);
  const values = {
    tracks: data.specializations.length,
    courses: new Set(entries.map(c => c.code)).size,
    profiles: data.alumni.length,
    organizations: data.companies.length,
    "courses-hint": entries.length + " entri lintas paket",
    "organizations-hint": relations + " relasi lintas spesialisasi"
  };
  for (const [key, value] of Object.entries(values)) {
    document.querySelector(`[data-stat="${key}"]`).textContent = value;
  }
})();
