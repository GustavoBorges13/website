// Dados dos Projetos (Sua Wiki Virtual)
const projectsData = {
    'iot-dashboard': {
        title: "IoT Control Dashboard",
        description: "A complete remote control system for ESP8266 devices. This project allows real-time manipulation of RGB LEDs (color, brightness, patterns) and webcam monitoring through a secure web interface. <br><br> Features include: <br> - Real-time Websocket communication <br> - Live logs display <br> - Webcam integration <br> - User authentication.",
        techs: ["ESP8266 (C++)", "WebSockets", "HTML5/CSS3", "JavaScript", "MQTT", "Arduino IDE"],
        images: [
            // Substitua pelos caminhos reais das suas imagens/gifs
            "imagens/Projetos/iot_project_1/video_1.gif", 
            "imagens/Projetos/iot_project_1/video_2.gif", 
            "imagens/Projetos/iot_project_1/img_1.png",
            "https://placehold.co/800x400/1a1a1a/C39B71?text=Diagram+TODO",
        ],
        links: [
            { text: "GitHub Repo", url: "https://github.com/GustavoBorges13/iot_projeto_1" },
            { text: "Access dashboard", url: "http://app.gustavos.cloud/" }
        ],
        statusCheckUrl: "https://app.gustavos.cloud" 
    },
    'minecraft_server': {
        title: "Minecraft Server + Admin Panel",
        description: "A minecraft server and admin panel to manipulate files and server in oracle virtual machine.",
        techs: ["Minecraft", "Server", "Python", "Oracle Cloud", "Virtual Machine", "Linux Ubuntu", "Cloudflared"],
        images: [
            "imagens/Projetos/minecraft_server/login.png", 
            "imagens/Projetos/minecraft_server/tela_inicial.png", 
            "imagens/Projetos/minecraft_server/tela_arquivos.png", 
            "https://placehold.co/800x400/1a1a1a/C39B71?text=Pipeline+Diagram",
        ],
        links: [
        ]
    },
    'logicban': {
        title: "LogicBan - Game",
        description: "LogicBan is a 2D game developed in Java as an academic project. The objective of the game is to challenge players with engaging logic-based puzzles.",
        techs: ["java", "Multi-version", "PC-game", "Graphics2d", "Audio", "JFrame"],
        images: [
            // Substitua pelos caminhos reais das suas imagens/gifs
            "imagens/Projetos/logicban/inicio.gif", 
            "imagens/Projetos/logicban/fase1.gif", 
            "imagens/Projetos/logicban/fase2.gif",
            "imagens/Projetos/logicban/fase3.gif",
            "imagens/Projetos/logicban/fase4.gif",
        ],
        links: [
            { text: "GitHub Repo", url: "https://github.com/GustavoBorges13/LogicBan" },
            { text: "Download Game", url: "https://github.com/GustavoBorges13/LogicBan/releases/tag/v2.2.1" }
        ]
     },
    'ti_automation': {
        title: "TI - Technical Report Automation", // Corrigi o typo 'Tecnhincal'
        description: "During my internship at HPE, I developed a tool that simplifies the transfer of spreadsheet data from the server by generating easy-to-edit tables through Java-based graphical interfaces...",
        techs: ["Java", "Automation", "Excel", "Word", "Fileserver", "PDF conversion"],
        
        // ATUALIZE AS IMAGENS AQUI PARA AS DE TI 👇
        images: [
            "imagens/hpe_TI/img_1.png", 
            "imagens/hpe_TI/img_2.png",
            "imagens/hpe_TI/img_3.png",
            "imagens/hpe_TI/img_4.png"
        ],
        
        links: [
            { text: "Github URL", url: "https://github.com/GustavoBorges13/Conversor_XLSX-PDF" }
        ]
    },
};

let currentSlideIndex = 0;
let currentProjectImages = [];

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const menuIcon = document.querySelector('#menu-icon');
    const navMenu = document.querySelector('header nav');
    const navLinks = document.querySelectorAll('header nav a');
    const sections = document.querySelectorAll('section');
    const body = document.body;

    window.addEventListener('scroll', () => {
        // Ativa a sombra quando descer 50px
        header.classList.toggle('sticky', window.scrollY > 50);
    });

    // Menu Mobile
    menuIcon.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuIcon.classList.toggle('fa-x'); // Opcional: muda ícone para X
    });

    // Função Principal de Navegação
    const showSection = (sectionId) => {
        // Esconde todas as seções
        sections.forEach(sec => {
            sec.classList.add('hidden');
        });

        // Mostra a desejada
        const sectionToShow = document.querySelector(sectionId);
        if (sectionToShow) {
            sectionToShow.classList.remove('hidden');
        }
        
        // Ajuste de fundo específico da Home
        if (sectionId === '#home') {
            body.classList.add('home-view');
        } else {
            body.classList.remove('home-view');
        }
    };

    // Event Listeners para os links do menu
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = link.getAttribute('href');
            
            showSection(sectionId);

            // Atualiza classe ativa no menu
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            navMenu.classList.remove('active'); // Fecha menu mobile ao clicar
        });
    });

    // Inicia na Home
    showSection('#home');
});

// --- FUNÇÕES DA WIKI DE PROJETOS ---

function openProject(projectId) {
    const project = projectsData[projectId];
    if (!project) return; // Se não achar o projeto, para.

    // 1. Popula os dados (Título, Descrição, etc)
    document.getElementById('wiki-title').textContent = project.title;
    document.getElementById('wiki-desc').innerHTML = project.description;

    const statusContainer = document.getElementById('wiki-status-container');
    statusContainer.innerHTML = ''; 

    if (project.statusCheckUrl) {
        // 1. Cria o Badge "Checking..."
        const badge = document.createElement('div');
        badge.className = 'status-badge';
        badge.innerHTML = '<span class="status-dot"></span> <span id="status-text">Checking Status...</span>';
        statusContainer.appendChild(badge);

        // 2. Tenta conectar usando FETCH (Funciona com CSS, HTML, etc)
        // mode: 'no-cors' permite checar sites externos sem erro de segurança
        fetch(project.statusCheckUrl, { method: 'HEAD', mode: 'no-cors' })
            .then(() => {
                // SUCESSO: Conseguiu conectar
                badge.classList.add('online');
                badge.querySelector('#status-text').textContent = "System Online";
            })
            .catch(() => {
                // ERRO: Falha de rede (DNS, Timeout, Servidor desligado)
                badge.classList.remove('online');
                badge.classList.add('offline');
                badge.querySelector('#status-text').textContent = "System Offline";
            });
    }


    // Techs
    const techList = document.getElementById('wiki-techs');
    techList.innerHTML = '';
    if (project.techs) {
        project.techs.forEach(tech => {
            const li = document.createElement('li');
            li.textContent = tech;
            techList.appendChild(li);
        });
    }

    // Links
    const linkContainer = document.getElementById('wiki-links');
    linkContainer.innerHTML = '';
    if(project.links) {
        project.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = "_blank";
            a.className = "btn"; 
            
            // REMOVA OU COMENTE ESTA LINHA ABAIXO:
            // a.style.marginTop = "20px"; 
            // (Agora o CSS .wiki-links { margin-top: 2rem } cuida disso)

            a.textContent = link.text;
            linkContainer.appendChild(a);
        });
    }

    // Imagens (Slideshow)
    currentProjectImages = project.images || [];
    currentSlideIndex = 0;
    renderSlides();

    // --- CORREÇÃO IMPORTANTE AQUI ---
    
    // Antes: Escondia apenas 'projects'.
    // document.getElementById('projects').classList.add('hidden'); 

    // AGORA: Seleciona TODAS as seções e esconde
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        sec.classList.add('hidden');
    });

    // Mostra apenas a Wiki
    document.getElementById('project-wiki').classList.remove('hidden');
    
    // Garante que o fundo não fique preso no estilo 'home-view'
    document.body.classList.remove('home-view');
    
    // Scroll para o topo para o usuário ver o título
    window.scrollTo(0,0);
}

function closeProject() {
    // Esconde Wiki, volta para lista de Projetos
    document.getElementById('project-wiki').classList.add('hidden');
    document.getElementById('projects').classList.remove('hidden');
}

// Lógica do Slideshow
function renderSlides() {
    const wrapper = document.getElementById('wiki-slides');
    wrapper.innerHTML = ''; 
    
    // Se a lista estiver vazia ou nula
    if (!currentProjectImages || currentProjectImages.length === 0) {
        wrapper.innerHTML = '<p style="color:white; padding:20px;">No images available for this project.</p>';
        return;
    }

    currentProjectImages.forEach((src, index) => {
        // BLINDAGEM: Se o caminho for vazio ou nulo, pula
        if (!src || src.trim() === "") {
            console.warn(`Imagem ${index} ignorada: caminho vazio.`);
            return; 
        }

        console.log(`Carregando slide ${index}:`, src); // Isso vai aparecer no seu F12 (Console)

        const slideItem = document.createElement('div');
        slideItem.className = 'slide-item';
        // Força o item a ter o tamanho exato do container
        slideItem.style.minWidth = "100%"; 
        slideItem.style.width = "100%";
        slideItem.style.height = "100%";
        slideItem.style.display = "flex";
        slideItem.style.justifyContent = "center";
        slideItem.style.alignItems = "center";
        slideItem.style.position = "relative"; // Importante para layout

        if (isVideoFile(src)) {
            const vid = document.createElement('video');
            vid.src = src;
            vid.controls = true;
            vid.style.maxWidth = "100%";
            vid.style.maxHeight = "100%";
            // Adiciona preload metadata para evitar erros de loading agressivo
            vid.preload = "metadata"; 
            slideItem.appendChild(vid);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";
            img.style.objectFit = "contain";
            
            img.onerror = function() {
                console.error("Erro ao carregar imagem:", src);
                this.style.display = 'none'; // Apenas esconde se der erro
            };
            
            slideItem.appendChild(img);
        }

        wrapper.appendChild(slideItem);
    });

    updateSlidePosition();
}

function moveSlide(n) {
    if (!currentProjectImages.length) return;
    
    currentSlideIndex += n;
    
    if (currentSlideIndex >= currentProjectImages.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = currentProjectImages.length - 1;
    }
    
    updateSlidePosition();
}

function updateSlidePosition() {
    const wrapper = document.getElementById('wiki-slides');
    wrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
}

// --- LOGICA POPUP FLUTUANTE (COM VIDEO COMPLETO) ---

const popup = document.getElementById('hover-popup');
const popupImg = document.getElementById('popup-img');
const popupVideo = document.getElementById('popup-video');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const timelineItemsWrapper = document.querySelectorAll('.timeline-item');
const POPUP_WIDTH_CSS = 600; 

// Variáveis de Estado
let slideTimeout;       // Timer do slideshow automático
let closePopupTimer;    // Timer para fechar o popup (a ponte)
let currentImages = []; // Lista atual de imagens
let currentIndex = 0;   // Índice atual

// Função auxiliar para verificar extensão
function isVideoFile(filename) {
    return filename.match(/\.(mp4|webm|ogg)$/i);
}

// Mostra o slide baseado no índice
function showSlide(index) {
    // Garante limites do array
    if (index < 0) currentIndex = currentImages.length - 1;
    else if (index >= currentImages.length) currentIndex = 0;
    else currentIndex = index;

    const source = currentImages[currentIndex];

    // Limpa estados anteriores
    clearTimeout(slideTimeout);
    popupVideo.onended = null;
    popupVideo.pause();

    if (isVideoFile(source)) {
        // MODO VIDEO
        popup.classList.add('show-video');
        popupImg.style.display = 'none';
        popupVideo.style.display = 'block';
        
        popupVideo.src = source;
        popupVideo.play().catch(e => console.log("Autoplay error", e));

        // Quando acabar, vai para o próximo AUTOMATICAMENTE
        popupVideo.onended = () => {
            showSlide(currentIndex + 1);
        };
    } else {
        // MODO IMAGEM
        popup.classList.remove('show-video');
        popupVideo.style.display = 'none';
        popupImg.style.display = 'block';
        
        popupImg.src = source;

        // Espera 2.5s e vai para o próximo
        slideTimeout = setTimeout(() => {
            showSlide(currentIndex + 1);
        }, 2500);
    }
}


// --- CONTROLES MANUAIS ---
btnNext.addEventListener('click', (e) => {
    e.stopPropagation(); // Impede bugar eventos
    showSlide(currentIndex + 1); // Força próximo
});

btnPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showSlide(currentIndex - 1); // Força anterior
});

// Função para fechar o popup com segurança
function safeClosePopup() {
    popup.classList.remove('active');
    popup.classList.remove('show-text');
    popup.classList.remove('show-video');
    
    clearTimeout(slideTimeout);
    
    // CORREÇÃO DOS ERROS DE CONSOLE:
    popupVideo.pause();
    popupVideo.removeAttribute('src'); // Remove o atributo em vez de deixar vazio
    popupImg.src = "";
}


// Função RECURSIVA para controlar o ciclo
function playCycle(images, index) {
    // Limpa timers anteriores para evitar sobreposição
    clearTimeout(slideTimeout);
    
    // Proteção: se o popup fechou, para tudo
    if (!popup.classList.contains('active')) return;

    const currentSource = images[index];
    const nextIndex = (index + 1) % images.length;

    if (isVideoFile(currentSource)) {
        // --- MODO VÍDEO ---
        popup.classList.add('show-video');
        popupImg.style.display = 'none'; // Garante que img suma
        popupVideo.style.display = 'block';

        popupVideo.src = currentSource;
        popupVideo.play().catch(e => console.error("Erro autoplay:", e));

        // O segredo: só chama o próximo quando o vídeo acabar
        popupVideo.onended = () => {
            playCycle(images, nextIndex);
        };

    } else {
        // --- MODO IMAGEM ---
        popup.classList.remove('show-video');
        popupVideo.style.display = 'none';
        popupImg.style.display = 'block';
        
        // Remove listener do vídeo anterior para não dar conflito
        popupVideo.onended = null; 

        popupImg.src = currentSource;

        // Espera 2 segundos (2000ms) e chama o próximo
        slideTimeout = setTimeout(() => {
            playCycle(images, nextIndex);
        }, 2000); 
    }
}

// Função para fechar o popup com segurança
function safeClosePopup() {
    popup.classList.remove('active');
    popup.classList.remove('show-text');
    popup.classList.remove('show-video');
    clearTimeout(slideTimeout);
    popupVideo.pause();
    popupVideo.src = "";
}

// Eventos nos Itens da Timeline
timelineItemsWrapper.forEach((itemWrapper, index) => {
    const content = itemWrapper.querySelector('.timeline-content');
    
    if (!content || !content.getAttribute('data-images')) return;

    // 1. MOUSE ENTROU NO BLOCO DE TEXTO
    content.addEventListener('mouseenter', () => {
        // Cancela qualquer agendamento de fechar (se o mouse veio do popup de volta pro texto)
        clearTimeout(closePopupTimer);

        const imagesRaw = content.getAttribute('data-images');
        const projectID = content.getAttribute('data-project');
        const infoText = document.getElementById('popup-info-text');

        currentImages = JSON.parse(imagesRaw);

        if (projectID) {
            // TEM PROJETO: Transforma o texto em botão
            infoText.innerHTML = '<i class="fa-solid fa-up-right-from-square"></i> VIEW PROJECT';
            infoText.classList.add('clickable');
            
            // Define o clique para abrir a Wiki
            infoText.onclick = (e) => {
                e.stopPropagation(); // Não deixa clicar no popup inteiro
                openProject(projectID); // Chama sua função de abrir Wiki
                safeClosePopup(); // Fecha o popup lateral
            };
        } else {
            // NÃO TEM PROJETO: Volta a ser apenas texto "Slideshow"
            infoText.textContent = 'SLIDESHOW';
            infoText.classList.remove('clickable');
            infoText.onclick = null; // Remove o clique
        }

        if (currentImages.length > 0) {
            // Verifica NO PREVIEW
            if (currentImages[0].includes('none')) {
                popup.classList.add('show-text');
                popup.classList.remove('show-video');
                document.getElementById('popup-controls').style.display = 'none'; // Esconde botões
            } else {
                popup.classList.remove('show-text');
                document.getElementById('popup-controls').style.display = 'flex'; // Mostra botões
                
                // Inicia Slide
                currentIndex = 0;
                showSlide(0);
            }

            popup.classList.add('active');

            // Posicionamento
            const rect = content.getBoundingClientRect();
            const gap = 20; 
            const isLeftSide = (index % 2 === 0); 

            if (isLeftSide) {
                popup.style.left = (rect.right + gap) + 'px';
            } else {
                popup.style.left = (rect.left - POPUP_WIDTH_CSS - gap) + 'px';
            }
            // Centraliza verticalmente com o bloco ou alinha topo
            popup.style.top = (rect.top - 40) + 'px'; 
        }
    });

    // 2. MOUSE SAIU DO BLOCO DE TEXTO
    content.addEventListener('mouseleave', () => {
        // NÃO fecha imediatamente. Espera 300ms.
        // Se o usuário mover para o popup, cancelaremos isso.
        closePopupTimer = setTimeout(() => {
            safeClosePopup();
        }, 300); 
    });
});

// 3. EVENTOS NO PRÓPRIO POPUP (Para manter aberto)

popup.addEventListener('mouseenter', () => {
    // Usuário entrou no popup! Cancela o fechamento.
    clearTimeout(closePopupTimer);
});

popup.addEventListener('mouseleave', () => {
    // Usuário tirou o mouse do popup -> Agora sim, fecha.
    safeClosePopup();
});