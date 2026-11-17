const API_URL = "http://localhost:3001/destinos";

const MAPBOX_TOKEN = "COLE_SEU_TOKEN_PUBLICO_AQUI";

const COORDENADAS = {
  "Machu Picchu": [-72.545, -13.1631],
  Santorini: [25.4615, 36.3932],
  Kyoto: [135.7681, 35.0116],
  "Patagônia": [-72.3311, -49.3315],
  Marrakech: [-7.9811, 31.6295],
  Islândia: [-19.0208, 64.9631],
  Bali: [115.1889, -8.4095],
  Petra: [35.4444, 30.3285],
  Amsterdã: [4.9041, 52.3676],
  "Grande Barreira de Coral": [147.6992, -18.2871],
  "Rio de Janeiro": [-43.1729, -22.9068],
  "Safári no Serengeti": [34.8333, -2.3333]
};

const PALETTE = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#0891b2",
  "#ca8a04",
  "#9333ea",
  "#ea580c",
  "#0f766e",
  "#be123c",
  "#4b5563",
  "#65a30d",
  "#7c3aed"
];

async function loadData() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const destinos = await res.json();
    return destinos.filter((d) => d.titulo && d.pais && d.categoria);
  } catch (e) {
    return null;
  }
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || "Outros";
    acc[k] = acc[k] || [];
    acc[k].push(item);
    return acc;
  }, {});
}

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function totalAtracoes(destinos) {
  return destinos.reduce((total, destino) => {
    return total + (Array.isArray(destino.atracoes) ? destino.atracoes.length : 0);
  }, 0);
}

function chartOptions(extra = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: extra.tooltip || {}
    },
    scales: extra.scales
  };
}

function buildMap(destinos) {
  const mapEl = document.getElementById("map");
  const destinosComMapa = destinos.filter((d) => COORDENADAS[d.titulo]);

  if (!window.mapboxgl || !MAPBOX_TOKEN || destinosComMapa.length === 0) {
    mapEl.innerHTML =
      '<div class="alert alert-warning m-3">Mapa indisponível. Confira a conexão e o token do Mapbox.</div>';
    return;
  }

  mapboxgl.accessToken = MAPBOX_TOKEN;
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [10, 18],
    zoom: 1.2
  });

  map.addControl(new mapboxgl.NavigationControl(), "top-right");

  destinosComMapa.forEach((destino) => {
    const popup = new mapboxgl.Popup({ offset: 18 }).setHTML(`
      <strong>${destino.titulo}</strong><br>
      ${destino.pais}<br>
      Avaliação: ${destino.avaliacao || "sem nota"}
    `);

    new mapboxgl.Marker()
      .setLngLat(COORDENADAS[destino.titulo])
      .setPopup(popup)
      .addTo(map);
  });
}

function buildCharts(destinos) {
  const paises = groupBy(destinos, "pais");
  const regioes = groupBy(destinos, "categoria");
  const paisLabels = Object.keys(paises).sort();
  const regiaoLabels = Object.keys(regioes).sort();
  const colors = paisLabels.map((_, i) => PALETTE[i % PALETTE.length]);
  const avaliacoes = destinos.filter((d) => d.avaliacao).map((d) => +d.avaliacao);

  document.getElementById("kpi-total").textContent = destinos.length;
  document.getElementById("kpi-categorias").textContent = paisLabels.length;
  document.getElementById("kpi-avaliacao").textContent =
    avaliacoes.length ? avg(avaliacoes).toFixed(2) : "-";
  document.getElementById("kpi-preco").textContent = totalAtracoes(destinos);

  new Chart(document.getElementById("chartPizza"), {
    type: "pie",
    data: {
      labels: regiaoLabels,
      datasets: [
        {
          data: regiaoLabels.map((regiao) => regioes[regiao].length),
          backgroundColor: regiaoLabels.map((_, i) => PALETTE[i % PALETTE.length]),
          borderColor: "#fff",
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed} destino(s)`
          }
        }
      }
    }
  });

  new Chart(document.getElementById("chartPaises"), {
    type: "bar",
    data: {
      labels: paisLabels,
      datasets: [
        {
          label: "Destinos",
          data: paisLabels.map((pais) => paises[pais].length),
          backgroundColor: colors,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    },
    options: chartOptions({
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          title: { display: true, text: "Quantidade de pontos turísticos" }
        }
      }
    })
  });

  new Chart(document.getElementById("chartAtracoesPais"), {
    type: "bar",
    data: {
      labels: paisLabels,
      datasets: [
        {
          label: "Atrações",
          data: paisLabels.map((pais) => totalAtracoes(paises[pais])),
          backgroundColor: colors,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    },
    options: chartOptions({
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          title: { display: true, text: "Quantidade de atrações" }
        }
      }
    })
  });

  const sorted = [...destinos]
    .filter((d) => d.avaliacao)
    .sort((a, b) => +b.avaliacao - +a.avaliacao);

  new Chart(document.getElementById("chartAvaliacaoDestino"), {
    type: "bar",
    data: {
      labels: sorted.map((d) => d.titulo),
      datasets: [
        {
          label: "Avaliação",
          data: sorted.map((d) => +d.avaliacao),
          backgroundColor: sorted.map((_, i) => PALETTE[i % PALETTE.length]),
          borderRadius: 5,
          borderSkipped: false
        }
      ]
    },
    options: chartOptions({
      scales: {
        x: {
          min: 0,
          max: 5,
          title: { display: true, text: "Avaliação média (0 a 5)" }
        }
      }
    })
  });
}

(async () => {
  const overlay = document.getElementById("loading-overlay");
  const errorMsg = document.getElementById("error-msg");

  const destinos = await loadData();
  overlay.style.display = "none";

  if (!destinos || destinos.length === 0) {
    errorMsg.style.display = "block";
    return;
  }

  buildMap(destinos);
  buildCharts(destinos);
})();