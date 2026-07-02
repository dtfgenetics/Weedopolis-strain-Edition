#!/usr/bin/env python3
from pathlib import Path
import shutil, sys, zipfile
from PIL import Image

ROOT = Path.cwd()
DEST = ROOT / 'assets' / 'decks' / 'verified_cards'
NORM_DEST = DEST / 'normalized_cards'
SHEETS_DEST = DEST / 'print_sheets'
EXPECTED_NORM = (1650, 2250)
EXPECTED_COUNTS = {'high_chance': 15, 'community_stash': 16}

def fail(msg):
    print('ERROR:', msg, file=sys.stderr)
    sys.exit(1)

def find_root(tmp):
    hits = list(tmp.glob('**/Weedopolis_Approved_Cards_Manifest.csv'))
    if not hits:
        fail('Manifest not found in package')
    return hits[0].parent

def copy_contents(src, dst):
    dst.mkdir(parents=True, exist_ok=True)
    for item in src.iterdir():
        target = dst / item.name
        if item.is_dir():
            if target.exists():
                shutil.rmtree(target)
            shutil.copytree(item, target)
        else:
            shutil.copy2(item, target)

def verify():
    for folder, count in EXPECTED_COUNTS.items():
        paths = sorted((NORM_DEST / folder).glob('*.png'))
        if len(paths) != count:
            fail(f'{folder}: expected {count}, found {len(paths)}')
        for path in paths:
            with Image.open(path) as img:
                if img.size != EXPECTED_NORM:
                    fail(f'{path} size {img.size}, expected {EXPECTED_NORM}')

def main():
    if len(sys.argv) != 2:
        fail('Usage: python scripts/import_verified_card_assets.py /path/to/package.zip')
    zip_path = Path(sys.argv[1]).expanduser().resolve()
    if not zip_path.exists():
        fail(f'ZIP not found: {zip_path}')
    tmp = ROOT / '.tmp_verified_card_import'
    if tmp.exists():
        shutil.rmtree(tmp)
    tmp.mkdir(parents=True)
    with zipfile.ZipFile(zip_path, 'r') as z:
        z.extractall(tmp)
    package_root = find_root(tmp)
    norm = package_root / 'normalized_cards'
    if not norm.exists():
        fail('Missing normalized_cards folder')
    copy_contents(norm, NORM_DEST)
    sheets = package_root / 'print_pngs'
    if sheets.exists():
        copy_contents(sheets, SHEETS_DEST)
    for name in ['Weedopolis_Approved_Cards_Manifest.csv', 'Weedopolis_Approved_Cards_PREFLIGHT_AUDIT.txt']:
        src = package_root / name
        if src.exists():
            shutil.copy2(src, DEST / name)
    verify()
    shutil.rmtree(tmp)
    print('Verified card assets imported successfully')

if __name__ == '__main__':
    main()
