# Okno programu - GLFW

**GLFW** to biblioteka która zastępuje przestarzałe i trudne w obsłudze
okienkowe API Javy czyli *AWT* oraz trochę nowsze *Swing*.
GLFW jest dostarczane w bibliotece LWJGL która zawiera też powiązania
z **OpenGL**, **OpenCL**, **OpenAL** i innymi.

# Tworzenie klasy okna

Klasa okna jest podstawową klasą która zawiera uchwyt do okna GLFW,
potrafi je zainicjować oraz zarządzać nim. Służy też do integracji z
portami wejściowymi takimi jak klawiatura, mysz oraz ekran.

Klasa okna powinna zawierać pole klasy typu `long` oraz metodę
inicjalizacyjną co mogłoby wyglądać tak:

```java

package com.nauczsieopengl;

public class Window {
    public long window;

    public void init() {

    }
}
```

Potem warto dopisać do metody `init()` funkcje inicjalizującą
o nazwie, `glfwInit()` ale dla bezpieczeństwa sprawdzić warunkiem,
czy aby napewno inicjalizacja przeszła poprawnie:

```java
package com.nauczsieopengl;

import static org.lwjgl.glfw.GLFW.*;

public class Window {
    public long window;

    public void init() {
        if(!glfwInit()) {
            throw new IllegalStateException("GLFW nie zostało inicjowane poprawnie!");
        }
    }
}
```

Jak już zainicjujesz *GLFW* to trzeba dać mu wskazówki odnośnie okna i kontekstu *OpenGL*.
Używa się do tego hintów czyli wskazówek, a ich przykładowa implementacja wygląda tak:

```java
package com.nauczsieopengl;

import static org.lwjgl.glfw.GLFW.*;

public class Window {
    public long window;

    public void init() {
        if(!glfwInit()) {
            throw new IllegalStateException("GLFW nie zostało inicjowane poprawnie!");
        }

        //Okno nie będzie widoczne podczas jego przygotowywania
        glfwWindowHint(GLFW_VISIBLE, GLFW_FALSE);

        //Okno będzie można rozszerzać na ekranie
        glfwWindowHint(GLFW_RESIZABLE, GLFW_TRUE);

        //Wskazujemy na wersje OpenGL np. 4.6 lub 3.3
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);

        //Wkazujemy że używamy profilu głównego - bez starych funkcji np. glBegin();
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

        //Dodaj jeśli chcesz kompatypilności z starszym sprzętem Apple
        glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GLFW_TRUE);

    }
}
```

Czas faktycznie stworzyć to okno a nie pisać tyle o niczym robi się to przez
funkcję `glfwCreateWindow()` gdzie, pierwszym i drugim argumentem są wymiary ekranu.
Trzecim argumentem jest tytuł okna który będzie się wyświetlać w oknie.
ostatnie 2 argumenty domyślnie ustawia się na 0. Ale 4 argumentem jest
tryb pełnoekranowy - 1 to pełny ekran a 0 to okno.
Po stworzeniu okna trzeba sprawdzić czy nie jest równe 0L czyli pusty wskaźnik do okna.
Implementacja wygląda tak:

```java
package com.nauczsieopengl;

import static org.lwjgl.glfw.GLFW.*;

public class Window {
    public long window;
    public int width = 800;
    public int height = 600;
    public String title = "NauczSieOpenGL";

    public void init() {
        if(!glfwInit()) {
            throw new IllegalStateException("GLFW nie zostało inicjowane poprawnie!");
        }

        glfwWindowHint(GLFW_VISIBLE, GLFW_FALSE);
        glfwWindowHint(GLFW_RESIZABLE, GLFW_TRUE);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
        glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GLFW_TRUE);

        window = glfwCreateWindow(width, height, title, 0L, 0L);

        if(window == 0L) {
            throw new RuntimeException("Okno jest równe null!");
        }
    }
}
```

# Wyśrodkowanie okna

Żeby wyśrodkować okno najlepiej użyć mechanizmu try-with-resources oraz funkcji z *MemoryStack*.
Implementacja wygląda właśnie tak:

```java
package com.nauczsieopengl;

import static org.lwjgl.glfw.GLFW.*;
import org.lwjgl.system.MemoryStack;
import org.lwjgl.glfw.GLFWVidMode;
import java.nio.IntBuffer;

public class Window {
    public long window;
    public int width = 800;
    public int height = 600;
    public String title = "NauczSieOpenGL";

    public void init() {
        if(!glfwInit()) {
            throw new IllegalStateException("GLFW nie zostało inicjowane poprawnie!");
        }

        glfwWindowHint(GLFW_VISIBLE, GLFW_FALSE);
        glfwWindowHint(GLFW_RESIZABLE, GLFW_TRUE);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
        glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GLFW_TRUE);

        window = glfwCreateWindow(width, height, title, 0L, 0L);

        if(window == 0L) {
            throw new RuntimeException("Okno jest równe 0L!");
        }

        try(MemoryStack stack = MemoryStack.stackPush()) {
            //Alokujemy bufory rozmiaru okna w pamięci natywnej
            IntBuffer widthB = stack.mallocInt(1);
            IntBuffer heightB = stack.mallocInt(1);

            //Za pomocą VideoMode można pozyskać rozmiar monitora
            GLFWVidMode vidMode = glfwGetVideoMode(glfwGetPrimaryMonitor());

            //Pobieramy rozmiar stworzonego okna
            glfwGetWindowSize(window, widthB, heightB);

            //Obliczamy odległość okna od granicy monitora (szerokośćMonitora - szerokośćOkna) / 2
            glfwSetWindowPos(window, (vidMode.width() - widthB.get()) / 2, (vidMode.height() - heightB.get()) / 2);
        }
    }
}
```

# Inicjalizacja kontekstu OpenGL

Czas na najważniejszy moment tworzenia programu z użyciem **OpenGL** czyli inicjalizację
kontekstu *OpenGL* - jest potrzebny do używania funkcji zaczynających się od gl... .
Potrzeba najpierw połączyć okno z kontekstem *OpenGL* za pomocą funkcji `glfwMakeContextCurrent()`.

z podaniem okna. Potem użyć funkcji `createCapabilities()` która faktycznie włącza ten
kontekst OpenGL:

```java
package com.nauczsieopengl;

import static org.lwjgl.glfw.GLFW.*;
import static org.lwjgl.opengl.GL.*;
import org.lwjgl.system.MemoryStack;
import org.lwjgl.glfw.GLFWVidMode;
import java.nio.IntBuffer;

public class Window {
    public long window;
    public int width = 800;
    public int height = 600;
    public String title = "NauczSieOpenGL";

    public void init() {
        if(!glfwInit()) {
            throw new IllegalStateException("GLFW nie zostało inicjowane poprawnie!");
        }

        glfwWindowHint(GLFW_VISIBLE, GLFW_FALSE);
        glfwWindowHint(GLFW_RESIZABLE, GLFW_TRUE);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
        glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GLFW_TRUE);

        window = glfwCreateWindow(width, height, title, 0L, 0L);

        if(window == 0L) {
            throw new RuntimeException("Okno jest równe 0L!");
        }

        try(MemoryStack stack = MemoryStack.stackPush()) {
            IntBuffer widthB = stack.mallocInt(1);
            IntBuffer heightB = stack.mallocInt(1);

            GLFWVidMode vidMode = glfwGetVideoMode(glfwGetPrimaryMonitor());

            glfwGetWindowSize(window, widthB, heightB);

            glfwSetWindowPos(window, (vidMode.width() - widthB.get()) / 2, (vidMode.height() - heightB.get()) / 2);
        }

        glfwMakeContextCurrent(window);

        createCapabilities();
    }
}
```

# Callbacki i Viewport

Callbacki to reakcje z klawiatury, myszki lub okna.
Dotyczące interakcji użytkownika ze sprzętem lub systemem operacyjnym.
Najlepiej na początku ustawić tylko 2: dotyczący
zmiany rozmiaru ramki okna oraz klawiatury.
Ten pierwszy uruchamia się gdy zmieni się rozmiar okna i ustawia
viewport, czyli centrowanie zawartości okna do rozmiarów okna. 

A drugi callback sprawdza czy klawisz escape został naciśnięty,
jeśli tak to wyłącza okno. Oczywiście można dodać to samo dla innych
klawiszy, albo tworzyć kombinacje klawiszy.

Oczywiście przedtem ustawiamy wstępne centrowanie ekranu, jakby
ktoś postanowił nie zmieniać rozmiaru okna.
Poniżej jest przykładowa implementacja:

```java
package com.nauczsieopengl;

import static org.lwjgl.opengl.GL11.*;
import static org.lwjgl.glfw.GLFW.*;
import static org.lwjgl.opengl.GL.*;
import org.lwjgl.system.MemoryStack;
import org.lwjgl.glfw.GLFWVidMode;
import java.nio.IntBuffer;

public class Window {
    public long window;
    public int width = 800;
    public int height = 600;
    public String title = "NauczSieOpenGL";

    public void init() {
        if(!glfwInit()) {
            throw new IllegalStateException("GLFW nie zostało inicjowane poprawnie!");
        }

        glfwWindowHint(GLFW_VISIBLE, GLFW_FALSE);
        glfwWindowHint(GLFW_RESIZABLE, GLFW_TRUE);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
        glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GLFW_TRUE);

        window = glfwCreateWindow(width, height, title, 0L, 0L);

        if(window == 0L) {
            throw new RuntimeException("Okno jest równe 0L!");
        }

        try(MemoryStack stack = MemoryStack.stackPush()) {
            IntBuffer widthB = stack.mallocInt(1);
            IntBuffer heightB = stack.mallocInt(1);

            GLFWVidMode vidMode = glfwGetVideoMode(glfwGetPrimaryMonitor());

            glfwGetWindowSize(window, widthB, heightB);

            glfwSetWindowPos(window, (vidMode.width() - widthB.get()) / 2, (vidMode.height() - heightB.get()) / 2);
        }

        glfwMakeContextCurrent(window);

        createCapabilities();

        glViewport(0, 0, width, height);

        glfwSetFramebufferSizeCallback(window, (win, x, y) -> {
            this.width = x;
            this.height = y;
            glViewport(0, 0, x, y);
        });

        glfwSetKeyCallback(window, (win, key, scancode, action, mods) -> {
            //Jeśli wyłącza ci 2 okna przy wyłączeniu to zmień na GLFW_RELEASE
            if(key == GLFW_KEY_ESCAPE && action == GLFW_PRESS) {
                glfwSetWindowShouldClose(window, true);
            }
        });
    }
}
```

# Pokazanie okna i VSync

Czas wkońcu pokazać to dzieło jakim jest twoje okno bo trochę
to trwa, prawda? Do tego służy funkcja `glfwShowWindow()` żeby
je pokazać.

Pewnie znasz funkcje VSync z gier bo jest bardzo potrzebna, ponieważ
pozwala na to żeby karta graficzna przy ogromnych światach nie stopiła
się z ciepła tworząc klatki których i tak nie zobaczysz.
Bo jak np. masz monitor który odświeża swój obraz 60 razy na sekundę,
to po co generować 500 FPS - to marnotrawstwo - zastanów się?

Do tego żeby karta się nie męczyła służy funkcja `glfwSwapInterval()` która,
synchronizuje ilość FPS z odświeżaniem monitora.

Implementacja tego wygląda tak:


```java
package com.nauczsieopengl;

import static org.lwjgl.opengl.GL11.*;
import static org.lwjgl.glfw.GLFW.*;
import static org.lwjgl.opengl.GL.*;
import org.lwjgl.system.MemoryStack;
import org.lwjgl.glfw.GLFWVidMode;
import java.nio.IntBuffer;

public class Window {
    public long window;
    public int width = 800;
    public int height = 600;
    public String title = "NauczSieOpenGL";

    public void init() {
        if(!glfwInit()) {
            throw new IllegalStateException("GLFW nie zostało inicjowane poprawnie!");
        }

        glfwWindowHint(GLFW_VISIBLE, GLFW_FALSE);
        glfwWindowHint(GLFW_RESIZABLE, GLFW_TRUE);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
        glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GLFW_TRUE);

        window = glfwCreateWindow(width, height, title, 0L, 0L);

        if(window == 0L) {
            throw new RuntimeException("Okno jest równe 0L!");
        }

        try(MemoryStack stack = MemoryStack.stackPush()) {
            IntBuffer widthB = stack.mallocInt(1);
            IntBuffer heightB = stack.mallocInt(1);

            GLFWVidMode vidMode = glfwGetVideoMode(glfwGetPrimaryMonitor());

            glfwGetWindowSize(window, widthB, heightB);

            glfwSetWindowPos(window, (vidMode.width() - widthB.get()) / 2, (vidMode.height() - heightB.get()) / 2);
        }

        glfwMakeContextCurrent(window);

        createCapabilities();

        glViewport(0, 0, width, height);

        glfwSetFramebufferSizeCallback(window, (win, x, y) -> {
            this.width = x;
            this.height = y;
            glViewport(0, 0, x, y);
        });

        glfwSetKeyCallback(window, (win, key, scancode, action, mods) -> {
            if(key == GLFW_KEY_ESCAPE && action == GLFW_PRESS) {
                glfwSetWindowShouldClose(window, true);
            }
        });

        glfwShowWindow(window);

        //liczba 1 to włączony VSync a 0 to wyłączony
        glfwSwapInterval(1);
    }
}
```

# Czyszczenie danych po oknie

Jak już okno jest stworzone to można je wyczyścić po użyciu i wyłączyć GLFW.
Użyjemy do tego metody `glfwDestroyWindow()` która usuwa obiekt okna z pamięci
oraz metody `glfwTerminate()` która wyłącza do końca GLFW - odwrotność `glfwInit()`.

Dodać też warto 2 metody czyli `cleanup()` dokonującą tego czyszczenia oraz `run()`
która, scala inne metody w jedną. Przykład kodu poniżej:

```java
package com.nauczsieopengl;

import static org.lwjgl.opengl.GL11.*;
import static org.lwjgl.glfw.GLFW.*;
import static org.lwjgl.opengl.GL.*;
import org.lwjgl.system.MemoryStack;
import org.lwjgl.glfw.GLFWVidMode;
import java.nio.IntBuffer;

public class Window {
    public long window;
    public int width = 800;
    public int height = 600;
    public String title = "NauczSieOpenGL";

    public void init() {
        if(!glfwInit()) {
            throw new IllegalStateException("GLFW nie zostało inicjowane poprawnie!");
        }

        glfwWindowHint(GLFW_VISIBLE, GLFW_FALSE);
        glfwWindowHint(GLFW_RESIZABLE, GLFW_TRUE);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 6);
        glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
        glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GLFW_TRUE);

        window = glfwCreateWindow(width, height, title, 0L, 0L);

        if(window == 0L) {
            throw new RuntimeException("Okno jest równe 0L!");
        }

        try(MemoryStack stack = MemoryStack.stackPush()) {
            IntBuffer widthB = stack.mallocInt(1);
            IntBuffer heightB = stack.mallocInt(1);

            GLFWVidMode vidMode = glfwGetVideoMode(glfwGetPrimaryMonitor());

            glfwGetWindowSize(window, widthB, heightB);

            glfwSetWindowPos(window, (vidMode.width() - widthB.get()) / 2, (vidMode.height() - heightB.get()) / 2);
        }

        glfwMakeContextCurrent(window);

        createCapabilities();

        glViewport(0, 0, width, height);

        glfwSetFramebufferSizeCallback(window, (win, x, y) -> {
            this.width = x;
            this.height = y;
            glViewport(0, 0, x, y);
        });

        glfwSetKeyCallback(window, (win, key, scancode, action, mods) -> {
            if(key == GLFW_KEY_ESCAPE && action == GLFW_PRESS) {
                glfwSetWindowShouldClose(window, true);
            }
        });

        glfwShowWindow(window);
        glfwSwapInterval(1);
    }

    public void cleanup() {
        glfwDestroyWindow(window);
        glfwTerminate();
    }

    public void run() {
        init();
        cleanup();
    }
}
```

A to kod klasy głównej:

```java
package com.nauczsieopengl;

public class Main {
    public static void main(String[] args) {
        Window window = new Window();
        window.run();
    }
}
```


# Pętla renderowania

Skoro mamy już okno to problemem jest to, że znika po sekundzie bezpowrotnie.
Więc napiszemy pętle renderowania która utrzyma okno dopóki go nie wyłączysz.