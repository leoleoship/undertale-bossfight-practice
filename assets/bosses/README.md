# Boss Images

The game loads original generated pixel-art PNG portraits from this folder before using the canvas fallback sprites.
The portraits are fan-made square-piece silhouettes with stronger costume, weapon, and pose cues for recognition.
The generator places each face and shirt or armor panel by hand so the small thumbnails still show the right character silhouette.

Included/expected filenames:

- `undyne.png`
- `asgore.png`
- `disbelief.png`
- `btt.png`
- `sans.png`
- `undying.png`
- `omega.png`
- `asriel.png`
- `mettaton.png`

Regenerate the included original portraits with:

```sh
python3 tools/generate_boss_portraits.py
```

The repository does not include copied Undertale screenshots or sprites. Use only images you have permission to publish if you replace these files.
