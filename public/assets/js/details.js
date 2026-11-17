const API_URL = "http://localhost:3001";

function getUsuarioLogado() {
  return JSON.parse(sessionStorage.getItem("usuarioCorrente"));
}

function getFavoritosUsuario() {
  const usuario = getUsuarioLogado();
  if (!usuario) return [];
  return JSON.parse(localStorage.getItem(`favoritos_${usuario.id}`)) || [];
}

function salvarFavoritosUsuario(favoritos) {
  const usuario = getUsuarioLogado();
  if (!usuario) return;
  localStorage.setItem(`favoritos_${usuario.id}`, JSON.stringify(favoritos));
}

function atualizarBotaoFavorito(id) {
  const btn = document.getElementById("btn-favorito");
  if (!btn) return;

  const favoritos = getFavoritosUsuario();
  const ehFavorito = favoritos.includes(String(id));

  btn.className = "btn " + (ehFavorito ? "btn-danger" : "btn-outline-danger");
  btn.textContent = ehFavorito ? "♥ Favoritado" : "♡ Favoritar";
}

function configurarBotaoFavorito(id) {
  const btn = document.getElementById("btn-favorito");
  if (!btn) return;

  atualizarBotaoFavorito(id);

  btn.addEventListener("click", () => {
    const usuario = getUsuarioLogado();

    if (!usuario) {
      alert("Faça login para usar favoritos.");
      window.location.href = "login.html";
      return;
    }

    let favoritos = getFavoritosUsuario();
    const idStr = String(id);

    if (favoritos.includes(idStr)) {
      favoritos = favoritos.filter(f => f !== idStr);
    } else {
      favoritos.push(idStr);
    }

    salvarFavoritosUsuario(favoritos);
    atualizarBotaoFavorito(id);
  });
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("loading").classList.add("d-none");
    document.getElementById("conteudo-detalhe").innerHTML = "<p>Nenhum destino selecionado.</p>";
    return;
  }

  const response = await fetch(`${API_URL}/destinos/${id}`);

  if (!response.ok) {
    document.getElementById("loading").classList.add("d-none");
    document.getElementById("conteudo-detalhe").innerHTML = "<p>Destino não encontrado.</p>";
    return;
  }

  const destino = await response.json();

document.getElementById("btn-editar").href =
  `editar_destino.html?id=${id}`;

const usuarioLogado = getUsuarioLogado();
if (usuarioLogado && usuarioLogado.admin) {
  document.getElementById("btn-editar").classList.remove("d-none");
  document.getElementById("btn-excluir").classList.remove("d-none");
}

configurarBotaoFavorito(id);

document.getElementById("loading").classList.add("d-none");
document.getElementById("detalhe-conteudo").classList.remove("d-none");

  document.title = destino.titulo + " — Destinos Mundo";
  document.getElementById("detalhe-titulo").textContent = destino.titulo;
  document.getElementById("detalhe-img").src = destino.imagem;
  document.getElementById("detalhe-img").alt = destino.titulo;
  document.getElementById("detalhe-categoria").textContent = destino.categoria;
  document.getElementById("detalhe-pais").textContent = destino.pais;
  document.getElementById("detalhe-epoca").textContent = destino.melhorEpoca;
  document.getElementById("detalhe-avaliacao").textContent = destino.avaliacao + " / 5.0";
  document.getElementById("detalhe-preco").textContent = "R$ " + destino.preco;
  document.getElementById("detalhe-descricao").textContent = destino.descricaoCompleta;

  const gridAtracoes = document.getElementById("grid-atracoes");
  destino.atracoes.forEach(atracao => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 mb-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${atracao.imagem}" class="card-img-top" style="height:180px; object-fit:cover;" alt="${atracao.nome}" />
        <div class="card-body">
          <h5 class="card-title">${atracao.nome}</h5>
          <p class="card-text text-muted">${atracao.descricao}</p>
        </div>
      </div>
    `;
    gridAtracoes.appendChild(col);
  });
}
document
  .getElementById("btn-excluir")
  .addEventListener("click", async () => {

    const id = new URLSearchParams(
      window.location.search
    ).get("id");

    if (!confirm("Deseja realmente excluir este destino?")) {
      return;
    }

    await fetch(
      `http://localhost:3001/destinos/${id}`,
      {
        method: "DELETE"
      }
    );

    alert("Destino excluído com sucesso!");

    window.location.href = "index.html";
});

document.addEventListener("DOMContentLoaded", init);