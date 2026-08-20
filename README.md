# Bossfight Practice

A small browser-based bullet practice game inspired by Undertale-style boss fights.

This is a fan-made practice project with original code and simple original visuals. It does not include ripped assets, music, sprites, or exact copyrighted attack timelines.

## Bosses

- Undyne
- Asgore
- Disbelief Papyrus
- Bad Time Trio
- Sans
- Undyne the Undying
- Omega Flowey
- Asriel
- Mettaton

Each fight uses original generated pixel-style PNG portraits, 8-bit bullets, and an original browser-generated chiptune loop.
The BGM loops are original chiptune-style tracks tuned to each boss's mood and tempo; they do not copy Undertale's actual songs.
Boss portraits use original fan-art pixel sprites made from small square pieces with recognizable character shapes, outfits, weapons, and poses.
The boss select cards also show these portraits as pixel thumbnails so the roster is recognizable before the fight starts.
In battle, each portrait has boss-specific sizing and a pixel outline so large bosses, short bosses, and trio characters keep their intended silhouettes.
The battle stage also draws boss-specific pixel cues behind portraits, including bones, spears, tridents, flames, vines, eyes, wings, stars, and Mettaton-style lights.
If a PNG fails to load, the fallback art uses hand-authored pixel matrices before falling back to older procedural tile shapes.
Boss sprites also draw stronger signature cues over the pixel matrices, such as Sans's skull outline, Undyne's spear and armor, Asgore's horns, Omega Flowey's vines and monitor face, Asriel's wings, and Mettaton's pose.
Those cues are built from single-color square blocks, so the characters stay closer to the pixel-piece look while becoming easier to recognize.
Each boss also has an in-canvas nameplate so the selected character is always clear while the fallback art improves.
Bullet patterns are boss-themed for practice: bones and blaster lanes, spear shields, fire/trident pressure, petals and vines, stars/sabers, and Mettaton-style bombs/legs.
Patterns are inspired by the recognizable mechanics from the boss fights, but they are retimed and simplified for practice.
Normal mode is tuned for learning, with lower damage, slower attacks, and a bullet cap so waves stay dodgeable.

## Run Locally

Open `index.html` in a browser.

## Boss Images

The game loads the included original PNG portraits from `assets/bosses/`. They can be regenerated with `python3 tools/generate_boss_portraits.py`.

Do not publish copied Undertale screenshots or sprites unless you have permission to use them.

## Controls

- Move: arrow keys or WASD
- Focus: Shift
- Green heart: arrow keys or WASD aim the shield; the heart does not move
- A correctly aimed green shield destroys incoming arrows and spears with a block flash
- Yellow heart shot: Space
- Restart: R

## Battle System

- FIGHT, ACT, ITEM, and SPARE are available on each player turn.
- Enemy turns use short bullet waves, then return to the command menu.
- Items are Undertale-style healing items chosen to fit each boss practice.
- Heart modes change by boss/wave: red is normal, blue uses gravity, green uses a directional shield, and yellow can shoot.

## GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository settings, open **Pages**.
3. Set the source to the main branch root.
4. Visit the generated Pages URL.
