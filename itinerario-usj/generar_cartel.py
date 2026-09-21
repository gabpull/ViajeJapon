#!/usr/bin/env python3
"""Cartel A4 imprimible: itinerario USJ 11 oct 2026 sin Express Pass."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUT = Path("/workspace/itinerario-usj")
FONT_DIR = Path("/usr/share/fonts/truetype/macos")

W, H = 2480, 3508  # A4 @ 300 dpi
MARGIN = 108

F_REG, F_MED, F_SEMI, F_BOLD = (
    "Inter-Regular.ttf",
    "Inter-Medium.ttf",
    "Inter-SemiBold.ttf",
    "Inter-Bold.ttf",
)

NAVY = (22, 36, 61)
NAVY2 = (14, 26, 46)
GOLD = (196, 149, 58)
CREAM = (248, 243, 232)
CREAM2 = (236, 227, 208)
INK = (28, 32, 40)
MUTED = (86, 92, 104)
WHITE = (255, 255, 255)
RED = (176, 36, 48)
ORANGE = (220, 86, 28)
TEAL = (38, 118, 140)
PURPLE = (112, 72, 156)
LAGOON = (78, 152, 184)


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_DIR / name), size)


def rounded_rect(draw, xy, r, fill, outline=None, width=2):
    draw.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)


def text_w(draw, text, fnt):
    b = draw.textbbox((0, 0), text, font=fnt)
    return b[2] - b[0]


def text_h(draw, text, fnt):
    b = draw.textbbox((0, 0), text, font=fnt)
    return b[3] - b[1]


def wrap_text(draw, text, fnt, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if text_w(draw, trial, fnt) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_wrapped(draw, x, y, text, fnt, fill, max_w, leading=1.28):
    lines = wrap_text(draw, text, fnt, max_w)
    h = text_h(draw, "Ag", fnt)
    for i, line in enumerate(lines):
        draw.text((x, y + i * int(h * leading)), line, font=fnt, fill=fill)
    return int(len(lines) * h * leading)


def circle(draw, cx, cy, r, fill, outline=None, width=3):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill, outline=outline, width=width)


def lerp(a, b, t):
    return a + (b - a) * t


def smooth_polyline(points, steps=12):
    if len(points) < 2:
        return points
    out = [points[0]]
    for i in range(len(points) - 1):
        x0, y0 = points[i]
        x1, y1 = points[i + 1]
        for s in range(1, steps + 1):
            t = s / steps
            # cosine ease
            t = (1 - (1 - t) ** 1.0)
            out.append((lerp(x0, x1, t), lerp(y0, y1, t)))
    return out


def draw_header(draw, page_label):
    draw.rectangle((0, 0, W, 250), fill=NAVY2)
    draw.rectangle((0, 250, W, 258), fill=GOLD)
    draw.text((MARGIN, 36), "UNIVERSAL STUDIOS JAPAN", font=font(F_BOLD, 58), fill=WHITE)
    draw.text(
        (MARGIN, 108),
        "Itinerario de un día  ·  11 de octubre de 2026 (domingo)",
        font=font(F_MED, 32),
        fill=(232, 214, 176),
    )
    draw.text(
        (MARGIN, 156),
        "Studio Pass Direct-in  ·  Adulto  ·  SIN Express Pass  ·  08:00 – 22:00",
        font=font(F_REG, 28),
        fill=(186, 196, 210),
    )
    badge = "PRIORIDAD: Super Nintendo World a primera hora"
    fnt = font(F_SEMI, 24)
    bw = text_w(draw, badge, fnt) + 44
    bx = W - MARGIN - bw
    rounded_rect(draw, (bx, 176, bx + bw, 228), 16, RED)
    draw.text((bx + 22, 186), badge, font=fnt, fill=WHITE)
    draw.text((W - MARGIN, 42), page_label, font=font(F_MED, 26), fill=(168, 178, 194), anchor="ra")


def draw_footer(draw, text):
    draw.rectangle((0, H - 78, W, H), fill=NAVY2)
    draw.text((MARGIN, H - 54), text, font=font(F_REG, 22), fill=(190, 200, 214))
    draw.text((W - MARGIN, H - 54), "Imprimir a color · A4 · 100%", font=font(F_MED, 22), fill=GOLD, anchor="ra")


def pin(draw, x, y, n, fill, r=24):
    circle(draw, x, y, r + 4, WHITE)
    circle(draw, x, y, r, fill)
    draw.text((x, y + 1), str(n), font=font(F_BOLD, 26 if r >= 22 else 22), fill=WHITE, anchor="mm")


# ---------------------------------------------------------------------------
# PAGE 1
# ---------------------------------------------------------------------------
def page1() -> Image.Image:
    img = Image.new("RGB", (W, H), CREAM)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "Página 1 de 2  ·  Mapa")

    y = 280
    intro = (
        "Sin Express Pass hay que entrar al parque lo más temprano posible y correr a Super Nintendo World. "
        "Ruta más corta: ~700 m, 7–10 min. El 11 oct es domingo de Halloween: cupos gratis se agotan. "
        "Estar en la fila a las 06:30. El parque puede abrir antes de las 08:00."
    )
    draw_wrapped(draw, MARGIN, y, intro, font(F_REG, 28), INK, W - 2 * MARGIN, 1.3)

    # Map panel
    mx0, my0, mx1, my1 = MARGIN, 392, W - MARGIN, 2860
    rounded_rect(draw, (mx0, my0, mx1, my1), 32, (16, 40, 48))

    legend_w = 430
    ix0, iy0 = mx0 + 28, my0 + 24
    ix1, iy1 = mx1 - legend_w - 18, my1 - 24

    def mp(px, py):
        return int(ix0 + px * (ix1 - ix0)), int(iy0 + py * (iy1 - iy0))

    # grass
    rounded_rect(draw, (*mp(0.0, 0.0), *mp(1.0, 1.0)), 28, (48, 108, 72))
    # sand paths
    rounded_rect(draw, (*mp(0.08, 0.10), *mp(0.92, 0.92)), 90, (214, 198, 160))

    def area(p0, p1, fill, title, sub=""):
        a, b = mp(*p0), mp(*p1)
        rounded_rect(draw, (*a, *b), 26, fill, outline=WHITE, width=3)
        cx, cy = (a[0] + b[0]) // 2, (a[1] + b[1]) // 2
        draw.text((cx, cy - (12 if sub else 0)), title, font=font(F_BOLD, 24), fill=WHITE, anchor="mm")
        if sub:
            draw.text((cx, cy + 16), sub, font=font(F_REG, 18), fill=(255, 255, 255), anchor="mm")

    area((0.18, 0.80), (0.82, 0.98), (108, 86, 58), "HOLLYWOOD", "entrada · tiendas")
    area((0.05, 0.66), (0.32, 0.82), (168, 96, 48), "H. DREAM", "montar al volver")
    area((0.36, 0.66), (0.62, 0.80), (128, 92, 148), "WONDERLAND", "NO entrar ahora")
    area((0.04, 0.48), (0.34, 0.64), (42, 102, 132), "AMITY / JAWS", "de largo de mañana")
    area((0.04, 0.32), (0.34, 0.46), (42, 80, 112), "WATERWORLD", "pasar a la DERECHA")
    area((0.04, 0.04), (0.40, 0.30), (176, 42, 54), "SUPER NINTENDO", "Mario · DK · Yoshi")
    area((0.42, 0.04), (0.68, 0.28), (96, 52, 128), "HARRY POTTER", "Hogsmeade")
    area((0.70, 0.04), (0.98, 0.30), (42, 108, 72), "JURASSIC PARK", "Flying Dinosaur")
    area((0.70, 0.32), (0.98, 0.54), (110, 90, 62), "SAN FRANCISCO", "Nueva York")
    area((0.70, 0.56), (0.98, 0.78), (198, 168, 46), "MINION PARK", "")

    # lagoon
    draw.ellipse((*mp(0.38, 0.36), *mp(0.66, 0.62)), fill=LAGOON, outline=WHITE, width=5)
    draw.text(mp(0.52, 0.49), "LAGUNA", font=font(F_SEMI, 22), fill=WHITE, anchor="mm")

    # Unique pin coordinates (path, not blob centers)
    pts = {
        1: (0.50, 0.995),
        2: (0.36, 0.87),
        3: (0.20, 0.76),
        4: (0.24, 0.63),
        5: (0.20, 0.55),
        6: (0.36, 0.38),
        7: (0.22, 0.16),
        8: (0.55, 0.16),  # Harry Potter (al lado de Nintendo)
        9: (0.84, 0.16),  # Flying Dinosaur
        10: (0.86, 0.28),
        11: (0.86, 0.66),
        12: (0.07, 0.70),  # Dream ride, offset from 3
        13: (0.70, 0.88),
        14: (0.07, 0.48),  # JAWS, offset from 5
        15: (0.68, 0.995),
    }

    def draw_path(keys, color, width):
        coords = [mp(*pts[k]) for k in keys]
        draw.line(coords, fill=color, width=width, joint="curve")
        r = max(6, width // 2 - 1)
        for x, y in coords:
            circle(draw, x, y, r, color)

    # evening then midday then morning so morning paints on top
    draw_path([11, 13, 12, 14, 15], (168, 132, 196), 12)
    draw_path([7, 8, 9, 10, 11], GOLD, 14)
    draw_path([1, 2, 3, 4, 5, 6, 7], ORANGE, 20)

    colors = {**{n: ORANGE for n in range(1, 8)}, **{n: GOLD for n in range(8, 12)}, **{n: PURPLE for n in range(12, 16)}}
    for n, p in pts.items():
        pin(draw, *mp(*p), n, colors[n], r=23)

    # star label
    sx, sy = mp(*pts[7])
    rounded_rect(draw, (sx + 30, sy - 48, sx + 250, sy - 14), 10, RED)
    draw.text((sx + 140, sy - 31), "★ META DE LA MAÑANA", font=font(F_BOLD, 16), fill=WHITE, anchor="mm")

    # north
    nx, ny = mp(0.08, 0.92)
    circle(draw, nx, ny, 34, NAVY)
    draw.text((nx, ny), "N", font=font(F_BOLD, 26), fill=WHITE, anchor="mm")
    draw.polygon([(nx, ny - 56), (nx - 9, ny - 36), (nx + 9, ny - 36)], fill=GOLD)

    # RIGHT legend: numbered stops
    lx0 = mx1 - legend_w - 6
    rounded_rect(draw, (lx0, my0 + 20, mx1 - 20, my1 - 20), 22, (10, 26, 34), outline=GOLD, width=3)
    draw.text((lx0 + 22, my0 + 36), "PARADAS", font=font(F_BOLD, 26), fill=GOLD)
    draw.text((lx0 + 22, my0 + 70), "Seguir los números en orden", font=font(F_REG, 18), fill=(180, 190, 200))

    stops = [
        (ORANGE, "1  Entrada · seguridad + QR"),
        (ORANGE, "2  Dosel: GIRAR A LA DERECHA"),
        (ORANGE, "3  Hollywood de largo"),
        (ORANGE, "4  Mel’s · NO Wonderland"),
        (ORANGE, "5  Amity / JAWS de largo"),
        (ORANGE, "6  WaterWorld por la derecha"),
        (ORANGE, "7  ★ Super Nintendo World"),
        (GOLD, "8  Harry Potter + almuerzo"),
        (GOLD, "9  The Flying Dinosaur"),
        (GOLD, "10 Jurassic Park The Ride"),
        (GOLD, "11 Minion Park / Nueva York"),
        (PURPLE, "12 Hollywood Dream"),
        (PURPLE, "13 Halloween · zombis"),
        (PURPLE, "14 JAWS al anochecer"),
        (PURPLE, "15 Tiendas y SALIDA"),
    ]
    yy = my0 + 108
    fnt_s = font(F_SEMI, 20)
    for col, label in stops:
        circle(draw, lx0 + 36, yy + 12, 8, col)
        draw.text((lx0 + 54, yy), label, font=fnt_s, fill=WHITE)
        yy += 42
        if label.startswith("7"):
            draw.line((lx0 + 24, yy - 8, mx1 - 40, yy - 8), fill=(48, 72, 86), width=2)
            yy += 6
        if label.startswith("11"):
            draw.line((lx0 + 24, yy - 8, mx1 - 40, yy - 8), fill=(48, 72, 86), width=2)
            yy += 6

    yy += 8
    draw.text((lx0 + 22, yy), "REGLA DE ORO", font=font(F_BOLD, 20), fill=RED)
    yy += 32
    h = draw_wrapped(
        draw,
        lx0 + 22,
        yy,
        "Si entran a Nintendo, no salgan hasta Mario Kart, Mine Cart Madness y Yoshi. La reentrada no está garantizada.",
        font(F_REG, 18),
        (230, 220, 210),
        legend_w - 60,
        1.28,
    )
    yy += h + 28
    draw.text((lx0 + 22, yy), "FRASE PARA NO PERDERSE", font=font(F_BOLD, 18), fill=GOLD)
    yy += 30
    draw_wrapped(
        draw,
        lx0 + 22,
        yy,
        "«Derecha en el dosel, derecha en Mel’s, izquierda en vez de Wonderland, tubería a la derecha de WaterWorld.»",
        font(F_REG, 18),
        (230, 220, 210),
        legend_w - 60,
        1.28,
    )
    yy += 110
    draw.text((lx0 + 22, yy), "APP + PASE", font=font(F_BOLD, 18), fill=GOLD)
    yy += 30
    draw_wrapped(
        draw,
        lx0 + 22,
        yy,
        "Registrar el QR en la app la noche anterior. En el torniquete, una persona pide el Area Timed Entry de Super Nintendo World por si el walk-in ya cerró.",
        font(F_REG, 18),
        (230, 220, 210),
        legend_w - 60,
        1.28,
    )

    # Sprint steps
    y = 2880
    draw.text((MARGIN, y), "Los 7 pasos del sprint (no improvisar aquí)", font=font(F_BOLD, 30), fill=NAVY)
    y += 40
    steps = [
        ("1", "Seguridad + QR", "Bandeja lista. Nada de fotos en CityWalk ni en el arco."),
        ("2", "Dosel: DERECHA", "Tras el torniquete, bajo el canopy, girar a la derecha."),
        ("3", "Hollywood de largo", "Hollywood Dream queda a la izquierda. No montar ahora."),
        ("4", "Mel’s Drive-In", "Otra derecha. NO entrar a Wonderland: seguir por la izquierda."),
        ("5", "Amity / JAWS", "Cruzar el pueblo. JAWS se deja para el atardecer."),
        ("6", "WaterWorld", "La tubería de Nintendo está a la DERECHA del show."),
        ("7", "Tubería warp", "Si no hay control, entrar. Si hay, abrir la app al instante."),
        ("✓", "Kit de mañana", "App USJ con pase registrado, QR, batería, agua, desayuno ya comido. Una persona maneja la app."),
    ]
    gap = 16
    col_w = (W - 2 * MARGIN - gap) / 2
    for i, (num, title, desc) in enumerate(steps):
        col, row = i % 2, i // 2
        x = MARGIN + col * (col_w + gap)
        yy = y + row * 102
        fill_circle = TEAL if num == "✓" else RED
        rounded_rect(draw, (x, yy, x + col_w, yy + 92), 14, WHITE)
        circle(draw, x + 36, yy + 46, 22, fill_circle)
        draw.text((x + 36, yy + 47), num, font=font(F_BOLD, 24), fill=WHITE, anchor="mm")
        draw.text((x + 70, yy + 12), title, font=font(F_SEMI, 22), fill=NAVY)
        draw_wrapped(draw, x + 70, yy + 44, desc, font(F_REG, 19), MUTED, col_w - 92, 1.2)

    draw_footer(draw, "JR Universal City → CityWalk → arco USJ. Caminata a Nintendo ≈ 700 m. Sin reentrada al salir del parque.")
    return img


# ---------------------------------------------------------------------------
# PAGE 2
# ---------------------------------------------------------------------------
def page2() -> Image.Image:
    img = Image.new("RGB", (W, H), CREAM)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "Página 2 de 2  ·  Horario y recomendaciones")

    y = 276
    draw.text((MARGIN, y), "Cómo entrar a Super Nintendo World sin Express Pass", font=font(F_BOLD, 34), fill=NAVY)
    y += 50

    plans = [
        (RED, "PLAN A  ·  Walk-in",
         "Si al llegar a la tubería no hay control de aforo, entren ya. Es el premio por llegar temprano. Un domingo de Halloween no está garantizado."),
        (ORANGE, "PLAN B  ·  App gratis",
         "Si ya hay control: Area Timed Entry en la app, todo el grupo junto. Pedir el cupo más temprano. Los pases se acaban en minutos."),
        (PURPLE, "PLAN C  ·  Standby",
         "Si no hay Timed Entry, tomar Standby Entry (sorteo; no garantiza). Mientras tanto, Flying Dinosaur y Harry Potter."),
    ]
    pw = (W - 2 * MARGIN - 28) / 3
    for i, (col, title, body) in enumerate(plans):
        x = MARGIN + i * (pw + 14)
        rounded_rect(draw, (x, y, x + pw, y + 228), 18, WHITE, outline=col, width=4)
        draw.rectangle((x, y, x + pw, y + 8), fill=col)
        draw.text((x + 18, y + 22), title, font=font(F_BOLD, 24), fill=col)
        draw_wrapped(draw, x + 18, y + 64, body, font(F_REG, 21), INK, pw - 36, 1.28)

    y += 250
    draw.text((MARGIN, y), "Horario recomendado  ·  11 oct 2026", font=font(F_BOLD, 32), fill=NAVY)
    y += 44

    blocks = [
        (RED, "06:30", "Fila en la entrada",
         "60–90 min antes de las 08:00. QR a mano (brillo alto o impreso). Baño en la estación, no en CityWalk. Una persona con la app USJ abierta y el Studio Pass ya registrado."),
        (RED, "07:30–08:00", "Apertura (puede adelantarse)",
         "En cuanto escaneen: cero fotos, cero tiendas. Girar a la derecha (ruta 1→7). Mientras caminan, la app pide el Timed Entry por si el walk-in ya cerró."),
        (RED, "08:00–11:00", "7  Super Nintendo World ★",
         "Orden: Mine Cart Madness (Donkey Kong, Single Rider) → Mario Kart: Koopa’s Challenge (Single Rider) → Yoshi’s Adventure → fotos / Power-Up Band (opcional). Snack aquí. No salir hasta terminar lo esencial."),
        (ORANGE, "11:00–12:45", "8  Harry Potter + almuerzo",
         "Está al lado de Nintendo. Forbidden Journey (Single Rider), Hippogriff y mantequilla de cerveza. Comer en Three Broomsticks. Si Forbidden Journey > 60 min, ir primero a 9 Flying Dinosaur y volver."),
        (ORANGE, "12:45–14:00", "9  The Flying Dinosaur",
         "Montaña más intensa del parque (132–198 cm). Single Rider. Locker de metal. Si standby > ~80 min y hay Single Rider, usarlo."),
        (GOLD, "14:00–15:30", "10  Jurassic Park The Ride",
         "Se mojan, sobre todo atrás. Poncho o ropa de recambio. Mirar en la app si WaterWorld tiene show: queda al lado de Nintendo/Amity."),
        (TEAL, "15:30–17:15", "11  Minion Park y Nueva York",
         "Minion Mayhem (Single Rider) y fotos. Ritmo más lento. Si hay Timed Entry de mazmorras de Halloween en la app, pedirlo ahora."),
        (PURPLE, "17:15–19:00", "12  Hollywood Dream",
         "De frente: Single Rider. Backdrop (atrás) no tiene Single Rider. Hoy empieza el overlay Ado «Show» × Hollywood Dream."),
        (PURPLE, "19:00–21:00", "13  Halloween Horror Nights",
         "Zombis en la calle y Zombie de Dance van con el Studio Pass. Mazmorras cerradas pueden pedir Timed Entry gratis. Lights Out: Nightmare Isolation (R-18) es boleto aparte. Si no quieren sustos, eviten scare zones."),
        (PURPLE, "21:00–21:40", "14  JAWS al anochecer",
         "Volver a Amity. Single Rider. De noche se ve mejor. Filas naranjas/rojas = más agua."),
        (NAVY, "21:40–22:00", "15  Tiendas y salida",
         "Souvenirs en Hollywood al final. El pase NO permite reentrar. Confirmar el último tren de JR Universal City / Sakurajima."),
    ]

    row_h = 168
    for i, (col, time, title, body) in enumerate(blocks):
        yy = y + i * row_h
        rounded_rect(draw, (MARGIN, yy, W - MARGIN, yy + row_h - 10), 16, WHITE)
        draw.rectangle((MARGIN, yy, MARGIN + 12, yy + row_h - 10), fill=col)
        draw.text((MARGIN + 32, yy + 12), time, font=font(F_BOLD, 24), fill=col)
        draw.text((MARGIN + 250, yy + 12), title, font=font(F_SEMI, 24), fill=NAVY)
        draw_wrapped(draw, MARGIN + 32, yy + 48, body, font(F_REG, 21), INK, W - 2 * MARGIN - 60, 1.25)

    # recs
    y = y + len(blocks) * row_h + 6
    rounded_rect(draw, (MARGIN, y, W - MARGIN, H - 96), 16, NAVY2)
    draw.text((MARGIN + 24, y + 14), "Recomendaciones", font=font(F_BOLD, 26), fill=GOLD)
    recs = [
        "App oficial USJ: instalar la noche anterior y registrar el QR. Una sola persona opera la app en el torniquete.",
        "Single Rider (se separan): Mine Cart, Mario Kart, Forbidden Journey, Flying Dinosaur, Jurassic Park The Ride, JAWS, Minion Mayhem, Hollywood Dream de frente. No hay en Yoshi ni en Backdrop.",
        "Space Fantasy está cerrado de forma indefinida desde 2025: no contar con esa atracción.",
        "Power-Up Band es opcional. Casillero en la entrada solo si la mochila es enorme: pierde minutos del sprint. Desayunar antes de entrar.",
        "El Studio Pass cubre el parque y el Halloween de calle. No cubre Express Pass ni el extra R-18. Boleto válido solo el 11 oct 2026; no reembolsable.",
        "Confirmar horario real la mañana del 11 en Today’s Park Info. Llevar batería extra: la app es el plan B si Nintendo ya tiene control de aforo.",
        "Si van en grupo: pactar «tras el torniquete no nos separamos hasta la tubería». Perderse bajo el canopy cuesta el walk-in.",
    ]
    yy = y + 50
    for r in recs:
        draw.text((MARGIN + 24, yy), "▸", font=font(F_BOLD, 22), fill=GOLD)
        h = draw_wrapped(draw, MARGIN + 52, yy, r, font(F_REG, 20), (230, 220, 210), W - 2 * MARGIN - 80, 1.22)
        yy += h + 6

    draw_footer(draw, "Confirmar el 11 oct en la app: Today’s Park Info, cierres y horarios de shows.")
    return img


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    p1, p2 = page1(), page2()
    png1 = OUT / "USJ-itinerario-11oct2026-pagina1-mapa.png"
    png2 = OUT / "USJ-itinerario-11oct2026-pagina2-horario.png"
    p1.save(png1, "PNG", dpi=(300, 300))
    p2.save(png2, "PNG", dpi=(300, 300))
    print("saved", png1)
    print("saved", png2)


if __name__ == "__main__":
    main()
