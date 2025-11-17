const templates = {
    home: `
        <section class="home">
            <h2>Bem-vindos à nossa ONG</h2>
            <p>É com enorme alegria que recebemos você em nosso cantinho dedicado ao amor e ao cuidado animal.</p>

            <a href="#" data-route="projeto" class="btn-principal">
                Conheça Nossos Projetos
            </a>
        </section>
    `,

    projeto: `
        <section>
            <h2>Projetos</h2>
            <p>Aqui você exibe os textos e conteúdo da sua página de projetos.</p>
        </section>
    `,

    contatos: `
        <section>
            <h2>Fale Conosco</h2>

            <form id="form-contato" class="contato-form">
                <label>Nome:</label>
                <input type="text" id="nome" placeholder="Seu nome">

                <label>Email:</label>
                <input type="email" id="email" placeholder="seuemail@exemplo.com">

                <label>Mensagem:</label>
                <textarea id="mensagem" rows="5" placeholder="Escreva sua mensagem"></textarea>

                <button type="submit" class="btn-enviar">Enviar Mensagem</button>
            </form>

            <div id="alerta-form" class="alerta"></div>
        </section>
    `
};

function navigate(page) {
    const app = document.getElementById("app");

    if (!templates[page]) {
        app.innerHTML = `<h2>Página não encontrada</h2>`;
        return;
    }

    app.innerHTML = templates[page];

    localStorage.setItem("lastPage", page);

    ativarLinksInternos();

    if (page === "contatos") {
        ativarValidacaoContato();
    }
}

function ativarNavegacaoMenu() {
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const route = link.getAttribute("href").replace(".html", "");

            navigate(route);
        });
    });
}

function ativarLinksInternos() {
    document.querySelectorAll("[data-route]").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            navigate(link.getAttribute("data-route"));
        });
    });
}


function ativarValidacaoContato() {
    const form = document.getElementById("form-contato");
    const alerta = document.getElementById("alerta-form");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        let nome = document.getElementById("nome");
        let email = document.getElementById("email");
        let mensagem = document.getElementById("mensagem");

        let erros = [];

        if (nome.value.trim().length < 3) {
            erros.push("O nome deve ter pelo menos 3 caracteres.");
            nome.style.border = "2px solid red";
        } else {
            nome.style.border = "2px solid green";
        }

        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(email.value)) {
            erros.push("Formato de email inválido.");
            email.style.border = "2px solid red";
        } else {
            email.style.border = "2px solid green";
        }

        if (mensagem.value.trim().length < 10) {
            erros.push("A mensagem deve ter pelo menos 10 caracteres.");
            mensagem.style.border = "2px solid red";
        } else {
            mensagem.style.border = "2px solid green";
        }

        if (erros.length > 0) {
            alerta.innerHTML = `
                <div class="erro-box">
                    <h4>⚠ Corrija os erros abaixo:</h4>
                    <ul>${erros.map(e => `<li>${e}</li>`).join("")}</ul>
                </div>
            `;
            alerta.style.display = "block";
            alerta.style.color = "red";
            return;
        }

        alerta.innerHTML = `
            <div class="sucesso-box">
                <h4>✔ Mensagem enviada com sucesso!</h4>
            </div>
        `;
        alerta.style.display = "block";
        alerta.style.color = "green";

        localStorage.setItem("usuarioNome", nome.value);
    });
}

window.onload = () => {
    ativarNavegacaoMenu();
    ativarLinksInternos();

    navigate(localStorage.getItem("lastPage") || "home");
};