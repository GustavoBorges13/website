const scrollTopBtn = document.getElementById("scrollTopBtn");

const I18N_FILES = {
  en: "i18n/en.json",
  "pt-BR": "i18n/pt-BR.json",
};

const Lang = (() => {
  let typed = null;

  const getNested = (obj, path) =>
    path.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);

  const load = async (lang) => {
    const url = I18N_FILES[lang] || I18N_FILES.en;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load i18n file: ${url}`);
    return res.json();
  };

  const apply = (d) => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getNested(d, key);
      if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const value = getNested(d, key);
      if (value !== undefined) el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const value = getNested(d, key);
      if (value !== undefined) el.setAttribute("placeholder", value);
    });

    document.querySelectorAll("[data-i18n-value]").forEach((el) => {
      const key = el.getAttribute("data-i18n-value");
      const value = getNested(d, key);
      if (value !== undefined) el.value = value;
    });

    const titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) {
      const key = titleEl.getAttribute("data-i18n");
      const value = getNested(d, key);
      if (value !== undefined) titleEl.textContent = value;
    }
  };

  const setCvLink = (lang) => {
    const btn = document.getElementById("cvBtn");
    if (!btn) return;

    const isPT = lang === "pt-BR";

    btn.href = isPT
      ? "https://gustavoborges13.github.io/curriculo/index.html"
      : "https://gustavoborges13.github.io/curriculo/eng_index.html";

    // texto do botão (pode vir do i18n, mas aqui já resolve simples)
    btn.textContent = isPT ? "Ver CV (PT-BR)" : "View CV (EN)";
  };

  const setUI = (lang) => {
    const isPT = lang === "pt-BR";
    document.querySelectorAll(".lang-flag").forEach((el) => (el.textContent = isPT ? "🇧🇷" : "🇺🇸"));
    document.querySelectorAll(".lang-label").forEach((el) => (el.textContent = isPT ? "BR" : "EN"));
    document.documentElement.lang = isPT ? "pt-BR" : "en";
  };

  const initTyped = (strings) => {
    if (typed) {
      typed.destroy();
      typed = null;
    }

    const safeStrings = Array.isArray(strings) && strings.length ? strings : ["Cloud & Automation"];

    typed = new Typed(".typing-text", {
      strings: safeStrings,
      typeSpeed: 90,
      backSpeed: 55,
      backDelay: 1200,
      loop: true,
      contentType: "null", // evita HTML no texto
    });
  };

  const detectInitial = () => {
    const saved = localStorage.getItem("site_lang");
    if (saved && I18N_FILES[saved]) return saved;

    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("pt") ? "pt-BR" : "en";
  };

  const set = async (lang) => {
    const dict = await load(lang);

    // expõe o dicionário atual para módulos que precisam de strings dinâmicas
    window.__i18n = dict;

    apply(dict);
    setUI(lang);

    setCvLink(lang); // ✅ aqui

    initTyped(getNested(dict, "home.typing"));
    Projects.sync(dict);

    // ✅ Se a Wiki estiver aberta, re-renderiza o conteúdo no idioma novo.
    // (sem precisar de F5)
    if (document.body.classList.contains("wiki-open")) {
      const hash = location.hash || "";
      const m = hash.match(/^#project=([^&]+)/);
      const id = m ? decodeURIComponent(m[1]) : null;
      if (id && typeof window.openWiki === "function") {
        window.openWiki(id, { silent: true, keepOpen: true });
      }
    }

    localStorage.setItem("site_lang", lang);
  };

  const toggle = async () => {
    const current = localStorage.getItem("site_lang") || detectInitial();
    const next = current === "pt-BR" ? "en" : "pt-BR";
    await set(next);
  };

  const bindButtons = () => {
    const btn = document.getElementById("langToggle"); // único botão (header)
    if (!btn) return;
    btn.addEventListener("click", toggle);
  };

  return { detectInitial, set, bindButtons };
})();


// =======================
// Projects: build list + wiki dataset from js/data.js + i18n
// =======================
const Projects = (() => {
  const getNested = (obj, path) =>
    path.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);

  const isVideo = (src = "") => /\.(mp4|webm|ogg)$/i.test(src);

  const buildProjectData = (dict) => {
    const arr = window.projectsData || [];
    const out = {};

    arr.forEach((p) => {
      const w = p.wiki || {};

      const title = getNested(dict, w.titleKey) || getNested(dict, p.titleKey) || p.id;
      const description = getNested(dict, w.descKey) || getNested(dict, p.shortKey) || "";

      const techs = getNested(dict, w.techsKey);
      const techList = Array.isArray(techs) ? techs : (p.tags || []);

      const links = (w.links || []).map((l) => ({
        text: getNested(dict, l.textKey) || l.textKey || "Link",
        url: l.url,
        download: !!l.download,
      }));

      const media = (w.images || []).filter(Boolean).map((src) => ({
        type: isVideo(src) ? "video" : "image",
        src,
      }));

      out[p.id] = { title, description, techs: techList, links, media, statusCheckUrl: w.statusCheckUrl || "", highlights: getNested(dict, w.highlightsKey) || [] };
    });

    window.projectData = out; // usado pelo Wiki
    return out;
  };

  const renderList = (dict) => {
    const list = document.querySelector("#projects .projects-list");
    if (!list) return;

    // limpa a lista (permite re-render ao trocar idioma)
    list.innerHTML = "";

    const arr = window.projectsData || [];
    const viewLabel = getNested(dict, "projects.viewWiki") || getNested(dict, "projects.details_media") || "View Wiki";

    arr.forEach((p) => {
      const title = getNested(dict, p.titleKey) || p.id;
      const short = getNested(dict, p.shortKey) || "";
      const tags = Array.isArray(p.tags) ? p.tags : [];

      const row = document.createElement("div");
      row.className = "project-row";

      row.innerHTML = `
        <div class="project-thumb">
          <img src="${p.thumb}" alt="${title}">
        </div>
        <div class="project-info">
          <h3>${title}</h3>
          <p>${short}</p>
          <div class="project-tags"></div>
          <button class="btn-wiki" type="button">
            <span>${viewLabel}</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `;

      const tagsEl = row.querySelector(".project-tags");
      if (tagsEl) {
        // limita pra não virar carnaval visual
        tags.slice(0, 6).forEach((t) => {
          const s = document.createElement("span");
          s.textContent = t;
          tagsEl.appendChild(s);
        });
      }

      const btn = row.querySelector(".btn-wiki");
      if (btn) btn.addEventListener("click", () => window.openWiki?.(p.id));

      list.appendChild(row);
    });
  };

  const sync = (dict) => {
    buildProjectData(dict);
    seedExperienceGalleries();
    renderList(dict);
  };

  return { sync };
})();

// =======================
// Experience galleries (timeline) -> window.galleryData
// =======================
const seedExperienceGalleries = () => {
  const isVideoLocal = (src = "") => /\.(mp4|webm|ogg)$/i.test(src);
  // galleryData é separado do projectData (que é só Projects)
  window.galleryData = window.galleryData || {};

  const inferKey = (arr) => {
    const joined = (arr || []).join(' ').toLowerCase();
    if (joined.includes('imagens/hpe_ti/') || joined.includes('imagens/hpe_ti\\') || joined.includes('imagens/hpe_ti')) return 'hpe_ti';
    if (joined.includes('imagens/hpe_logistica/')) return 'hpe_logistica';
    return null;
  };

  document.querySelectorAll('.timeline-content[data-images]').forEach((el) => {
    const raw = el.getAttribute('data-images');
    if (!raw) return;
    let arr;
    try { arr = JSON.parse(raw); } catch { return; }
    const key = inferKey(arr);
    if (!key) return;

    // Só cria se ainda não existir (permite override manual depois)
    if (!window.galleryData[key]) {
      window.galleryData[key] = {
        media: (arr || []).filter(Boolean).map((src) => ({ type: isVideoLocal(src) ? 'video' : 'image', src }))
      };
    }
  });
};


// =======================
// UI: menu + header auto-hide + scroll-to-top
// =======================
const UI = (() => {
  const qs = (s) => document.querySelector(s);

  const toggleMenu = () => {
    const menuIcon = qs("#menu-icon");
    const nav = qs("nav");
    if (!menuIcon || !nav) return;

    nav.classList.toggle("active");

    const icon = menuIcon.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-xmark");
    }
  };

  const closeMenu = () => {
    const menuIcon = qs("#menu-icon");
    const nav = qs("nav");
    if (nav) nav.classList.remove("active");

    const icon = menuIcon?.querySelector("i");
    if (icon) {
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-xmark");
    }
  };

  const bindMenu = () => {
    const menuIcon = qs("#menu-icon");
    if (menuIcon) menuIcon.addEventListener("click", toggleMenu);

    document.querySelectorAll("nav a[href^='#']").forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });
  };

  const bindHeaderAutoHide = () => {
    const header = qs("header");
    const scrollTopBtn = qs("#scrollTopBtn");
    if (!header) return;

    let last = 0;

    const onScroll = () => {
      if (document.body.classList.contains("wiki-open")) return;

      const y = window.scrollY || document.documentElement.scrollTop;

      if (y <= 0) {
        header.classList.remove("hidden");
        scrollTopBtn?.classList.remove("active");
        last = 0;
        return;
      }

      if (Math.abs(last - y) > 5) {
        if (y > last) {
          header.classList.add("hidden");
          closeMenu();
        } else {
          header.classList.remove("hidden");
        }
        last = y;
      }

      if (scrollTopBtn) {
        if (y > 300) scrollTopBtn.classList.add("active");
        else scrollTopBtn.classList.remove("active");
      }
    };
    window.addEventListener("scroll", onScroll);
  };

  const init = () => {
    bindMenu();
    bindHeaderAutoHide();
  };

  return { init };
})();

// =======================
// Lightbox (Experience gallery)
// =======================
const Lightbox = (() => {
  const lightbox = document.getElementById("lightbox");
  const container = document.getElementById("lightbox-media-container");

  let media = [];
  let idx = 0;

  const render = () => {
    const item = media[idx];
    if (!container) return;

    container.innerHTML = "";
    container.style.opacity = 0;

    setTimeout(() => {
      if (!item) return;

      if (item.type === "video") {
        const vid = document.createElement("video");
        vid.src = item.src;
        vid.controls = true;
        vid.autoplay = true;
        container.appendChild(vid);
      } else {
        const img = document.createElement("img");
        img.src = item.src;
        img.style.objectFit = "contain";
        container.appendChild(img);
      }

      container.style.opacity = 1;
    }, 100);
  };


  const setStatus = (url) => {
    if (!statusBox) return;
    statusBox.innerHTML = "";
    if (!url) return;

    const dict = window.__i18n || {};
    const t = (k, fb) =>
      k.split(".").reduce((acc, kk) => (acc && acc[kk] !== undefined ? acc[kk] : undefined), dict) ?? fb;

    const badge = document.createElement("div");
    badge.className = "status-badge";
    badge.innerHTML = `<span class="status-dot"></span><span class="status-text">${t("wiki.status.checking", "Checking...")}</span>`;
    statusBox.appendChild(badge);

    const markOnline = () => {
      badge.classList.remove("offline");
      badge.classList.add("online");
      const t = badge.querySelector(".status-text");
      if (t) t.textContent = (window.__i18n ? (window.__i18n.wiki?.status?.online || "System Online") : "System Online");
    };

    const markOffline = () => {
      badge.classList.remove("online");
      badge.classList.add("offline");
      const t = badge.querySelector(".status-text");
      if (t) t.textContent = (window.__i18n ? (window.__i18n.wiki?.status?.offline || "System Offline") : "System Offline");
    };

    const checkUrl = url.replace(/\/$/, "") + "/?t=" + Date.now();

    // 1) tenta fetch (melhor quando CORS permite)
    fetch(checkUrl, { method: "GET", cache: "no-store" })
      .then((res) => {
        if (res && res.ok) markOnline();
        else throw new Error("not ok");
      })
      .catch(() => {
        // 2) fallback: ping via <img> (não depende de CORS)
        const img = new Image();
        img.onload = markOnline;
        img.onerror = markOffline;
        img.src = checkUrl;
      });
  };
  const open = (id) => {
    let data = (typeof projectData !== 'undefined' && projectData[id]) || (window.galleryData && window.galleryData[id]);

    // Fallback robusto: se não tiver registry, tenta montar a galeria direto do DOM (Experiences)
    if (!data) {
      const isVideoLocal = (src = "") => /\.(mp4|webm|ogg)$/i.test(src);
      const needle = String(id || "").toLowerCase();

      // 1) tenta achar bloco de timeline que contenha o id no data-project
      const byProject = document.querySelector(`.timeline-content[data-project="${id}"][data-images]`);
      let arr = null;

      if (byProject) {
        try { arr = JSON.parse(byProject.getAttribute("data-images") || "[]"); } catch { arr = null; }
      }

      // 2) se não achou, tenta achar pelo caminho das imagens (ex: hpe_ti / hpe_logistica)
      if (!arr) {
        document.querySelectorAll(".timeline-content[data-images]").forEach((el) => {
          if (arr) return;
          const raw = el.getAttribute("data-images");
          if (!raw) return;
          try {
            const a = JSON.parse(raw);
            const joined = (a || []).join(" ").toLowerCase();
            if (joined.includes(needle)) arr = a;
          } catch {}
        });
      }

      if (arr && arr.length) {
        data = { media: (arr || []).filter(Boolean).map((src) => ({ type: isVideoLocal(src) ? "video" : "image", src })) };
        // cache opcional
        window.galleryData = window.galleryData || {};
        window.galleryData[id] = data;
      }
    }

    if (!data) {
      console.error('Dados da galeria não encontrados para:', id);
      return;
    }

    if (!data.media || data.media.length === 0) {
      alert("No media available for this item.");
      return;
    }

    media = data.media;
    idx = 0;

    render();
    lightbox?.classList.add("active");
    document.body.classList.add("no-scroll");
  };

  const close = () => {
    lightbox?.classList.remove("active");
    if (container) container.innerHTML = "";
    document.body.style.overflow = "auto";
  };

  const move = (dir) => {
    if (!media.length) return;
    idx = (idx + dir + media.length) % media.length;
    render();
  };

  window.openGallery = open;
  window.closeLightbox = close;
  window.changeLightboxSlide = move;

  return { close };
})();

// =======================
// Wiki (Projects details)
// =======================
const Wiki = (() => {
  const section = document.getElementById("wiki-section");
  const title = document.getElementById("wiki-title");
  const desc = document.getElementById("wiki-desc");
  const techs = document.getElementById("wiki-techs");
  const links = document.getElementById("wiki-links");
  const display = document.getElementById("wiki-media-display");
  const statusBox = document.getElementById("wiki-status-container");

  let media = [];
  let idx = 0;
  let currentId = null;

  const render = () => {
    if (!display) return;
    display.innerHTML = "";

    if (!media.length) {
      display.innerHTML = '<p class="wiki-empty">No media</p>';
      return;
    }

    const item = media[idx];

    if (item.type === "video") {
      const vid = document.createElement("video");
      vid.className = "wiki-media";
      vid.src = item.src;
      vid.controls = true;
      vid.preload = "metadata";
      display.appendChild(vid);
    } else {
      const img = document.createElement("img");
      img.className = "wiki-media";
      img.src = item.src;
      img.alt = "Project media";
      img.loading = "lazy";
      // abre no lightbox se existir
      img.addEventListener("click", () => window.Lightbox?.open?.(item.src, "image"));
      display.appendChild(img);
    }
  };


  const setStatus = (url) => {
    if (!statusBox) return;
    statusBox.innerHTML = "";
    if (!url) return;

    const badge = document.createElement("div");
    badge.className = "status-badge";
    badge.innerHTML = '<span class="status-dot"></span><span class="status-text">Checking...</span>';
    statusBox.appendChild(badge);

    const markOnline = () => {
      badge.classList.remove("offline");
      badge.classList.add("online");
      const t = badge.querySelector(".status-text");
      if (t) t.textContent = "System Online";
    };

    const markOffline = () => {
      badge.classList.remove("online");
      badge.classList.add("offline");
      const t = badge.querySelector(".status-text");
      if (t) t.textContent = "System Offline";
    };

    const base = url.replace(/\/$/, "");
    const checkUrl = base + "/?t=" + Date.now();

    // 1) tenta fetch (melhor quando CORS permite)
    fetch(checkUrl, { method: "GET", cache: "no-store" })
      .then((res) => {
        if (res && res.ok) markOnline();
        else throw new Error("not ok");
      })
      .catch(() => {
        // 2) fallback: ping via <img> (não depende de CORS)
        const img = new Image();
        img.onload = markOnline;
        img.onerror = markOffline;
        img.src = checkUrl;
      });
  };

  const open = (id, opts = {}) => {
    if (typeof projectData === "undefined" || !projectData[id]) return;
    if (scrollTopBtn) {
      scrollTopBtn.classList.remove("active");
      scrollTopBtn.classList.add("hidden");
    }
    const data = projectData[id];

    currentId = id;

    if (title) title.innerText = data.title || "";
    if (desc) desc.innerText = data.description || "";
    setStatus(data.statusCheckUrl);

    if (techs) {
      techs.innerHTML = "";
      (data.techs || []).forEach((t) => (techs.innerHTML += `<li>${t}</li>`));
    }

    if (links) {
      links.innerHTML = "";
      (data.links || []).forEach((l) => {
        const a = document.createElement("a");
        a.href = l.url;
        a.className = "btn";
        if (l.download) {
          a.setAttribute("download", "");
          a.innerText = l.text;
        } else {
          a.target = "_blank";
          a.rel = "noopener";
          a.innerText = l.text;
        }
        links.appendChild(a);
      });
    }

    media = data.media || [];
    idx = 0;
    render();

    // mantém aberto caso já esteja (troca idioma sem fechar)
    document.getElementById("projects")?.classList.add("hidden");
    section?.classList.remove("hidden");

    document.body.classList.add("wiki-open");
    document.querySelector("header")?.classList.remove("hidden");

    // Se for abertura "normal" (botão View Wiki), atualiza o hash.
    // Se for roteamento/refresh/idioma, evita bagunçar histórico.
    if (!opts.silent) {
      history.pushState(null, "", `#project=${encodeURIComponent(id)}`);
    }

    // Só joga pro topo quando a intenção é abrir/entrar na wiki.
    if (!opts.keepOpen) {
      window.scrollTo(0, 0);
    }
  };

  const close = (opts = {}) => {
    section?.classList.add("hidden");
    if (scrollTopBtn) scrollTopBtn.classList.remove("hidden");
    window.dispatchEvent(new Event("scroll"));

    // primeiro mostra projects de novo
    const projects = document.getElementById("projects");
    projects?.classList.remove("hidden");
    document.body.classList.remove("wiki-open");
    document.body.style.overflow = "auto";

    // atualiza URL + scroll só quando o usuário clicou em "Voltar para Projetos"
    if (!opts.silent) {
      history.pushState(null, "", "#projects");
      projects?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (display) display.innerHTML = "";
  };

  const refresh = () => {
    if (!currentId) return;
    // reusa open, mas sem mexer no histórico e sem dar scroll pro topo
    open(currentId, { silent: true, keepOpen: true });
  };

  const move = (dir) => {
    if (!media.length) return;
    idx = (idx + dir + media.length) % media.length;
    render();
  };

  window.openWiki = open;
  window.closeWiki = close;
  window.moveWikiSlide = move;

  return { close, refresh };
})();

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  Lightbox.close();
  Wiki.close();
});


// =======================
// ScrollSpy (menu destaca seção atual + clique marca ativo)
// =======================
const ScrollSpy = (() => {
  const navLinks = () => Array.from(document.querySelectorAll("header nav a[href^='#']"));
  const sections = () => Array.from(document.querySelectorAll("section[id]"));

  const setActive = (id) => {
    navLinks().forEach(a => a.classList.remove("active"));
    const link = document.querySelector(`header nav a[href="#${CSS.escape(id)}"]`);
    if (link) link.classList.add("active");
  };

  const bindClicks = () => {
    navLinks().forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#")) return;

        const id = href.slice(1);
        const el = document.getElementById(id);
        if (!el) return;

        // se a wiki estiver aberta, fecha antes de navegar
        if (document.body.classList.contains("wiki-open")) {
          window.closeWiki?.({ silent: true });
        }

        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });

        // marca ativo na hora
        setActive(id);
        history.pushState(null, "", `#${id}`);
        // pushState não dispara hashchange, então chama o router manualmente
        window.Router?.handle?.();
      });
    });
  };

  const bindObserver = () => {
    const header = document.querySelector("header");
    const headerOffset = (header?.offsetHeight || 80) + 500;

    const onScroll = () => {
      if (window.scrollY < 50) {
        setActive("home");
        return;
      }

      const scrollPos = window.scrollY + headerOffset;

      let currentId = null;

      sections().forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;

        if (scrollPos >= top && scrollPos < top + height) {
          currentId = sec.id;
        }
      });

      if (currentId) setActive(currentId);
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // executa uma vez ao carregar
  };

  const init = () => {
    bindClicks();
    bindObserver();

    // inicializa em refresh com hash ou primeira section
    const hash = (location.hash || "").replace("#", "");
    if (hash && document.getElementById(hash)) setActive(hash);
    else {
      const first = sections()[0];
      if (first) setActive(first.id);
    }
  };

  return { init };
})();


// =======================
// Router (hash): resolve #home/#about/... and #project=<id>
// - Corrige bug do header não navegar quando a Wiki está aberta
// - Também garante que refresh com #project= abre a Wiki
// =======================
const Router = (() => {
  const parse = () => {
    const h = location.hash || "";
    const m = h.match(/^#project=([^&]+)/);
    if (m) return { type: "project", id: decodeURIComponent(m[1]) };

    const sec = h.replace(/^#/, "");
    if (sec) return { type: "section", id: sec };
    return { type: "section", id: "home" };
  };

  const goSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    // fecha a wiki sem mexer no histórico
    if (document.body.classList.contains("wiki-open")) {
      window.closeWiki?.({ silent: true });
    }

    // scroll pro alvo
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goProject = (id) => {
    if (!id) return;
    window.openWiki?.(id, { silent: true });
  };

  const handle = () => {
    const r = parse();
    if (r.type === "project") goProject(r.id);
    else goSection(r.id);
  };

  const init = () => {
    // expõe para callbacks criados antes do Router existir (ex: ScrollSpy)
    window.Router = { handle };

    window.addEventListener("hashchange", handle);

    // logo (não passa pelo ScrollSpy)
    const logo = document.querySelector("header .logo");
    if (logo) {
      logo.addEventListener("click", (e) => {
        const href = logo.getAttribute("href") || "#home";
        if (!href.startsWith("#")) return;
        e.preventDefault();
        history.pushState(null, "", href);
        handle();
      });
    }
  };

  return { init, handle };
})();


document.addEventListener("DOMContentLoaded", async () => {
  UI.init();
  Lang.bindButtons();

  const initial = Lang.detectInitial();
  await Lang.set(initial);

  // ✅ ativa o menu que acompanha o scroll
  ScrollSpy.init();

  // ✅ resolve hash atual (inclui #project=...)
  Router.init();
  Router.handle();
});