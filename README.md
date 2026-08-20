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
Portraits now place faces, shirts, armor panels, robes, and chest emblems more deliberately so the characters read better at battle size and roster-thumbnail size.
The boss select cards also show these portraits as pixel thumbnails so the roster is recognizable before the fight starts.
In battle, each portrait has boss-specific sizing and a pixel outline so large bosses, short bosses, and trio characters keep their intended silhouettes.
The battle stage also draws boss-specific pixel cues behind portraits, including bones, spears, tridents, flames, vines, eyes, wings, stars, and Mettaton-style lights.
Bosses speak through an Undertale-style speech box with original boss-flavored lines that change by turn and wave.
The boss speech is now drawn as a separate white pixel bubble near the character portrait, with a pointer aimed back at the boss.
Boss speech also reacts briefly to FIGHT, ACT, ITEM, and SPARE before the enemy attack starts.
Enemy turns include a short speech lead-in before bullets spawn, so attacks begin after the dialogue beat instead of instantly.
Undyne uses a square battle box for every practice wave, and Undyne the Undying keeps a square box during green-heart shield turns.
If a PNG fails to load, the fallback art uses hand-authored pixel matrices before falling back to older procedural tile shapes.
Boss sprites also draw stronger signature cues over the pixel matrices, such as Sans's skull outline, Undyne's spear and armor, Asgore's horns, Omega Flowey's vines and monitor face, Asriel's wings, and Mettaton's pose.
Those cues are built from single-color square blocks, so the characters stay closer to the pixel-piece look while becoming easier to recognize.
Each boss also has an in-canvas nameplate so the selected character is always clear while the fallback art improves.
Bullet patterns are boss-themed for practice: bones and blaster lanes, spear shields, fire/trident pressure, petals and vines, stars/sabers, and Mettaton-style bombs/legs.
Patterns are inspired by the recognizable mechanics from the boss fights, but they are retimed and simplified for practice.
Several fights use scripted lane/sequenced attacks to feel closer to their source mechanics, such as Undyne's directional shield arrows, Sans-style bone lanes and beams, Asgore trident/fire sweeps, and Mettaton spotlight/bomb lanes.
Omega Flowey and Asriel also use more staged lane patterns, with vine grids, pellet bursts with gaps, star curtains, saber sweeps, and ring attacks with readable safe spaces.
Mettaton yellow-heart waves now reward shooting bombs with cross blasts, Omega Flowey's finale adds corner spiral pellets and vine rakes with safe lanes, and Asriel's finale adds shocker-style beam columns with planned escape gaps.
Large weapon attacks now show short lane warnings before moving, making tridents, sabers, spears, and leg sweeps feel more deliberate.
Undyne-style green-heart turns use square-box shield reads with multi-direction arrow chords and warning lanes.
Boss waves also adjust the battle box shape for closer practice feel, including low corridor boxes, narrow cage boxes, wide final-phase boxes, and tall yellow-heart boxes.
The in-canvas battle box shows soul-mode cues, attack lead-in labels, green-heart shield markers, and a tiny center hitbox marker on the heart.
Player commands now mirror Undertale-style action narration inside the canvas before the boss attack begins.
Enemy turns now show colored soul-mode transition callouts and wave-specific boss speech before each attack pattern.
Sans and Disbelief include blue/orange bone rules: stop for blue attacks and move through orange attacks.
Asgore now includes blue/orange flame reads, Sans blue-heart waves include gravity slam beats, and Undyne-style shield turns use longer directional strings for closer practice flow.
Normal mode is tuned for learning, with lower damage, slower attacks, and a bullet cap so waves stay dodgeable.
Bullet speed and spawn rate now use boss-and-wave-specific pacing profiles, with a small in-canvas speed/rate readout for practice tuning.
Dynamic wave ramps use staged opener/build/finale intensity, so attacks start readable and tighten toward the end instead of changing at one flat rate.
Weapon warnings and hazard telegraphs also follow that intensity curve, giving longer reads at the start of a turn and quicker warnings during the finale.
Pattern sequencing now advances with the tuned spawn rate, so faster waves use the intended ordered reads instead of repeating lanes; Sans, Undyne, Undying, Asgore, Omega, Asriel, Mettaton, and Disbelief patterns have tighter speeds and more source-style safe gaps.
Attack timing is now repeatable per boss wave regardless of which action you choose, with per-wave bullet caps plus snappier blue-soul gravity/jumps and faster yellow-soul shots for closer practice feel.
Undyne green-heart arrows and Sans bone waves now ramp during the enemy turn, and Asgore's fire rings/trident sweeps use faster movement with wider planned escape gaps.
Omega Flowey, Asriel, and Mettaton waves now use late-turn pacing ramps, faster special attacks, and wider scripted gaps on ring, vine, curtain, and spotlight patterns.
Disbelief Papyrus, Bad Time Trio, and Undyne the Undying now ramp their bone, fire, blaster, and spear layers during enemy turns so the mixed pressure builds closer to the real fight style while staying practiceable.
Projectile collisions use sprite-matched hitboxes now, so high-speed spears, tridents, sabers, legs, beams, vines, bones, and round bullets are stricter to their visible shapes while staying readable.
The Practice Wave selector can now start directly on any boss wave, making it easier to tune and rehearse wave-specific bullet speed, heart mode, arena shape, and pacing.
Gameplay projectile spawns are scripted instead of random, so repeating a wave gives the same attack reads for better speed practice.
Continuous projectile motion uses the same tuned pattern clock as spawn sequencing, keeping rings, sways, and rotating attacks aligned with each boss wave's speed profile.

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
