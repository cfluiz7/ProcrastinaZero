// Procrastinação Zero - Aplicativo Simplificado
// Implementação com JavaScript puro

// Estado da aplicação
const appState = {
    // Dados do usuário
    usuario: {
        nome: "Estudante",
        nivel: 1,
        xp: 30,
        streak: 3,
        conquistas: [1, 2]
    },
    
    // Hábitos
    habitos: {
        agua: 0,
        refeicoes: 0,
        sono: 7,
        estudos: 2
    },
    
    // Histórico de hábitos
    historico: [
        { 
            data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), 
            agua: 5, 
            refeicoes: 3, 
            sono: 6, 
            estudos: 2 
        },
        { 
            data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), 
            agua: 6, 
            refeicoes: 4, 
            sono: 7, 
            estudos: 3 
        },
        { 
            data: new Date().toLocaleDateString('pt-BR'), 
            agua: 2, 
            refeicoes: 1, 
            sono: 0, 
            estudos: 1 
        }
    ],
    
    // Matérias
    materias: [
        { id: "mat1", nome: "Matemática", prioridade: "alta", topicos: ["Álgebra", "Geometria", "Estatística"] },
        { id: "port1", nome: "Português", prioridade: "media", topicos: ["Gramática", "Interpretação", "Redação"] },
        { id: "hist1", nome: "História", prioridade: "baixa", topicos: ["Brasil Colônia", "Idade Média", "Revolução Industrial"] }
    ],
    
    // Tarefas
    tarefas: [
        { id: "t1", materiaId: "mat1", descricao: "Resolver exercícios de álgebra", concluida: false, duracao: 25 },
        { id: "t2", materiaId: "port1", descricao: "Ler capítulo sobre sintaxe", concluida: false, duracao: 25 },
        { id: "t3", materiaId: "hist1", descricao: "Resumir texto sobre Brasil Colônia", concluida: false, duracao: 25 }
    ],
    
    // Configurações
    configuracoes: {
        tema: "light",
        notificacoes: true,
        sons: true,
        horasDormir: "22:30",
        horasAcordar: "07:00",
        metas: {
            agua: 8,
            refeicoes: 5,
            estudos: 4,
            sono: 8
        }
    },
    
    // Pomodoro
    pomodoro: {
        minutos: 25,
        segundos: 0,
        ativo: false,
        modo: "foco", // foco ou pausa
        intervalo: null
    },
    
    // Modo foco
    modoFoco: {
        ativo: false,
        tempoFoco: 25
    }
};

// Níveis de experiência
const niveis = [
    { nivel: 1, nome: "Iniciante", xpNecessario: 0 },
    { nivel: 2, nome: "Aprendiz", xpNecessario: 100 },
    { nivel: 3, nome: "Estudante Dedicado", xpNecessario: 250 },
    { nivel: 4, nome: "Mestre do Foco", xpNecessario: 500 },
    { nivel: 5, nome: "Produtividade Suprema", xpNecessario: 1000 }
];

// Conquistas
const conquistas = [
    { id: 1, nome: "Primeiro Passo", descricao: "Completou seu primeiro dia no sistema", icone: "trophy" },
    { id: 2, nome: "Sequência Inicial", descricao: "Manteve 3 dias seguidos de atividade", icone: "fire" },
    { id: 3, nome: "Hidratação Consciente", descricao: "Bebeu 8 copos de água em um único dia", icone: "tint" },
    { id: 4, nome: "Mestre do Foco", descricao: "Completou 5 ciclos Pomodoro em um dia", icone: "bullseye" },
    { id: 5, nome: "Dorminhoco Saudável", descricao: "Dormiu pelo menos 8 horas por 5 dias seguidos", icone: "moon" },
    { id: 6, nome: "Alimentação Equilibrada", descricao: "Registrou 5 refeições saudáveis em um dia", icone: "apple-alt" }
];

// Carregar dados do localStorage
function carregarDados() {
    const dadosSalvos = localStorage.getItem("procrastinacaoZeroData");
    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);
            Object.assign(appState, dados);
            console.log("Dados carregados do localStorage");
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    }
}

// Salvar dados no localStorage
function salvarDados() {
    localStorage.setItem("procrastinacaoZeroData", JSON.stringify(appState));
    console.log("Dados salvos no localStorage");
}

// Inicializar a aplicação
function inicializar() {
    carregarDados();
    aplicarTema();
    atualizarInterface();
    configurarEventListeners();
    
    // Mostrar lembrete de água após 30 segundos (para demonstração)
    setTimeout(() => {
        mostrarLembreteAgua();
    }, 30000);
}

// Aplicar tema (claro/escuro)
function aplicarTema() {
    if (appState.configuracoes.tema === "dark" || 
        (appState.configuracoes.tema === "system" && 
         window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

// Atualizar toda a interface
function atualizarInterface() {
    atualizarDadosUsuario();
    atualizarHabitos();
    atualizarTarefas();
    atualizarMaterias();
    atualizarHistoricoHabitos();
    atualizarProgresso();
    atualizarConfiguracoes();
}

// Atualizar dados do usuário na interface
function atualizarDadosUsuario() {
    // Nível e XP na página inicial
    document.getElementById("user-level").textContent = appState.usuario.nivel;
    document.getElementById("user-xp").textContent = appState.usuario.xp;
    
    // Progresso na página inicial
    document.getElementById("streak-count").textContent = `${appState.usuario.streak} dias seguidos`;
    
    // Nível atual
    const nivelAtual = niveis.find(n => n.nivel === appState.usuario.nivel) || niveis[0];
    
    // Próximo nível
    const proximoNivel = niveis.find(n => n.nivel === appState.usuario.nivel + 1);
    
    // XP para o próximo nível
    const xpAtual = appState.usuario.xp - nivelAtual.xpNecessario;
    const xpParaProximoNivel = proximoNivel ? proximoNivel.xpNecessario - nivelAtual.xpNecessario : 0;
    const progresso = proximoNivel ? (xpAtual / xpParaProximoNivel) * 100 : 100;
    
    // Atualizar barra de progresso
    document.getElementById("xp-count").textContent = proximoNivel ? 
        `${xpAtual}/${xpParaProximoNivel}` : "Nível máximo";
    document.getElementById("xp-progress").style.width = `${progresso}%`;
    
    // Atualizar na página de progresso
    document.getElementById("level-title").textContent = nivelAtual.nome;
    document.getElementById("progresso-xp-count").textContent = proximoNivel ? 
        `${xpAtual}/${xpParaProximoNivel}` : "Nível máximo";
    document.getElementById("progresso-xp-progress").style.width = `${progresso}%`;
    document.getElementById("progresso-streak-count").textContent = `${appState.usuario.streak} dias seguidos`;
}

// Atualizar hábitos na interface
function atualizarHabitos() {
    // Água na página inicial
    document.getElementById("water-count").textContent = `${appState.habitos.agua}/${appState.configuracoes.metas.agua} copos`;
    document.getElementById("water-progress").style.width = `${Math.min(100, (appState.habitos.agua / appState.configuracoes.metas.agua) * 100)}%`;
    
    // Refeições na página inicial
    document.getElementById("meal-count").textContent = `${appState.habitos.refeicoes}/${appState.configuracoes.metas.refeicoes} refeições`;
    document.getElementById("meal-progress").style.width = `${Math.min(100, (appState.habitos.refeicoes / appState.configuracoes.metas.refeicoes) * 100)}%`;
    
    // Água na página de hábitos
    document.getElementById("habitos-water-count").textContent = `${appState.habitos.agua}/${appState.configuracoes.metas.agua} copos`;
    document.getElementById("habitos-water-progress").style.width = `${Math.min(100, (appState.habitos.agua / appState.configuracoes.metas.agua) * 100)}%`;
    
    // Refeições na página de hábitos
    document.getElementById("habitos-meal-count").textContent = `${appState.habitos.refeicoes}/${appState.configuracoes.metas.refeicoes} refeições`;
    document.getElementById("habitos-meal-progress").style.width = `${Math.min(100, (appState.habitos.refeicoes / appState.configuracoes.metas.refeicoes) * 100)}%`;
    
    // Sono e estudos
    document.getElementById("sono-horas").value = appState.habitos.sono;
    document.getElementById("sono-horas-value").textContent = `${appState.habitos.sono}h`;
    
    document.getElementById("estudo-horas").value = appState.habitos.estudos;
    document.getElementById("estudo-horas-value").textContent = `${appState.habitos.estudos}h`;
    
    // Calcular médias
    const calcularMedia = (campo) => {
        const registrosAnteriores = appState.historico.filter(r => 
            r.data !== new Date().toLocaleDateString('pt-BR'));
        
        if (registrosAnteriores.length === 0) return 0;
        
        const soma = registrosAnteriores.reduce((acc, r) => acc + r[campo], 0);
        return soma / registrosAnteriores.length;
    };
    
    // Atualizar médias
    const mediaAgua = calcularMedia('agua');
    const mediaRefeicoes = calcularMedia('refeicoes');
    
    document.getElementById("water-average").textContent = `${mediaAgua.toFixed(1)} copos`;
    document.getElementById("meal-average").textContent = `${mediaRefeicoes.toFixed(1)} refeições`;
    
    // Atualizar mensagens
    document.getElementById("water-message").textContent = mediaAgua < 6 
        ? "Você precisa melhorar sua hidratação!" 
        : "Boa hidratação! Continue assim.";
    
    document.getElementById("meal-message").textContent = mediaRefeicoes < 3 
        ? "Tente fazer mais refeições saudáveis!" 
        : "Boa alimentação! Continue assim.";
}

// Atualizar tarefas na interface
function atualizarTarefas() {
    const tarefasLista = document.getElementById("tarefas-lista");
    tarefasLista.innerHTML = "";
    
    if (appState.tarefas.length === 0) {
        tarefasLista.innerHTML = `
            <p class="text-center" style="padding: 1rem; color: var(--muted-foreground);">
                Nenhuma tarefa adicionada ainda.
            </p>
        `;
        return;
    }
    
    appState.tarefas.forEach((tarefa, index) => {
        const materia = appState.materias.find(m => m.id === tarefa.materiaId) || { nome: "Sem matéria" };
        
        const tarefaElement = document.createElement("div");
        tarefaElement.className = "tarefa-item";
        tarefaElement.innerHTML = `
            <input type="checkbox" id="tarefa-${index}" ${tarefa.concluida ? "checked" : ""}>
            <label for="tarefa-${index}">
                <span class="tarefa-descricao">${tarefa.descricao}</span>
                <div class="tarefa-detalhes">
                    <span>${materia.nome}</span>
                    <span>${tarefa.duracao} min</span>
                </div>
            </label>
        `;
        
        // Adicionar evento para marcar como concluída
        const checkbox = tarefaElement.querySelector(`#tarefa-${index}`);
        checkbox.addEventListener("change", () => {
            appState.tarefas[index].concluida = checkbox.checked;
            
            // Ganhar XP ao concluir tarefa
            if (checkbox.checked) {
                ganharXP(10);
            }
            
            salvarDados();
        });
        
        tarefasLista.appendChild(tarefaElement);
    });
}

// Atualizar matérias na interface
function atualizarMaterias() {
    const materiasLista = document.getElementById("materias-lista");
    materiasLista.innerHTML = "";
    
    appState.materias.forEach(materia => {
        const materiaElement = document.createElement("div");
        materiaElement.className = "materia-item";
        
        const prioridadeClasse = 
            materia.prioridade === "alta" ? "badge-danger" : 
            materia.prioridade === "media" ? "badge-warning" : 
            "badge-success";
        
        const prioridadeTexto = 
            materia.prioridade === "alta" ? "Alta" : 
            materia.prioridade === "media" ? "Média" : 
            "Baixa";
        
        materiaElement.innerHTML = `
            <div class="materia-header">
                <h5>${materia.nome}</h5>
                <span class="badge ${prioridadeClasse}">${prioridadeTexto}</span>
            </div>
            <div class="materia-topicos">
                <span class="topicos-label">Tópicos:</span>
                ${materia.topicos.join(", ")}
            </div>
        `;
        
        materiasLista.appendChild(materiaElement);
    });
    
    // Atualizar select de matérias
    const materiaSelect = document.getElementById("materia-select");
    materiaSelect.innerHTML = '<option value="">Selecione uma matéria</option>';
    
    appState.materias.forEach(materia => {
        const option = document.createElement("option");
        option.value = materia.id;
        option.textContent = materia.nome;
        materiaSelect.appendChild(option);
    });
}

// Atualizar histórico de hábitos
function atualizarHistoricoHabitos() {
    const habitsHistory = document.getElementById("habits-history");
    habitsHistory.innerHTML = "";
    
    // Ordenar por data (mais recente primeiro)
    const historicoOrdenado = [...appState.historico].sort((a, b) => {
        const dataA = new Date(a.data.split('/').reverse().join('-'));
        const dataB = new Date(b.data.split('/').reverse().join('-'));
        return dataB - dataA;
    });
    
    historicoOrdenado.forEach(registro => {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${registro.data}</td>
            <td class="${registro.agua >= 6 ? 'text-success' : 'text-warning'}">${registro.agua} copos</td>
            <td class="${registro.refeicoes >= 3 ? 'text-success' : 'text-warning'}">${registro.refeicoes} ref.</td>
            <td class="${registro.sono >= 7 ? 'text-success' : registro.sono >= 5 ? 'text-warning' : 'text-danger'}">${registro.sono}h</td>
            <td class="${registro.estudos >= 2 ? 'text-success' : 'text-warning'}">${registro.estudos}h</td>
        `;
        
        habitsHistory.appendChild(row);
    });
}

// Atualizar progresso e conquistas
function atualizarProgresso() {
    // Atualizar conquistas obtidas
    const medalhasObtidas = appState.usuario.conquistas;
    
    // Atualizar na página de progresso
    const medalhasGrid = document.querySelector(".medals-grid");
    medalhasGrid.innerHTML = "";
    
    conquistas.forEach(conquista => {
        const obtida = medalhasObtidas.includes(conquista.id);
        const data = obtida ? new Date().toLocaleDateString('pt-BR') : null;
        
        const medalhaElement = document.createElement("div");
        medalhaElement.className = `medal-card ${obtida ? 'obtained' : ''}`;
        
        medalhaElement.innerHTML = `
            <div class="medal-icon">
                <i class="fas fa-${conquista.icone}"></i>
            </div>
            <h5>${conquista.nome}</h5>
            <p>${conquista.descricao}</p>
            ${obtida 
                ? `<div class="medal-date">Conquistado em ${data}</div>` 
                : `<button class="btn-small" data-medal-id="${conquista.id}">Simular conquista</button>`
            }
        `;
        
        if (!obtida) {
            const botao = medalhaElement.querySelector("button");
            botao.addEventListener("click", () => {
                conquistarMedalha(conquista.id);
            });
        }
        
        medalhasGrid.appendChild(medalhaElement);
    });
}

// Atualizar configurações
function atualizarConfiguracoes() {
    // Tema
    document.querySelectorAll(".btn-option").forEach(btn => {
        btn.classList.remove("active");
    });
    
    if (appState.configuracoes.tema === "light") {
        document.getElementById("theme-light").classList.add("active");
    } else if (appState.configuracoes.tema === "dark") {
        document.getElementById("theme-dark").classList.add("active");
    } else {
        document.getElementById("theme-system").classList.add("active");
    }
    
    // Notificações
    document.getElementById("notificacoes-toggle").checked = appState.configuracoes.notificacoes;
    document.getElementById("sons-toggle").checked = appState.configuracoes.sons;
    
    // Rotina de sono
    document.getElementById("hora-dormir").value = appState.configuracoes.horasDormir;
    document.getElementById("hora-acordar").value = appState.configuracoes.horasAcordar;
    
    // Metas
    document.getElementById("meta-agua").value = appState.configuracoes.metas.agua;
    document.getElementById("meta-refeicoes").value = appState.configuracoes.metas.refeicoes;
    document.getElementById("meta-estudos").value = appState.configuracoes.metas.estudos;
    document.getElementById("meta-sono").value = appState.configuracoes.metas.sono;
}

// Configurar todos os event listeners
function configurarEventListeners() {
    // Navegação
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            
            // Esconder todas as páginas
            document.querySelectorAll(".page").forEach(page => {
                page.classList.remove("active");
            });
            
            // Mostrar a página alvo
            document.getElementById(targetId).classList.add("active");
            
            // Atualizar navegação
            document.querySelectorAll("nav li").forEach(item => {
                item.classList.remove("active");
            });
            link.parentElement.classList.add("active");
        });
    });
    
    // Alternar tema
    document.getElementById("theme-toggle").addEventListener("click", () => {
        if (document.body.classList.contains("dark")) {
            document.body.classList.remove("dark");
            appState.configuracoes.tema = "light";
        } else {
            document.body.classList.add("dark");
            appState.configuracoes.tema = "dark";
        }
        salvarDados();
    });
    
    // Botões de tema nas configurações
    document.getElementById("theme-light").addEventListener("click", () => {
        appState.configuracoes.tema = "light";
        aplicarTema();
        atualizarConfiguracoes();
        salvarDados();
    });
    
    document.getElementById("theme-dark").addEventListener("click", () => {
        appState.configuracoes.tema = "dark";
        aplicarTema();
        atualizarConfiguracoes();
        salvarDados();
    });
    
    document.getElementById("theme-system").addEventListener("click", () => {
        appState.configuracoes.tema = "system";
        aplicarTema();
        atualizarConfiguracoes();
        salvarDados();
    });
    
    // Controles de água
    document.getElementById("water-plus").addEventListener("click", () => {
        if (appState.habitos.agua < appState.configuracoes.metas.agua) {
            appState.habitos.agua++;
            atualizarHabitos();
            salvarDados();
            
            // Verificar conquista de hidratação
            if (appState.habitos.agua >= appState.configuracoes.metas.agua) {
                verificarConquista(3);
            }
            
            // Ganhar XP
            if (appState.habitos.agua === appState.configuracoes.metas.agua) {
                ganharXP(15);
            }
        }
    });
    
    document.getElementById("water-minus").addEventListener("click", () => {
        if (appState.habitos.agua > 0) {
            appState.habitos.agua--;
            atualizarHabitos();
            salvarDados();
        }
    });
    
    // Controles de refeições
    document.getElementById("meal-plus").addEventListener("click", () => {
        if (appState.habitos.refeicoes < appState.configuracoes.metas.refeicoes) {
            appState.habitos.refeicoes++;
            atualizarHabitos();
            salvarDados();
            
            // Verificar conquista de alimentação
            if (appState.habitos.refeicoes >= appState.configuracoes.metas.refeicoes) {
                verificarConquista(6);
            }
            
            // Ganhar XP
            if (appState.habitos.refeicoes === appState.configuracoes.metas.refeicoes) {
                ganharXP(15);
            }
        }
    });
    
    document.getElementById("meal-minus").addEventListener("click", () => {
        if (appState.habitos.refeicoes > 0) {
            appState.habitos.refeicoes--;
            atualizarHabitos();
            salvarDados();
        }
    });
    
    // Controles de água na página de hábitos
    document.getElementById("habitos-water-plus").addEventListener("click", () => {
        if (appState.habitos.agua < appState.configuracoes.metas.agua) {
            appState.habitos.agua++;
            atualizarHabitos();
            salvarDados();
            
            // Verificar conquista de hidratação
            if (appState.habitos.agua >= appState.configuracoes.metas.agua) {
                verificarConquista(3);
            }
            
            // Ganhar XP
            if (appState.habitos.agua === appState.configuracoes.metas.agua) {
                ganharXP(15);
            }
        }
    });
    
    document.getElementById("habitos-water-minus").addEventListener("click", () => {
        if (appState.habitos.agua > 0) {
            appState.habitos.agua--;
            atualizarHabitos();
            salvarDados();
        }
    });
    
    // Controles de refeições na página de hábitos
    document.getElementById("habitos-meal-plus").addEventListener("click", () => {
        if (appState.habitos.refeicoes < appState.configuracoes.metas.refeicoes) {
            appState.habitos.refeicoes++;
            atualizarHabitos();
            salvarDados();
            
            // Verificar conquista de alimentação
            if (appState.habitos.refeicoes >= appState.configuracoes.metas.refeicoes) {
                verificarConquista(6);
            }
            
            // Ganhar XP
            if (appState.habitos.refeicoes === appState.configuracoes.metas.refeicoes) {
                ganharXP(15);
            }
        }
    });
    
    document.getElementById("habitos-meal-minus").addEventListener("click", () => {
        if (appState.habitos.refeicoes > 0) {
            appState.habitos.refeicoes--;
            atualizarHabitos();
            salvarDados();
        }
    });
    
    // Controle de sono
    document.getElementById("sono-horas").addEventListener("input", (e) => {
        const valor = parseFloat(e.target.value);
        appState.habitos.sono = valor;
        document.getElementById("sono-horas-value").textContent = `${valor}h`;
        salvarDados();
        
        // Ganhar XP se dormir 8 horas ou mais
        if (valor >= 8 && !appState.habitos.xpSonoGanho) {
            ganharXP(10);
            appState.habitos.xpSonoGanho = true;
            salvarDados();
        }
    });
    
    // Controle de estudos
    document.getElementById("estudo-horas").addEventListener("input", (e) => {
        const valor = parseFloat(e.target.value);
        appState.habitos.estudos = valor;
        document.getElementById("estudo-horas-value").textContent = `${valor}h`;
        salvarDados();
        
        // Verificar conquista de estudos
        if (valor >= 4) {
            verificarConquista(7);
        }
    });
    
    // Pomodoro Timer
    document.getElementById("start-timer").addEventListener("click", () => {
        if (appState.pomodoro.ativo) {
            pausarPomodoro();
        } else {
            iniciarPomodoro();
        }
    });
    
    document.getElementById("reset-timer").addEventListener("click", () => {
        resetarPomodoro();
    });
    
    // Pomodoro Timer na página de cronograma
    document.getElementById("cronograma-start-timer").addEventListener("click", () => {
        if (appState.pomodoro.ativo) {
            pausarPomodoro();
        } else {
            iniciarPomodoro();
        }
    });
    
    document.getElementById("cronograma-reset-timer").addEventListener("click", () => {
        resetarPomodoro();
    });
    
    // Modo Foco
    document.getElementById("focus-time-range").addEventListener("input", (e) => {
        const valor = parseInt(e.target.value);
        appState.modoFoco.tempoFoco = valor;
        document.getElementById("focus-time-value").textContent = `${valor} min`;
    });
    
    document.getElementById("activate-focus").addEventListener("click", () => {
        ativarModoFoco();
    });
    
    document.getElementById("exit-focus-mode").addEventListener("click", () => {
        desativarModoFoco();
    });
    
    // Adicionar tarefa
    document.getElementById("adicionar-tarefa").addEventListener("click", () => {
        const materiaId = document.getElementById("materia-select").value;
        const descricao = document.getElementById("tarefa-descricao").value;
        const duracao = parseInt(document.getElementById("tarefa-duracao").value);
        
        if (!materiaId || !descricao || isNaN(duracao)) {
            alert("Por favor, preencha todos os campos.");
            return;
        }
        
        const novaTarefa = {
            id: `t${Date.now()}`,
            materiaId,
            descricao,
            concluida: false,
            duracao
        };
        
        appState.tarefas.push(novaTarefa);
        atualizarTarefas();
        salvarDados();
        
        // Limpar campos
        document.getElementById("tarefa-descricao").value = "";
    });
    
    // Adicionar matéria
    document.getElementById("adicionar-materia").addEventListener("click", () => {
        const nome = document.getElementById("nova-materia-nome").value;
        const prioridade = document.getElementById("nova-materia-prioridade").value;
        const topicosInput = document.getElementById("nova-materia-topicos").value;
        
        if (!nome) {
            alert("Por favor, informe o nome da matéria.");
            return;
        }
        
        const topicos = topicosInput.split(",")
            .map(t => t.trim())
            .filter(t => t !== "");
        
        const novaMateria = {
            id: `m${Date.now()}`,
            nome,
            prioridade,
            topicos
        };
        
        appState.materias.push(novaMateria);
        atualizarMaterias();
        salvarDados();
        
        // Limpar campos
        document.getElementById("nova-materia-nome").value = "";
        document.getElementById("nova-materia-topicos").value = "";
    });
    
    // Simular ganho de XP
    document.getElementById("simular-xp").addEventListener("click", () => {
        ganharXP(10);
    });
    
    // Salvar configurações
    document.getElementById("save-config").addEventListener("click", () => {
        // Notificações
        appState.configuracoes.notificacoes = document.getElementById("notificacoes-toggle").checked;
        appState.configuracoes.sons = document.getElementById("sons-toggle").checked;
        
        // Rotina de sono
        appState.configuracoes.horasDormir = document.getElementById("hora-dormir").value;
        appState.configuracoes.horasAcordar = document.getElementById("hora-acordar").value;
        
        // Metas
        appState.configuracoes.metas.agua = parseInt(document.getElementById("meta-agua").value);
        appState.configuracoes.metas.refeicoes = parseInt(document.getElementById("meta-refeicoes").value);
        appState.configuracoes.metas.estudos = parseInt(document.getElementById("meta-estudos").value);
        appState.configuracoes.metas.sono = parseInt(document.getElementById("meta-sono").value);
        
        salvarDados();
        atualizarInterface();
        
        // Mostrar mensagem de sucesso
        const mensagem = document.getElementById("config-message");
        mensagem.style.display = "block";
        mensagem.textContent = "Configurações salvas com sucesso!";
        
        setTimeout(() => {
            mensagem.style.display = "none";
        }, 3000);
    });
    
    // Resetar configurações
    document.getElementById("reset-config").addEventListener("click", () => {
        if (confirm("Tem certeza que deseja resetar todas as configurações para os valores padrão?")) {
            appState.configuracoes = {
                tema: "light",
                notificacoes: true,
                sons: true,
                horasDormir: "22:30",
                horasAcordar: "07:00",
                metas: {
                    agua: 8,
                    refeicoes: 5,
                    estudos: 4,
                    sono: 8
                }
            };
            
            aplicarTema();
            atualizarConfiguracoes();
            salvarDados();
            
            // Mostrar mensagem de sucesso
            const mensagem = document.getElementById("config-message");
            mensagem.style.display = "block";
            mensagem.textContent = "Configurações resetadas para os valores padrão!";
            
            setTimeout(() => {
                mensagem.style.display = "none";
            }, 3000);
        }
    });
    
    // Fechar lembrete de água
    document.getElementById("close-reminder").addEventListener("click", () => {
        document.getElementById("water-reminder").classList.add("hidden");
        ganharXP(2); // Ganhar XP por reconhecer a importância da hidratação
    });
}

// Funções do Pomodoro
function iniciarPomodoro() {
    if (appState.pomodoro.ativo) return;
    
    appState.pomodoro.ativo = true;
    
    // Atualizar botão
    document.getElementById("start-timer").innerHTML = '<i class="fas fa-pause"></i>';
    document.getElementById("cronograma-start-timer").innerHTML = '<i class="fas fa-pause"></i>';
    
    // Iniciar intervalo
    appState.pomodoro.intervalo = setInterval(() => {
        atualizarTempoPomodoro();
    }, 1000);
}

function pausarPomodoro() {
    if (!appState.pomodoro.ativo) return;
    
    appState.pomodoro.ativo = false;
    
    // Atualizar botão
    document.getElementById("start-timer").innerHTML = '<i class="fas fa-play"></i>';
    document.getElementById("cronograma-start-timer").innerHTML = '<i class="fas fa-play"></i>';
    
    // Limpar intervalo
    clearInterval(appState.pomodoro.intervalo);
}

function resetarPomodoro() {
    pausarPomodoro();
    
    if (appState.pomodoro.modo === "foco") {
        appState.pomodoro.minutos = 25;
    } else {
        appState.pomodoro.minutos = 5;
    }
    
    appState.pomodoro.segundos = 0;
    
    atualizarDisplayPomodoro();
}

function atualizarTempoPomodoro() {
    if (appState.pomodoro.segundos === 0) {
        if (appState.pomodoro.minutos === 0) {
            // Timer completado
            clearInterval(appState.pomodoro.intervalo);
            appState.pomodoro.ativo = false;
            
            // Alternar modo
            if (appState.pomodoro.modo === "foco") {
                appState.pomodoro.modo = "pausa";
                appState.pomodoro.minutos = 5;
                
                // Ganhar XP por completar um ciclo Pomodoro
                ganharXP(5);
                
                // Verificar conquista de Mestre do Foco
                appState.pomodoro.ciclosCompletos = (appState.pomodoro.ciclosCompletos || 0) + 1;
                if (appState.pomodoro.ciclosCompletos >= 5) {
                    verificarConquista(4);
                }
            } else {
                appState.pomodoro.modo = "foco";
                appState.pomodoro.minutos = 25;
            }
            
            appState.pomodoro.segundos = 0;
            
            // Atualizar botão
            document.getElementById("start-timer").innerHTML = '<i class="fas fa-play"></i>';
            document.getElementById("cronograma-start-timer").innerHTML = '<i class="fas fa-play"></i>';
            
            // Atualizar display
            atualizarDisplayPomodoro();
            
            // Notificar usuário
            if (appState.configuracoes.notificacoes) {
                if (appState.pomodoro.modo === "foco") {
                    alert("Pausa concluída! Hora de voltar ao foco.");
                } else {
                    alert("Tempo de foco concluído! Hora de fazer uma pausa.");
                }
            }
            
            return;
        }
        
        appState.pomodoro.minutos--;
        appState.pomodoro.segundos = 59;
    } else {
        appState.pomodoro.segundos--;
    }
    
    atualizarDisplayPomodoro();
}

function atualizarDisplayPomodoro() {
    const minutos = String(appState.pomodoro.minutos).padStart(2, "0");
    const segundos = String(appState.pomodoro.segundos).padStart(2, "0");
    const display = `${minutos}:${segundos}`;
    
    document.getElementById("timer").textContent = display;
    document.getElementById("cronograma-timer").textContent = display;
    document.getElementById("focus-timer").textContent = display;
    
    document.getElementById("timer-mode").textContent = appState.pomodoro.modo === "foco" ? "Foco" : "Pausa";
    document.getElementById("cronograma-timer-mode").textContent = appState.pomodoro.modo === "foco" ? "Foco" : "Pausa";
}

// Funções do Modo Foco
function ativarModoFoco() {
    appState.modoFoco.ativo = true;
    
    // Mostrar overlay
    document.getElementById("focus-mode-overlay").classList.remove("hidden");
    
    // Configurar timer
    appState.pomodoro.minutos = appState.modoFoco.tempoFoco;
    appState.pomodoro.segundos = 0;
    appState.pomodoro.modo = "foco";
    
    atualizarDisplayPomodoro();
    
    // Iniciar timer automaticamente
    iniciarPomodoro();
}

function desativarModoFoco() {
    appState.modoFoco.ativo = false;
    
    // Esconder overlay
    document.getElementById("focus-mode-overlay").classList.add("hidden");
    
    // Pausar timer
    pausarPomodoro();
}

// Mostrar lembrete de água
function mostrarLembreteAgua() {
    if (appState.configuracoes.notificacoes) {
        document.getElementById("water-reminder").classList.remove("hidden");
        
        // Esconder após 10 segundos
        setTimeout(() => {
            document.getElementById("water-reminder").classList.add("hidden");
        }, 10000);
    }
}

// Ganhar XP e subir de nível se necessário
function ganharXP(quantidade) {
    appState.usuario.xp += quantidade;
    
    // Verificar se subiu de nível
    const nivelAtual = niveis.find(n => n.nivel === appState.usuario.nivel);
    const proximoNivel = niveis.find(n => n.nivel === appState.usuario.nivel + 1);
    
    if (proximoNivel && appState.usuario.xp >= proximoNivel.xpNecessario) {
        appState.usuario.nivel++;
        
        // Notificar usuário
        if (appState.configuracoes.notificacoes) {
            alert(`Parabéns! Você subiu para o nível ${appState.usuario.nivel}: ${proximoNivel.nome}`);
        }
    }
    
    atualizarDadosUsuario();
    salvarDados();
}

// Conquistar medalha
function conquistarMedalha(id) {
    // Verificar se já tem a medalha
    if (appState.usuario.conquistas.includes(id)) {
        return;
    }
    
    // Adicionar medalha
    appState.usuario.conquistas.push(id);
    
    // Ganhar XP
    ganharXP(25);
    
    // Atualizar interface
    atualizarProgresso();
    
    // Notificar usuário
    const conquista = conquistas.find(c => c.id === id);
    if (appState.configuracoes.notificacoes && conquista) {
        alert(`Parabéns! Você conquistou a medalha "${conquista.nome}"`);
    }
}

// Verificar conquista
function verificarConquista(id) {
    // Verificar se já tem a medalha
    if (appState.usuario.conquistas.includes(id)) {
        return;
    }
    
    // Verificar condições específicas
    switch (id) {
        case 3: // Hidratação Consciente
            if (appState.habitos.agua >= appState.configuracoes.metas.agua) {
                conquistarMedalha(id);
            }
            break;
        case 4: // Mestre do Foco
            if (appState.pomodoro.ciclosCompletos >= 5) {
                conquistarMedalha(id);
            }
            break;
        case 6: // Alimentação Equilibrada
            if (appState.habitos.refeicoes >= appState.configuracoes.metas.refeicoes) {
                conquistarMedalha(id);
            }
            break;
        default:
            break;
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", inicializar);
