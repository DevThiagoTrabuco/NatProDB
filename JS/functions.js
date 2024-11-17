const cardsPorPagina = 48;
let moleculas = [];
let paginaAtual = 1;

function carregarArquivo() {
    const url = "../Database/natprodb.xlsx";

    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            moleculas = XLSX.utils.sheet_to_json(worksheet);

            exibirMoleculas(paginaAtual);
            gerarPaginas();
        })
        .catch(err => console.error('Erro ao carregar o arquivo:', err));
}

async function gerarImagem(smiles) {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/PNG`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Falha ao obter imagem");
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (err) {
        console.error(err);
        return null;
    }
}

function criarCard(molecula, imagemURL) {
    return `
        <div class="col-md-4 col-lg-3">
          <div class="card">
            <img src="${imagemURL || '../images/placeholder.svg'}" class="card-img-top" alt="${molecula.Nome}">
            <div class="card-body">
              <h5 class="card-title">${molecula.Nome || "Molécula Desconhecida"}</h5>
              <p class="card-text"><strong>SMILES:</strong> ${molecula.SMILES}</p>
            </div>
          </div>
        </div>
    `;
}

async function exibirMoleculas(pagina) {
    const start = (pagina - 1) * cardsPorPagina;
    const end = start + cardsPorPagina;
    const subsetMoleculas = moleculas.slice(start, end);

    const container = document.getElementById("moleculeContainer");
    container.innerHTML = '';

    for (const molecula of subsetMoleculas) {
        const imagemURL = await gerarImagem(molecula.SMILES);
        const cardHTML = criarCard(molecula, imagemURL);
        container.innerHTML += cardHTML;
    }
}

function gerarPaginas() {
    const numPaginas = Math.ceil(moleculas.length / cardsPorPagina);
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ''; // Limpar a paginação existente

    for (let i = 1; i <= numPaginas; i++) {
        const li = document.createElement("li");
        li.classList.add("page-item");
        
        const a = document.createElement("a");
        a.classList.add("page-link");
        a.href = "#";
        a.textContent = i;
        a.onclick = function() {
            paginaAtual = i;
            exibirMoleculas(paginaAtual);
        };
        
        li.appendChild(a);
        paginationContainer.appendChild(li);
    }
}

document.addEventListener("DOMContentLoaded", carregarArquivo);

function logoChange(type){
    document.getElementById("ig_logo").src = "../images/logo_ig_" + type + ".png" // FUNÇÃO DA QUAL MAIS ME ORGULHO
}

function warning(){
    alert("Feature in development") //REMOVER ISSO QUANDO A FUNÇÃO DE PESQUISA E AS PÁGINAS INDIVIDUAIS ESTIVEREM PRONTAS
}