const API_URL =
"https://6a28978c4e1e783349a5ac9a.mockapi.io/api/v1/Materiais";

const inputNome =
document.getElementById("input-nome");

const inputQuantidade =
document.getElementById("input-quantidade");

const btnCadastrar =
document.getElementById("btn-cadastrar");

const listaMateriais =
document.getElementById("lista-materiais");

/**
 * Carrega os materiais da API e exibe na lista.
 * - Busca os materiais com fetch
 * - Ordena por quantidade (do maior para o menor)
 * - Preenche a lista na página e aplica destaque para baixos estoques
 */
async function carregarMateriais() {

    try {

        const resposta =
        await fetch(API_URL);

        const materiais =
        await resposta.json();

        listaMateriais.innerHTML = "";

        // Ordena do maior para o menor pela propriedade 'quantidade'
        materiais.sort((a, b) => b.quantidade - a.quantidade);

        materiais.forEach(material => {

            const nomeClass = material.quantidade < 100 ? 'low-qty' : '';

            listaMateriais.innerHTML += `
                <li>
                    <span class="${nomeClass}">${material.nome}</span>
                    <span>${material.quantidade}</span>
                </li>
            `;

        });

    }
    catch(error) {

        console.error(
            "Erro ao carregar materiais:",
            error
        );

    }

}

/**
 * Cadastra um novo material na API.
 * - Valida os campos de entrada
 * - Envia um POST para a API
 * - Atualiza a lista e mostra um alerta simples de sucesso
 */
async function cadastrarMaterial() {

    const nome =
    inputNome.value.trim();

    const quantidade =
    Number(inputQuantidade.value);

    if(!nome || quantidade <= 0){

        alert(
            "Preencha os campos corretamente."
        );

        return;
    }

    const material = {
        nome,
        quantidade
    };

    try {

        await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body:
            JSON.stringify(material)

        });

        inputNome.value = "";
        inputQuantidade.value = "";

        await carregarMateriais();
        alert("Material inserido");

    }
    catch(error){

        console.error(
            "Erro ao cadastrar:",
            error
        );

    }

}

btnCadastrar.addEventListener(
    "click",
    cadastrarMaterial
);

window.onload = carregarMateriais;