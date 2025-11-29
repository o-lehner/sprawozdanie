# Wdrożenie Time Tracker PWA na GitHub Pages

Ten poradnik pokazuje krok po kroku jak opublikować aplikację Time Tracker PWA na GitHub Pages, aby była dostępna online.

## Wymagania wstępne
- Konto GitHub (założ na https://github.com jeśli nie masz)
- Git zainstalowany na komputerze
- Projekt uruchomiony lokalnie (sprawdź `INSTALLATION.md`)

---

## Krok 1: Konfiguracja projektu dla GitHub Pages

### 1.1. Edytuj plik `vite.config.ts`

Otwórz plik `vite.config.ts` i dodaj właściwość `base`:

```typescript
export default defineConfig({
  base: '/time-tracker-pwa/',  // <-- Dodaj tę linię (nazwa Twojego repo)
  plugins: [
    react(),
    VitePWA({
      // ... reszta konfiguracji
    })
  ],
  // ... reszta konfiguracji
})
```

**WAŻNE:** Zamień `time-tracker-pwa` na nazwę swojego repozytorium GitHub!

---

## Krok 2: Utworzenie repozytorium GitHub

### Opcja A: Przez stronę GitHub (łatwiejsza)

1. Zaloguj się na https://github.com
2. Kliknij **+** w prawym górnym rogu → **New repository**
3. Nazwa: `time-tracker-pwa` (lub dowolna)
4. Opis (opcjonalnie): "Time tracking PWA application"
5. Wybierz **Public**
6. **NIE** zaznaczaj "Add a README file"
7. Kliknij **Create repository**

### Opcja B: Istniejące repozytorium

Jeśli masz już repozytorium, przejdź do Kroku 3.

---

## Krok 3: Połączenie projektu z GitHub

### 3.1. Inicjalizacja Git (jeśli jeszcze nie zrobione)

Otwórz terminal w folderze projektu:

**Windows (CMD):**
```bash
cd C:\ścieżka\do\time-tracker-pwa
git init
```

**macOS/Linux:**
```bash
cd /ścieżka/do/time-tracker-pwa
git init
```

### 3.2. Dodaj pliki do repozytorium

```bash
git add .
git commit -m "Initial commit - Time Tracker PWA"
```

### 3.3. Połącz z GitHub

Skopiuj URL swojego repozytorium z GitHub (przykład: `https://github.com/twoj-username/time-tracker-pwa.git`) i wykonaj:

```bash
git branch -M main
git remote add origin https://github.com/twoj-username/time-tracker-pwa.git
git push -u origin main
```

**Uwaga:** Zamień `twoj-username` i `time-tracker-pwa` na swoje dane!

---

## Krok 4: Automatyczne wdrożenie przez GitHub Actions

### 4.1. Utwórz plik workflow

Utwórz strukturę folderów i plik:

**Windows:**
```bash
mkdir .github
mkdir .github\workflows
```

**macOS/Linux:**
```bash
mkdir -p .github/workflows
```

### 4.2. Utwórz plik `.github/workflows/deploy.yml`

Skopiuj poniższą zawartość do pliku `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 4.3. Zapisz i wyślij zmiany

```bash
git add .
git commit -m "Add GitHub Pages deployment workflow"
git push
```

---

## Krok 5: Włącz GitHub Pages w ustawieniach

1. Przejdź do swojego repozytorium na GitHub
2. Kliknij **Settings** (górny pasek)
3. W menu po lewej stronie kliknij **Pages**
4. W sekcji **Source** wybierz:
   - **Source:** GitHub Actions
5. Zapisz

---

## Krok 6: Uruchom deployment

GitHub Actions automatycznie uruchomi się po każdym `git push`. Możesz sprawdzić postęp:

1. Przejdź do zakładki **Actions** w swoim repozytorium
2. Zobaczysz workflow "Deploy to GitHub Pages"
3. Kliknij na niego, aby zobaczyć szczegóły
4. Poczekaj aż zakończy się sukcesem (zielony ✓)

---

## Krok 7: Sprawdź działanie

Twoja aplikacja będzie dostępna pod adresem:

```
https://twoj-username.github.io/time-tracker-pwa/
```

**Przykład:**
```
https://john-doe.github.io/time-tracker-pwa/
```

---

## Aktualizacja aplikacji

Za każdym razem gdy chcesz zaktualizować aplikację online:

```bash
# 1. Wprowadź zmiany w kodzie
# 2. Zapisz zmiany i wyślij:

git add .
git commit -m "Opis zmian"
git push
```

GitHub Actions automatycznie zbuduje i wdroży nową wersję! ⚡

---

## Rozwiązywanie problemów

### Problem: 404 po wejściu na stronę

**Rozwiązanie:** Sprawdź czy w `vite.config.ts` ustawiłeś poprawną właściwość `base`:
```typescript
base: '/nazwa-twojego-repo/',
```

### Problem: Białe tło zamiast aplikacji

**Rozwiązanie:** Sprawdź czy:
1. Build zakończył się sukcesem w zakładce Actions
2. W Settings → Pages wybrałeś "GitHub Actions" jako Source

### Problem: CSS nie działa

**Rozwiązanie:** Aplikacja używa Tailwind z CDN - sprawdź czy w `index.html` jest:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

### Problem: Deployment failed w Actions

**Rozwiązanie:**
1. Sprawdź logi w zakładce Actions
2. Upewnij się, że lokalnie działa `npm run build`
3. Sprawdź czy `.github/workflows/deploy.yml` jest poprawny

### Problem: Permission denied podczas push

**Rozwiązanie:**
- Użyj Personal Access Token zamiast hasła
- Przejdź do: GitHub → Settings → Developer settings → Personal access tokens
- Wygeneruj nowy token z uprawnieniami `repo`

---

## Konfiguracja własnej domeny (opcjonalnie)

Jeśli masz własną domenę:

1. W ustawieniach GitHub Pages wprowadź swoją domenę w polu **Custom domain**
2. W ustawieniach DNS domeny dodaj rekord:
   ```
   Type: CNAME
   Name: www (lub subdomena)
   Value: twoj-username.github.io
   ```
3. Zaznacz **Enforce HTTPS**

---

## Dodatkowe porady

### Monitoring
- Zakładka **Actions** pokazuje historię wszystkich deploymentów
- Kliknij na konkretny workflow, aby zobaczyć logi

### Bezpieczeństwo
- GitHub Pages obsługuje HTTPS automatycznie
- Dane użytkownika są przechowywane lokalnie w IndexedDB (przeglądarka)

### Performance
- Aplikacja jest PWA - użytkownicy mogą ją zainstalować
- Service Worker cache'uje zasoby dla offline

---

## Alternatywne platformy deployment

Jeśli GitHub Pages nie działa, spróbuj:

### Vercel
```bash
npm install -g vercel
vercel login
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

---

## Potrzebujesz pomocy?

- Sprawdź dokumentację GitHub Pages: https://docs.github.com/en/pages
- Sprawdź dokumentację Vite: https://vitejs.dev/guide/static-deploy.html
- GitHub Actions logi: Zakładka **Actions** w repozytorium

---

**Gotowe!** 🎉 Twoja aplikacja jest teraz dostępna online i automatycznie aktualizuje się przy każdym `git push`!

