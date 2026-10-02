# kovaniprosklo – vlastní kód pro Shoptet

Vlastní CSS a JavaScript pro e-shop. Kód se spravuje zde v GitHubu a do Shoptetu
se vkládají jen krátké odkazy, takže nenarážíme na limit znaků v administraci.

## Struktura

- `css/custom.css` – vlastní styly
- `js/custom.js` – vlastní skripty

## Vložení do Shoptetu

Administrace → Vzhled a obsah → Editor → HTML kód

**Záhlaví (head):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hind+Mysuru:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/softema/kovaniprosklo@main/css/custom.css">
```

**Zápatí (před `</body>`):**

```html
<script src="https://cdn.jsdelivr.net/gh/softema/kovaniprosklo@main/js/custom.js"></script>
```

Repozitář musí být **veřejný**, jinak jsDelivr soubory nenačte.

## Po změně kódu

jsDelivr drží soubory v cache (u `@main` až 12 hodin). Pro okamžitou aktualizaci:

- otevřít `https://purge.jsdelivr.net/gh/softema/kovaniprosklo@main/css/custom.css`
  (a obdobně pro JS), nebo
- místo `@main` odkazovat na konkrétní commit/tag, např. `@v1.0.1`.
