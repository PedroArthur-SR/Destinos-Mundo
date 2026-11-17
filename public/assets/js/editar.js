const API_URL = "http://localhost:3001";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function carregarDestino() {

  const response = await fetch(
    `${API_URL}/destinos/${id}`
  );

  const destino = await response.json();

  document.getElementById("titulo").value =
    destino.titulo || "";

  document.getElementById("descricaoCurta").value =
    destino.descricaoCurta || "";

  document.getElementById("descricaoCompleta").value =
    destino.descricaoCompleta || "";

  document.getElementById("pais").value =
    destino.pais || "";

  document.getElementById("categoria").value =
    destino.categoria || "";

  document.getElementById("melhorEpoca").value =
    destino.melhorEpoca || "";

  document.getElementById("preco").value =
    destino.preco || "";

  document.getElementById("imagem").value =
    destino.imagem || "";

  document.getElementById("tags").value =
    destino.tags
      ? destino.tags.join(", ")
      : "";

  document.getElementById("destaque").checked =
    destino.destaque || false;
}

document
  .getElementById("btn-atualizar")
  .addEventListener("click", async () => {

    const destinoAtualizado = {

      titulo:
        document.getElementById("titulo").value,

      descricaoCurta:
        document.getElementById("descricaoCurta").value,

      descricaoCompleta:
        document.getElementById("descricaoCompleta").value,

      pais:
        document.getElementById("pais").value,

      categoria:
        document.getElementById("categoria").value,

      melhorEpoca:
        document.getElementById("melhorEpoca").value,

      preco:
        Number(
          document.getElementById("preco").value
        ),

      imagem:
        document.getElementById("imagem").value,

      destaque:
        document.getElementById("destaque").checked,

      tags:
        document.getElementById("tags")
          .value
          .split(",")
          .map(t => t.trim()),

      atracoes: []
    };

    await fetch(
      `${API_URL}/destinos/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(destinoAtualizado)
      }
    );

    alert("Destino atualizado com sucesso!");

    window.location.href =
      `details.html?id=${id}`;
  });

carregarDestino();