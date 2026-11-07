# Harmonia: pacote de identidade visual

Logo: cinco barras de equalizador (ícone) + wordmark "harmonia" em serifa itálica.
O texto dos SVGs já está convertido em paths (Instrument Serif Italic, licença SIL OFL), então nenhum arquivo depende de fonte instalada.

## Cores

| Nome  | Hex       | Uso                                  |
|-------|-----------|--------------------------------------|
| Lima  | `#d9f27a` | Fundo claro da marca, logo em fundo escuro |
| Verde | `#0b3d24` | Logo em fundo claro, fundo escuro da marca |

```css
/* brand.css */
:root { --harmonia-lime: #d9f27a; --harmonia-green: #0b3d24; }
```

Tailwind v4 (`@theme` no seu CSS):

```css
@theme {
  --color-harmonia-lime: #d9f27a;
  --color-harmonia-green: #0b3d24;
}
```

Tailwind v3 (`tailwind.config`): `theme.extend.colors.harmonia = { lime: "#d9f27a", green: "#0b3d24" }`

## Estrutura

```
web/      pronto para copiar para public/ (favicon, apple-touch, ícones PWA, og:image, manifest)
svg/      todos os vetores (logo, ícones, padrões, og)
png/      versões raster (logos, ícones 16 a 512, padrões)
react/    Logo.tsx (HarmoniaLogo e HarmoniaMark, com currentColor)
brand.css variáveis de cor
```

### Qual arquivo usar

| Onde                        | Arquivo |
|-----------------------------|---------|
| Navbar (fundo escuro)       | `svg/logo-horizontal-lime.svg` ou `<HarmoniaLogo className="text-harmonia-lime" />` |
| Fundo claro (docs, README)  | `svg/logo-horizontal-green.svg` |
| Com fundo embutido          | `svg/logo-horizontal-on-green.svg` / `on-lime.svg` |
| Capa, rodapé, README        | `svg/logo-stacked-*.svg` |
| Landing / apresentação      | `svg/logo-horizontal-tagline-*.svg` |
| Avatar (GitHub, redes)      | `png/icon-512.png` (lima) ou `png/icon-512-dark.png` |
| Favicon                     | `web/favicon.svg`, `web/favicon.ico` |
| Compartilhamento (og:image) | `web/og-image.png` (verde) ou `png/og-image-lime.png` |
| Textura de fundo            | `svg/pattern-*` |

## `<head>` (Next.js, Vite ou HTML puro)

```html
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#0b3d24" />
<meta property="og:image" content="https://SEU-DOMINIO/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
```

Troque `SEU-DOMINIO` pelo domínio real. No `og:image` o URL precisa ser absoluto.

## React

```tsx
import { HarmoniaLogo, HarmoniaMark } from "./Logo";

<HarmoniaLogo className="h-8 text-harmonia-lime" />
<HarmoniaMark className="h-6 text-harmonia-green" />
```

A cor vem de `currentColor`, então basta mudar o `text-*` ou o `color`.

## Padrão de barras

Os arquivos `pattern-tile-*.svg` (75×140) repetem na horizontal:

```css
.hero {
  background: #0b3d24 url("/pattern-tile-lime.svg") repeat-x center;
}
```

`pattern-wide-*` é um banner pronto de 1440×320.

## Regras rápidas

- Abaixo de 32 px use `favicon.svg` (3 barras); de 48 px para cima, o ícone de 5 barras.
- Espaço livre em volta do logo: pelo menos a altura das barras mais curtas.
- Só as duas cores da marca; não use lima sobre branco nem verde sobre preto (pouco contraste).
- O logo com slogan só em tamanho grande, porque o texto pequeno perde legibilidade.
