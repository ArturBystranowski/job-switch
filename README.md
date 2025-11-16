# Frontend App

Nowoczesna aplikacja frontendowa zbudowana z wykorzystaniem najnowszych technologii.

## 🚀 Stack Technologiczny

- **React 19** - Framework do budowy interaktywnych komponentów i widoków
- **Vite** - Szybki bundler i dev server; umożliwia szybkie hot reload i build
- **TypeScript 5** - Statyczne typowanie kodu, lepsza autokompletacja w IDE
- **Material UI (MUI)** - Biblioteka gotowych komponentów UI, stylowanie, responsywność

## 📦 Wymagania

- Node.js (wersja 18.x lub wyższa)
- npm lub yarn

## 🛠️ Instalacja

1. Sklonuj repozytorium (lub pobierz kod źródłowy)
2. Zainstaluj zależności:

```powershell
npm install
```

lub

```powershell
yarn install
```

## 🏃 Uruchomienie projektu

### Tryb deweloperski

```powershell
npm run dev
```

lub

```powershell
yarn dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

### Build produkcyjny

```powershell
npm run build
```

lub

```powershell
yarn build
```

### Podgląd build'a produkcyjnego

```powershell
npm run preview
```

lub

```powershell
yarn preview
```

## 📁 Struktura projektu

```
frontend-app/
├── public/                 # Pliki statyczne
├── src/
│   ├── assets/            # Zasoby (obrazy, ikony, etc.)
│   ├── components/        # Komponenty React
│   │   ├── WelcomeCard.tsx
│   │   ├── WelcomeCard.sx.ts     # Style komponentu
│   │   ├── WelcomeCard.types.ts  # Typy TypeScript
│   │   └── index.ts              # Eksporty
│   ├── styles/            # Globalne style
│   │   └── index.css
│   ├── theme/             # Konfiguracja motywu MUI
│   │   └── theme.ts
│   ├── App.tsx            # Główny komponent aplikacji
│   ├── App.sx.ts          # Style dla App
│   └── main.tsx           # Punkt wejścia aplikacji
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Konwencje projektowe

### Style komponentów

- Style komponentów trzymamy w oddzielnych plikach `.sx.ts`
- Nazewnictwo: `<ComponentName>.sx.ts`
- Każdy styl eksportujemy jako osobną stałą

```typescript
// Button.sx.ts
export const buttonSx = {
  padding: '1rem',
  borderRadius: '0.5rem',
};
```

### Typy TypeScript

- Typy/interfejsy dla komponentów trzymamy w `.types.ts`
- Nazewnictwo: `<ComponentName>.types.ts`

```typescript
// Button.types.ts
export interface ButtonProps {
  label: string;
  onClick: () => void;
}
```

### Jednostki CSS

- **ZAWSZE** używaj jednostek `rem` zamiast `px`
- 1rem = 16px (domyślnie)

### Layout i odstępy

- **UNIKAJ** używania `margin`
- Używaj komponentu `Stack` z właściwością `gap` dla odstępów

```typescript
<Stack spacing={2}> {/* spacing w jednostkach MUI (1 = 8px) */}
  <Component1 />
  <Component2 />
</Stack>
```

## 🧩 Material UI (MUI)

Projekt wykorzystuje Material UI jako główną bibliotekę komponentów. 

### Dostępne komponenty:

- Layout: `Box`, `Container`, `Stack`, `Grid`
- Inputs: `Button`, `TextField`, `Select`, `Checkbox`, etc.
- Navigation: `AppBar`, `Drawer`, `Tabs`, `Menu`
- Display: `Card`, `Typography`, `Divider`, `Chip`
- Feedback: `Alert`, `Snackbar`, `Dialog`, `Progress`
- Icons: `@mui/icons-material`

### Dokumentacja MUI:

[https://mui.com/material-ui/getting-started/](https://mui.com/material-ui/getting-started/)

## 📝 Linting

Projekt wykorzystuje ESLint z konfiguracją dla TypeScript i React.

```powershell
npm run lint
```

## 🔧 Konfiguracja

### Vite (`vite.config.ts`)

- Port deweloperski: 3000
- Auto-otwieranie przeglądarki
- Source maps w build'zie produkcyjnym

### TypeScript (`tsconfig.app.json`)

- Strict mode włączony
- Unused locals i parameters sprawdzane
- No fallthrough cases
- Indexed access checking

## 🎯 Dodawanie nowych komponentów

1. Utwórz folder dla komponentu w `src/components/`
2. Utwórz 3 pliki:
   - `ComponentName.tsx` - komponent
   - `ComponentName.sx.ts` - style
   - `ComponentName.types.ts` - typy/interfejsy
3. Eksportuj komponent w `src/components/index.ts`

Przykład:

```typescript
// Button.tsx
import { Button as MuiButton } from '@mui/material';
import { buttonSx } from './Button.sx';
import { ButtonProps } from './Button.types';

export const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <MuiButton sx={buttonSx} onClick={onClick}>
      {label}
    </MuiButton>
  );
};

// Button.sx.ts
export const buttonSx = {
  padding: '1rem 2rem',
  fontSize: '1rem',
  borderRadius: '0.5rem',
};

// Button.types.ts
export interface ButtonProps {
  label: string;
  onClick: () => void;
}
```

## 📚 Dodatkowe zasoby

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Material UI Documentation](https://mui.com/)

## 🤝 Współpraca

Przed rozpoczęciem pracy:

1. Zapoznaj się z konwencjami projektowymi
2. Upewnij się, że linter nie zgłasza błędów
3. Testuj zmiany w trybie deweloperskim
4. Sprawdź build produkcyjny przed commitowaniem

## 📄 Licencja

MIT

