"""Optional maintainer tool: python -m pip install 'fonttools[woff]'.

Run from the React root with `python scripts/subset-uicons.py` after adding icons.
Normal Node builds do not require Python and safely fall back to full fonts.
"""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
groups = json.loads(subprocess.check_output(
    ["node", "scripts/generate-uicons.cjs", "--manifest"], cwd=root
))
destination = root / "src/styles/uicons"
destination.mkdir(parents=True, exist_ok=True)
manifest = {}


def drawing(font, codepoint):
    name = font.getBestCmap()[codepoint]
    glyphs = font.getGlyphSet()
    pen = DecomposingRecordingPen(glyphs)
    glyphs[name].draw(pen)
    return pen.value, font["hmtx"][name]


for group in groups:
    source = root / "node_modules/@flaticon/flaticon-uicons/css" / group["source"]
    font = TTFont(source, recalcBBoxes=False, recalcTimestamp=False)
    originals = {g["codepoint"]: drawing(font, g["codepoint"]) for g in group["glyphs"]}
    options = subset.Options()
    options.flavor = "woff2"
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.name_legacy = True
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=[g["codepoint"] for g in group["glyphs"]])
    subsetter.subset(font)
    # Preserve license/name metadata carried by the original font.
    filename = group["name"] + ".woff2"
    font.flavor = "woff2"
    font.save(destination / filename)
    saved = TTFont(destination / filename)
    for codepoint, original in originals.items():
        assert drawing(saved, codepoint) == original, f"Glyph geometry changed: {group['name']} U+{codepoint:X}"
    manifest[group["name"]] = {
        "file": filename,
        "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "icons": [g["name"] for g in group["glyphs"]],
    }
    print(filename, (destination / filename).stat().st_size, "bytes")
shutil.copyfile(root / "node_modules/@flaticon/flaticon-uicons/LICENSE", destination / "LICENSE.txt")
(destination / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
subprocess.run(["node", "scripts/generate-uicons.cjs"], cwd=root, check=True)
