// 1. Variáveis Globais
let indiceAtual = 1; 
const totalAvatares = 20;
let servicosSelecionados = []; // Certifique-se de que ela comece vazia aqui

// --- FUNÇÕES DO AVATAR ---
function mudarAvatar(direcao) {
    indiceAtual += direcao;
    if (indiceAtual > totalAvatares) indiceAtual = 1;
    if (indiceAtual < 1) indiceAtual = totalAvatares;

    const imgElement = document.getElementById('avatar-atual');
    const indicadorElement = document.getElementById('indicador');

    if (imgElement) imgElement.src = `img/avatar${indiceAtual}.jpg`;
    if (indicadorElement) indicadorElement.innerText = `Avatar ${indiceAtual} de ${totalAvatares}`;
}

function selecionarAvatar() {
    const avatarSelecionado = document.getElementById('avatar-atual').src;
    localStorage.setItem('avatarEscolhido', avatarSelecionado);
    window.location.href = "pag3.html";
}

// --- BANCO DE DADOS DE SERVIÇOS ---
const bancoServicos = {
    cabelo: [
        { nome: "Corte Feminino", preco: 90 },
        { nome: "Corte Masculino", preco: 50 },
        { nome: "Escova", preco: 50 },
        { nome: "Progressiva", preco: 250 },
        {nome:"Escova Simples", preco: 50 },
        {nome:"Coloração", preco: 150 },
        {nome:"Luzes/Mechas", preco: 300 },
        {nome:"Cronograma Capilar", preco: 130 },
        {nome:"Reconstrução", preco: 90 },
        {nome:"Hidratação", preco: 70 }
    ],
    unhas: [
        { nome: "Manicure", preco: 35 },
        { nome: "Pedicure", preco: 45 },
        { nome: "Esmaltação em Gel", preco: 70 },
        { nome: "Alongamento", preco: 180 }
    ],
    sobrancelhas: [
        { nome: "Design Simples", preco: 35 },
        { nome: "Design com Henna", preco: 60 },
        { nome: "Cílios a Fio a Fio", preco: 120 },
        { nome: "Manutenção Cilios", preco: 90 },
        { nome: "Lash lifting", preco: 90 },
        { nome: "Brow Lamination", preco: 90 },
        { nome: "Volume Russo", preco: 80 }

    ],
    pacotesglow:[
        { nome:"Dia de Glow (cabelo+unha)", preco:130 },
        { nome:"Glow Express", preco:65 },
        { nome:"Glow Completo", preco:180 },
        { nome:"Glow Noiva", preco:"(Consultar)" }
    ],
    maquiagem:[
          { nome:"Maquiagem Simples", preco: 80 },
          { nome:"Maquiagem Profissional", preco: 120 },
    ]

};

// --- FUNÇÃO DE CATEGORIA (UNIFICADA) ---
function trocarCategoria(categoria, botaoClicado) {
    const lista = document.getElementById('lista-servicos');
    if (!lista) return; 

    lista.innerHTML = ""; // Limpa a tela

    // Atualiza a cor dos botões
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    if (botaoClicado) botaoClicado.classList.add('active');

    // Gera os itens
    bancoServicos[categoria].forEach(servico => {
        const div = document.createElement('div');
        div.className = 'service-item';
        
        // Verifica se o item já estava selecionado para manter a cor ao voltar na aba
        const jaSelecionado = servicosSelecionados.some(s => s.nome === servico.nome);
        if (jaSelecionado) div.classList.add('selected');

        div.innerHTML = `
            <div class="service-info">
                <strong>${servico.nome}</strong>
                <span>R$ ${servico.preco}</span>
            </div>
            <span class="icon">✦</span>
        `;

        div.onclick = function() {
            this.classList.toggle('selected');
            
            if (this.classList.contains('selected')) {
                servicosSelecionados.push(servico);
            } else {
                servicosSelecionados = servicosSelecionados.filter(s => s.nome !== servico.nome);
            }
        };

        lista.appendChild(div);
    });
}

// --- INICIALIZAÇÃO E FINALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
    const primeiroBotao = document.querySelector('.cat-btn');
    if (primeiroBotao) {
        trocarCategoria('cabelo', primeiroBotao);
    }
});

function irParaResultado() {
    if (servicosSelecionados.length === 0) {
        alert("Por favor, selecione pelo menos um serviço!");
        return;
    }
    // Salva a lista no LocalStorage para a Pagina 4 ler
    localStorage.setItem('meusServicos', JSON.stringify(servicosSelecionados));
    window.location.href = "pag4.html";
}

// Função para preparar os dados do formulário na pag5
document.addEventListener("DOMContentLoaded", () => {
    // 1. Tenta encontrar o campo de serviços
    const campoServicos = document.getElementById('servicos-input');
    
    // Só executa o código se o campo existir na página atual (evita erro em outras páginas)
    if (campoServicos) {
        const dadosSalvos = localStorage.getItem('meusServicos');
        
        if (dadosSalvos) {
            try {
                const servicos = JSON.parse(dadosSalvos);
                // Transforma a lista de objetos em um texto único
                const resumoTexto = servicos.map(s => `${s.nome} (R$ ${s.preco})`).join(" | ");
                
                // Coloca o texto no campo invisível
                campoServicos.value = resumoTexto;
                console.log("Serviços prontos para envio!");
            } catch (erro) {
                console.error("Erro ao ler os serviços do localStorage:", erro);
            }
        }
    }
});
