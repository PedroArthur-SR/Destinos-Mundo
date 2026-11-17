const API_URL_LOGIN = "http://localhost:3001";

async function carregarUsuarios() {
  const response = await fetch(`${API_URL_LOGIN}/usuarios`);
  return response.json();
}

async function loginUser(login, senha) {

  const usuarios =
    await carregarUsuarios();

  const usuario =
    usuarios.find(u =>
      u.login === login &&
      u.senha === senha
    );

  if (!usuario) {
    return false;
  }

  sessionStorage.setItem(
    "usuarioCorrente",
    JSON.stringify(usuario)
  );

  return true;
}

function logoutUser() {
  sessionStorage.removeItem("usuarioCorrente");
  window.location.href = "./login.html";
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const form =
      document.getElementById(
        "login-form"
      );

    if (!form) return;

    form.addEventListener(
      "submit",
      async (e) => {

        e.preventDefault();

        const login =
          document.getElementById("login")
          .value;

        const senha =
          document.getElementById("senha")
          .value;

        const sucesso =
          await loginUser(
            login,
            senha
          );

        if (!sucesso) {

          document
            .getElementById("erro")
            .classList
            .remove("d-none");

          return;
        }

        window.location.href =
          "index.html";
      }
    );
  }
);