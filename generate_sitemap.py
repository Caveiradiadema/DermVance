#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import glob
from datetime import datetime, timezone
from xml.etree.ElementTree import Element, SubElement, ElementTree

# ====== CONFIG ======
BASE_URL = "https://dermvance.vercel.app"  # troque aqui se for outro domínio
OUTPUT_FILE = "sitemap.xml"

# Se quiser controlar prioridades por página, ajuste aqui (opcional)
PRIORITY_MAP = {
    "/": "1.0",
    "/terapia-cicatrizacao/": "0.9",
    # demais rotas usam 0.8 (default)
}
DEFAULT_PRIORITY = "0.8"
# ====== /CONFIG ======

def path_to_route(html_path: str) -> str:
    """Converte 'index.html' -> '/', 'diadema.html' -> '/diadema/'"""
    name = os.path.basename(html_path)
    stem, ext = os.path.splitext(name)
    if stem.lower() == "index":
        return "/"
    return f"/{stem}/"

def file_lastmod_iso8601(fpath: str) -> str:
    """Pega mtime do arquivo e formata como ISO 8601 +00:00 (sem micros)."""
    ts = os.path.getmtime(fpath)
    dt = datetime.fromtimestamp(ts, tz=timezone.utc).replace(microsecond=0)
    return dt.isoformat()  # ex: 2025-09-10T18:20:16+00:00

def discover_routes() -> list[tuple[str, str]]:
    """
    Descobre todos .html na raiz e retorna lista (route, filepath).
    Ignora arquivos que começam com '_' se houverem.
    """
    routes = []
    for fpath in glob.glob("*.html"):
        if os.path.basename(fpath).startswith("_"):
            continue
        route = path_to_route(fpath)
        routes.append((route, fpath))
    # Garante que "/" vem primeiro
    routes.sort(key=lambda x: (0 if x[0] == "/" else 1, x[0]))
    return routes

def build_sitemap(urls: list[tuple[str, str]]) -> Element:
    """
    Monta o XML do sitemap a partir de [(route, filepath), ...]
    """
    urlset = Element("urlset", attrib={"xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9"})
    for route, fpath in urls:
        loc = BASE_URL.rstrip("/") + route
        lastmod = file_lastmod_iso8601(fpath)
        priority = PRIORITY_MAP.get(route, DEFAULT_PRIORITY)

        url_el = SubElement(urlset, "url")
        SubElement(url_el, "loc").text = loc
        SubElement(url_el, "lastmod").text = lastmod
        SubElement(url_el, "priority").text = priority
        # Opcional: você pode incluir <changefreq> se quiser
        # SubElement(url_el, "changefreq").text = "weekly"
    return urlset

def write_xml(root: Element, out_path: str):
    """Grava XML em UTF-8 sem BOM e com quebras LF."""
    tree = ElementTree(root)
    # Escreve para um buffer temporário e depois normaliza \n
    tmp_path = out_path + ".tmp"
    tree.write(tmp_path, encoding="utf-8", xml_declaration=True, method="xml")
    # Normaliza EOL para LF e salva sem BOM
    with open(tmp_path, "rb") as f:
        data = f.read()
    text = data.decode("utf-8").replace("\r\n", "\n")
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    os.remove(tmp_path)

def main():
    routes = discover_routes()
    if not routes:
        raise SystemExit("Nenhum .html encontrado na raiz. Coloque seus .html na raiz do projeto.")
    root = build_sitemap(routes)
    write_xml(root, OUTPUT_FILE)
    print(f"[OK] Gerado {OUTPUT_FILE} com {len(routes)} URLs usando mtime real como <lastmod>.")

if __name__ == "__main__":
    main()
