// URLs dos dashboards do Looker Studio (Data Studio) por página.
// Para atualizar uma URL, edite aqui — afeta o site todo automaticamente.
// O sufixo "?params=...&navigation=hidden" esconde a barra de navegação
// do Looker Studio em cada iframe.

const SUFIXO = '?params=%7B%22df1%22:%22%22%7D&navigation=hidden'

export const DASHBOARDS = {
  home: {
    social:    'https://datastudio.google.com/embed/reporting/0c019ae6-7fb4-4839-8cec-9a3d086c5600/page/oeAvF' + SUFIXO,
    urbanismo: 'https://datastudio.google.com/embed/reporting/dc12a9ee-52fd-4508-9912-d77e20820e82/page/Wa7xF' + SUFIXO,
  },
  ppg: {
    social:    'https://datastudio.google.com/embed/reporting/ed3513a7-f05c-431c-a428-64b2b4bedae1/page/oeAvF' + SUFIXO,
    urbanismo: 'https://datastudio.google.com/embed/reporting/ac2427b6-d3fa-4b22-82e2-961bd1c180ce/page/Wa7xF' + SUFIXO,
  },
  manguinhos: {
    social:    'https://datastudio.google.com/embed/reporting/da50053b-1b3f-43aa-89cf-360e28d5253f/page/oeAvF' + SUFIXO,
    urbanismo: 'https://datastudio.google.com/embed/reporting/e6ece5f1-af69-4981-9f9a-4b9a4ba759b3/page/Wa7xF' + SUFIXO,
  },
  cinturao: {
    social:    'https://datastudio.google.com/embed/reporting/3cb26321-16eb-4276-9788-d13fd48c55ca/page/oeAvF' + SUFIXO,
    urbanismo: 'https://datastudio.google.com/embed/reporting/1ad720d7-5ce9-4df8-b9ef-15749ecbd5a5/page/Wa7xF' + SUFIXO,
  },
  outros: {
    urbanismo: 'https://datastudio.google.com/embed/reporting/7e1fdf9d-1cb4-414d-9749-8e401b4e7a99/page/Wa7xF' + SUFIXO,
  },
  captacao: {
    captacaoRecursos: 'https://datastudio.google.com/embed/reporting/8066d558-1d0c-47b4-a753-1785850a7ecd/page/Lv0yF',
  },
} as const

export type DashboardUrls = {
  social?: string
  urbanismo?: string
}
