export default {
  base: '/NauczSieOpenGL/',
  title: "Naucz Się OpenGL",
  description: "Poradnik do OpenGL 4.6 dla programujących w Javie",
  themeConfig: {
    sidebar: [
      {
        text: "Instalacja i konfiguracja",
        items: [
          {text: "Czym jest OpenGL i LWJGL", link: "/opengl-lwjgl"},
          {text: "Konfiguracja projektu", link: "/projekt-konfiguracja"}
        ],
      },

      {
        text: "Podstawy nowoczesnego OpenGL",
        items: [
          {text: "Okno programu - GLFW", link: "/okno-programu"},
          {text: "Podstawowe bufory w OpenGL", link: "/podstawowe-bufory"},
          {text: "Podstawowe shadery w OpenGL", link: "/podstawowe-shadery"},
          {text: "Uporządkowanie kodu w projekcie", link: "/czysty-kod"},
          {text: "Podstawy tekstur w OpenGL", link: "/podstawowe-tekstury"}
        ]
      }
    ]
  }
}
