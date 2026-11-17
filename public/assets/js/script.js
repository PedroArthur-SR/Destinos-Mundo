const API_URL = "http://localhost:3001";

let destinos = [];

function getUsuario() {
  return JSON.parse(sessionStorage.getItem("usuarioCorrente"));
}

function atualizarLoginUI() {
  const area = document.getElementById("login-area");

  const usuario = getUsuario();

  const linkCadastrar = document.getElementById("link-cadastrar");
  const linkFavoritos = document.getElementById("link-favoritos");

  if (linkCadastrar) {
    linkCadastrar.classList.toggle("d-none", !(usuario && usuario.admin));
  }

  if (linkFavoritos) {
    linkFavoritos.classList.toggle("d-none", !usuario);
  }

  if (!area) return;

  if (!usuario) {
    area.innerHTML = `
      <a href="login.html" class="text-white">
        Entrar
      </a>
    `;
    return;
  }

  area.innerHTML = `
    Olá, ${usuario.nome}
    |
    <a href="#" id="logout-link" class="text-white">Sair</a>
  `;

  document
    .getElementById("logout-link")
    .addEventListener("click", function (e) {
      e.preventDefault();

      if (typeof logoutUser === "function") {
        logoutUser();
      } else {
        sessionStorage.removeItem("usuarioCorrente");
        location.reload();
      }
    });
}

function getFavoritos() {
  const usuario = getUsuario();

  if (!usuario) return [];

  return JSON.parse(
    localStorage.getItem(`favoritos_${usuario.id}`)
  ) || [];
}

function salvarFavoritos(favoritos) {
  const usuario = getUsuario();

  if (!usuario) return;

  localStorage.setItem(
    `favoritos_${usuario.id}`,
    JSON.stringify(favoritos)
  );
}

function toggleFavorito(idDestino) {
  const usuario = getUsuario();

  if (!usuario) {
    alert("Faça login para usar favoritos.");
    window.location.href =
"login.html";
    return;
  }

  let favoritos = getFavoritos();

  if (favoritos.includes(idDestino)) {
    favoritos = favoritos.filter(id => id !== idDestino);
  } else {
    favoritos.push(idDestino);
  }

  salvarFavoritos(favoritos);

  renderCards(destinos);
}

async function fetchItems() {
  const response = await fetch(`${API_URL}/destinos`);
  return response.json();
}

function createCard(item) {
  const favoritos = getFavoritos();

  const favorito =
    favoritos.includes(item.id);

  const col = document.createElement("div");

  col.className =
    "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

  col.innerHTML = `
    <div class="card h-100">

      <img
        src="${item.imagem}"
        class="card-img-top"
        style="height:180px; object-fit:cover;"
        alt="${item.titulo}"
      />

      <div class="card-body">

        <span class="badge bg-secondary mb-2">
          ${item.categoria}
        </span>

        <h5 class="card-title">
          ${item.titulo}
        </h5>

        <p class="card-text text-muted small">
          ${item.descricaoCurta}
        </p>

        <button
          class="btn btn-sm ${
            favorito
              ? "btn-danger"
              : "btn-outline-danger"
          } favorito-btn"
          data-id="${item.id}"
        >
          ❤ Favoritar
        </button>

      </div>

      <div class="card-footer d-flex justify-content-between align-items-center">

        <span class="fw-bold">
          R$ ${item.preco}
        </span>

        <a
          href="details.html?id=${item.id}"
          class="btn btn-dark btn-sm"
        >
          Ver detalhes
        </a>

      </div>

    </div>
  `;

  return col;
}

function renderCards(items) {
  const grid =
    document.getElementById("grid-destinos");

  grid.innerHTML = "";

  items.forEach(item => {
    grid.appendChild(createCard(item));
  });

  document
    .querySelectorAll(".favorito-btn")
    .forEach(btn => {

      btn.addEventListener("click", () => {
        toggleFavorito(btn.dataset.id);
      });

    });
}

function filtrarDestinos(termo) {
  const texto = termo.trim().toLowerCase();

  if (!texto) {
    renderCards(destinos);
    return;
  }

  const filtrados = destinos.filter(item =>
    (item.titulo || "").toLowerCase().includes(texto) ||
    (item.descricaoCurta || "").toLowerCase().includes(texto)
  );

  renderCards(filtrados);
}

function renderGraficoCategorias(items) {
  const canvas = document.getElementById("chartCategorias");
  if (!canvas) return;

  const contagem = {};
  items.forEach(item => {
    const cat = item.categoria || "Outros";
    contagem[cat] = (contagem[cat] || 0) + 1;
  });

  new Chart(canvas, {
    type: "pie",
    data: {
      labels: Object.keys(contagem),
      datasets: [{
        data: Object.values(contagem),
        backgroundColor: ["#2563eb", "#16a34a", "#dc2626", "#0891b2", "#ca8a04", "#9333ea", "#ea580c"]
      }]
    }
  });
}

async function init() {
  atualizarLoginUI();

  destinos = await fetchItems();

  document
    .getElementById("loading")
    .classList.add("d-none");

  renderCards(destinos);
  renderGraficoCategorias(destinos);

  const campoBusca = document.getElementById("campo-busca");
  if (campoBusca) {
    campoBusca.addEventListener("input", () => {
      filtrarDestinos(campoBusca.value);
    });
  }
}

document.addEventListener(
  "DOMContentLoaded",
  init
);