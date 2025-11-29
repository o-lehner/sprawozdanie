# Time Tracker PWA - Instrukcja Instalacji

## Wymagania
- Node.js (wersja 18 lub nowsza) - pobierz z https://nodejs.org/
- npm (instaluje się automatycznie z Node.js)

## Instalacja

### 1. Rozpakuj archiwum
Kliknij prawym przyciskiem na `time-tracker-pwa.zip` → **Wyodrębnij wszystko** (lub użyj 7-Zip/WinRAR)

### 2. Otwórz terminal w folderze projektu

**Opcja A - Eksplorator Windows:**
- Otwórz folder `time-tracker-pwa`
- Kliknij w pasek adresu na górze
- Wpisz `cmd` i naciśnij Enter

**Opcja B - PowerShell:**
- Naciśnij `Win + X` → wybierz **Terminal** lub **PowerShell**
- Wykonaj:
```powershell
cd C:\ścieżka\do\folderu\time-tracker-pwa
```

### 3. Zainstaluj zależności
```bash
npm install
```
*(To może potrwać 1-3 minuty)*

### 4. Uruchom aplikację
```bash
npm run dev
```

### 5. Otwórz w przeglądarce
Po uruchomieniu zobaczysz komunikat:
```
VITE v7.2.4  ready in 681 ms
➜  Local:   http://localhost:5173/
```

Otwórz przeglądarkę i wejdź na: **http://localhost:5173/**

## Zatrzymanie aplikacji
W terminalu naciśnij: **Ctrl + C**

## Rozwiązywanie problemów (Windows)

### Problem: "npm nie jest rozpoznawany jako polecenie"
**Rozwiązanie:** Zainstaluj Node.js z https://nodejs.org/ i uruchom ponownie terminal

### Problem: Błąd "EPERM: operation not permitted"
**Rozwiązanie:** 
1. Zamknij wszystkie terminale
2. Usuń folder `node_modules` (kliknij prawym → Usuń)
3. Usuń plik `package-lock.json`
4. Uruchom ponownie terminal jako Administrator
5. Wykonaj `npm install`

### Problem: Błąd z rollup
**Rozwiązanie:**
```bash
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

### Problem: Port 5173 jest zajęty
**Rozwiązanie:** 
Vite automatycznie wybierze inny port (np. 5174). Sprawdź komunikat w terminalu.

## Build produkcyjny
Aby zbudować wersję produkcyjną:
```bash
npm run build
```

Pliki gotowe do wdrożenia znajdą się w folderze `dist/`.

Aby podejrzeć build:
```bash
npm run preview
```

## Dodatkowe komendy
- `npm run lint` - sprawdzenie błędów kodu
- `npm run preview` - podgląd wersji produkcyjnej

---

## Pomoc techniczna

**Jeśli nic nie działa:**
1. Upewnij się, że masz zainstalowany Node.js: `node --version` (powinno pokazać v18 lub wyżej)
2. Upewnij się, że masz npm: `npm --version`
3. Spróbuj uruchomić terminal jako Administrator
4. Wyłącz antywirus tymczasowo podczas `npm install`

---

## Technologie
Projekt używa:
- React 19
- TypeScript
- Tailwind CSS (CDN)
- Vite
- Dexie.js (IndexedDB)
- PWA (Progressive Web App)

## Struktura projektu
```
time-tracker-pwa/
├── src/                    # Kod źródłowy
│   ├── components/         # Komponenty React
│   ├── utils/             # Funkcje pomocnicze
│   └── db.ts              # Konfiguracja bazy danych
├── public/                # Pliki statyczne
├── index.html             # Główny plik HTML
└── package.json           # Konfiguracja projektu
```
