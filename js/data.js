/* js/data.js
 * Portfolio data source (projects + wiki metadata)
 * Keep this file as "content only" (no DOM logic).
 */

window.projectsData = [
  {
    id: "iot-dashboard",
    titleKey: "projects.items.iot.title",
    shortKey: "projects.items.iot.short",
    tags: ["C++", "WebSockets", "JavaScript", "ESP", "IoT"],
    thumb: "imagens/Projetos/iot_project_1/img_1.png",
    wiki: {
      titleKey: "wiki.items.iot.title",
      descKey: "wiki.items.iot.desc",
      techsKey: "wiki.items.iot.techs",
      highlightsKey: "wiki.items.iot.highlights",
      statusCheckUrl: "https://app.gustavos.cloud",
      images: [
        "imagens/Projetos/iot_project_1/video_1.gif",
        "imagens/Projetos/iot_project_1/video_2.gif",
        "imagens/Projetos/iot_project_1/img_1.png"
      ],
      links: [
        { textKey: "wiki.common.github", url: "https://github.com/GustavoBorges13/iot_projeto_1" },
        { textKey: "wiki.common.demo", url: "https://app.gustavos.cloud/" }
      ]
    }
  },

  {
    id: "minecraft_server",
    titleKey: "projects.items.mc.title",
    shortKey: "projects.items.mc.short",
    tags: ["Python", "Oracle Cloud", "Linux", "Cloudflared"],
    thumb: "imagens/Projetos/minecraft_server/tela_inicial.png",
    wiki: {
      titleKey: "wiki.items.mc.title",
      descKey: "wiki.items.mc.desc",
      techsKey: "wiki.items.mc.techs",
      highlightsKey: "wiki.items.mc.highlights",
      images: [
        "imagens/Projetos/minecraft_server/login.png",
        "imagens/Projetos/minecraft_server/tela_inicial.png",
        "imagens/Projetos/minecraft_server/tela_arquivos.png"
      ],
      links: [
        { textKey: "wiki.common.github", url: "https://github.com/GustavoBorges13" }
      ]
    }
  },

  {
    id: "ihc_boostrap",
    titleKey: "projects.items.ihc.title",
    shortKey: "projects.items.ihc.short",
    tags: ["HTML", "CSS", "JavaScript", "HCI"],
    thumb: "imagens/Projetos/ihc_boostrap/thumb.png",
    wiki: {
      titleKey: "wiki.items.ihc.title",
      descKey: "wiki.items.ihc.desc",
      techsKey: "wiki.items.ihc.techs",
      highlightsKey: "wiki.items.ihc.highlights",
      images: [
        "imagens/Projetos/ihc_boostrap/thumb.png"
      ],
      links: [
        { textKey: "wiki.common.github", url: "https://github.com/GustavoBorges13/Projeto-ihc-boostrap-" },
        { textKey: "wiki.common.preview", url: "https://gustavoborges13.github.io/Projeto-ihc-boostrap-/" }
      ],
      statusCheckUrl: "https://gustavoborges13.github.io/Projeto-ihc-boostrap-/"
    }
  },

  {
    id: "logicban",
    titleKey: "projects.items.logicban.title",
    shortKey: "projects.items.logicban.short",
    tags: ["Java", "Game Dev", "Graphics2D", "Puzzle"],
    thumb: "imagens/Projetos/logicban/thumb.png",
    wiki: {
      titleKey: "wiki.items.logicban.title",
      descKey: "wiki.items.logicban.desc",
      techsKey: "wiki.items.logicban.techs",
      highlightsKey: "wiki.items.logicban.highlights",
      images: [
        "imagens/Projetos/logicban/inicio.gif",
        "imagens/Projetos/logicban/fase1.gif",
        "imagens/Projetos/logicban/fase2.gif",
        "imagens/Projetos/logicban/fase3.gif",
        "imagens/Projetos/logicban/fase4.gif"
      ],
      links: [
        { textKey: "wiki.common.github", url: "https://github.com/GustavoBorges13/LogicBan" },
        { textKey: "wiki.common.release", url: "https://github.com/GustavoBorges13/LogicBan/releases/tag/v2.2.1" }
      ]
    }
  },

  {
    id: "ti_automation",
    titleKey: "projects.items.ti.title",
    shortKey: "projects.items.ti.short",
    tags: ["Java", "Automation", "Word/PDF", "Excel"],
    thumb: "imagens/hpe_ti/img_1.png",
    wiki: {
      titleKey: "wiki.items.ti.title",
      descKey: "wiki.items.ti.desc",
      techsKey: "wiki.items.ti.techs",
      highlightsKey: "wiki.items.ti.highlights",
      images: [
        "imagens/hpe_ti/img_1.png",
        "imagens/hpe_ti/img_2.png",
        "imagens/hpe_ti/img_3.png",
        "imagens/hpe_ti/img_4.png"
      ],
      links: [
        { textKey: "wiki.common.github", url: "https://github.com/GustavoBorges13/Conversor_XLSX-PDF" },
        { textKey: "wiki.common.report", url: "arquivos/hpe_ti/relatorio_projeto.pdf", download: true }
      ]
    }
  }
];