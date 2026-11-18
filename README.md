# Łapacz Słówek ✋📚

Gra ortograficzna dla dzieci (7–16 lat) sterowana **ruchem dłoni** przez kamerę.
Z góry spadają pary wyrazów – jeden napisany poprawnie, drugi z błędem. Dotknij palcem wskazującym poprawnego!

| Akcja | Punkty |
| --- | --- |
| Złapany poprawny wyraz (np. **łódź**) | **+5** |
| Złapany błędny wyraz (np. łudź) | **−5** |
| Nic nie złapane, para spadła | **−10** |
| Wykonana misja | **+15** |

Przed grą dziecko wpisuje **imię** i wybiera **awatara** – zwierzątko leci za palcem, a wynik trafia do **rankingu top 5** (osobno dla każdej grupy wiekowej, zapisywany w przeglądarce).
Można też ustawić **szybkość gry**: 🐢 Wolno, 🐇 Normalnie, 🚀 Szybko, ⚡ Turbo (mnożniki w `SPEEDS` na górze `js/main.js`).

## Uruchomienie

Wymagany [Node.js](https://nodejs.org). Kliknij dwukrotnie `start.bat` **albo** w terminalu:

```
npm start
```

i otwórz <http://localhost:5173> (Chrome / Edge). Zezwól na dostęp do kamery.
Kamera działa tylko przez `localhost` lub `https` – dlatego nie otwieraj `index.html` bezpośrednio z dysku.
Bez kamery możesz grać myszką lub palcem na ekranie dotykowym.

## Struktura

- `index.html`, `style.css` – ekrany, HUD, karta misji, animacje CSS
- `js/main.js` – silnik gry: spadające wyrazy, kolizje, punkty, misje, cząsteczki, rysowanie
- `js/hands.js` – śledzenie dłoni (MediaPipe Hand Landmarker, ładowany z CDN)
- `js/words.js` – baza wyrazów, kategorie, grupy wiekowe (prędkość spadania)
- `js/audio.js` – efekty dźwiękowe generowane przez Web Audio
- `server.js` – mini serwer plików

## Dodawanie wyrazów

W `js/words.js` dopisz linię do tablicy `RAW`:

```js
['poprawnie', 'błędnie', poziom /* 1–3 */, 'kategoria', 'podpowiedź (opcjonalnie)'],
```

Poziom 1 – 7–9 lat, 2 – 10–12 lat, 3 – 13–16 lat. Ikonkę dodasz w obiekcie `ICONS` w tym samym pliku, np. `łódź: '🛶'`.
Długość rundy i punkty zmienisz na górze `js/main.js`.
