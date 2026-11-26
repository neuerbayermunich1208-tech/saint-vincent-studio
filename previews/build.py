import sys,pathlib
root=pathlib.Path(__file__).resolve().parent
logo_src=root.parent/'assets'/'brand'/'saint-vincent-logo-1024.webp'
import base64
logo='data:image/webp;base64,'+base64.b64encode(logo_src.read_bytes()).decode()
(root/'dist').mkdir(exist_ok=True)
for f in sorted((root/'src').glob('*.html')):
    (root/'dist'/f.name).write_text(f.read_text().replace('{{LOGO}}',logo))
    print('built',f.name)
