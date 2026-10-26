"""Create a clean, source-only Hostinger upload without Site or local runtime data."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import argparse
import json

root = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('destination', type=Path, help='Absolute path for the source ZIP')
args = parser.parse_args()
destination = args.destination
if not destination.is_absolute() or destination.suffix.lower() != '.zip':
    parser.error('Provide an absolute destination ending in .zip')
if destination.resolve().is_relative_to(root):
    parser.error('Choose a destination outside the source checkout')

files = [root / name for name in (
    'package.json', 'package-lock.json', 'next.config.mjs', 'README.md', '.env.example', '.gitignore'
)]
for directory in ('app', 'public', 'scripts', 'docs'):
    files.extend(path for path in (root / directory).rglob('*')
                 if path.is_file() and not any(part.startswith('.') or part == '__pycache__'
                                              for part in path.relative_to(root).parts)
                 and path.name != '__qa-responsive.html')
files = sorted(set(files))
for source in files:
    if source.is_symlink():
        raise ValueError(f'Source must not be a symlink: {source.relative_to(root)}')
destination.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(destination, 'w', compression=ZIP_DEFLATED) as archive:
    for source in files:
        archive.write(source, source.relative_to(root).as_posix())
with ZipFile(destination) as archive:
    assert archive.testzip() is None, 'Archive integrity check failed'
    names = set(archive.namelist())
    package = json.loads(archive.read('package.json'))
    assert package['scripts']['build'] and package['scripts']['start']
    for required in ('package-lock.json', 'next.config.mjs', 'app/page.jsx',
                     'app/demo-audio.json', 'public/images/swift-ai-solutions-logo.png',
                     'docs/hostinger-setup.md'):
        assert required in names, f'Missing source: {required}'
    for media in json.loads(archive.read('app/demo-audio.json')).values():
        for key in ('src', 'captions', 'transcript'):
            assert 'public' + media[key] in names, f'Missing {key} asset'
    assert not any(name.startswith(('.git/', '.openai/', '.sites-runtime/', 'node_modules/', '.next/', 'out/'))
                   or (name.startswith('.env') and name != '.env.example') for name in names)
print(f'Hostinger source ZIP ready: {destination} ({len(files)} files, {destination.stat().st_size:,} bytes)')
