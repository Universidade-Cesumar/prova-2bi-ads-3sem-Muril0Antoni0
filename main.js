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
 * - Busca os materiais cadastrados
 * - Ordena pela quantidade
 * - Destaca estoques baixos
 * - Cria os botões de baixa e exclusão
 */
async function carregarMateriais() {

    try {

        const resposta =
        await fetch(API_URL);

        const materiais =
        await resposta.json();

        listaMateriais.innerHTML = "";

        // Ordena do maior estoque para o menor
        materiais.sort(
            (a, b) =>
            b.quantidade - a.quantidade
        );

        materiais.forEach(material => {

            // Destaca materiais com estoque baixo
            const nomeClass =
            material.quantidade < 100
            ? "low-qty"
            : "";

            // Cria dinamicamente os botões de baixa e exclusão
            listaMateriais.innerHTML += `
    <li>

        <span class="${nomeClass} material-item">
            ${material.nome}
        </span>

        <span class="quantidade-item">
            ${material.quantidade}
        </span>

        <div class="acoes-item">

            <button
                class="btn-baixar"
                data-id="${material.id}">
                Baixar
            </button>

            <button
    class="btn-excluir"
    onclick="excluirMaterial(
        '${material.id}'
    )">
    Excluir
</button>

        </div>

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
 * - Valida os campos
 * - Envia para a MockAPI
 * - Atualiza a lista
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

        alert(
            "Material inserido com sucesso!"
        );

    }
    catch(error){

        console.error(
            "Erro ao cadastrar:",
            error
        );

    }

}

/**
 * Valida se uma retirada é permitida.
 * Retorna true para retirada válida.
 * Retorna false para retirada inválida.
 */
function validarRetirada(
    estoqueAtual,
    quantidadeRetirada
) {

    if (quantidadeRetirada <= 0) {
        return false;
    }

    if (quantidadeRetirada > estoqueAtual) {
        return false;
    }

    return true;
}

btnCadastrar.addEventListener(
    "click",
    cadastrarMaterial
);
/**
 * Exclui um material do estoque.
 * Remove o item da MockAPI e atualiza a lista.
 */
async function excluirMaterial(id) {

    try {

        await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        await carregarMateriais();

    }
    catch(error) {

        console.error(
            "Erro ao excluir material:",
            error
        );

    }

}

window.onload = carregarMateriais;