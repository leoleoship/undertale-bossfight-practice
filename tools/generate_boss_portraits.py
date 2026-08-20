from pathlib import Path

from PIL import Image, ImageDraw


OUT = Path(__file__).resolve().parents[1] / "assets" / "bosses"
SCALE = 4
W, H = 160, 130

WHITE = (255, 255, 255, 255)
BLACK = (5, 5, 7, 255)
BLUE = (87, 214, 255, 255)
DEEP_BLUE = (47, 141, 228, 255)
GREEN = (128, 237, 153, 255)
GOLD = (246, 210, 138, 255)
YELLOW = (255, 209, 102, 255)
RED = (255, 56, 85, 255)
PINK = (255, 139, 209, 255)
PURPLE = (199, 125, 255, 255)
ORANGE = (255, 122, 26, 255)
GRAY = (138, 143, 153, 255)
TRANSPARENT = (0, 0, 0, 0)


def new_canvas():
    return Image.new("RGBA", (W, H), TRANSPARENT)


def save(img, name):
    OUT.mkdir(parents=True, exist_ok=True)
    bbox = img.getbbox()
    if bbox:
        pad = 4
        left = max(0, bbox[0] - pad)
        top = max(0, bbox[1] - pad)
        right = min(img.width, bbox[2] + pad)
        bottom = min(img.height, bbox[3] + pad)
        img = img.crop((left, top, right, bottom))
    img = img.resize((img.width * SCALE, img.height * SCALE), Image.Resampling.NEAREST)
    img.save(OUT / f"{name}.png")


def rect(draw, xy, color=WHITE):
    draw.rectangle(xy, fill=color)


def line(draw, points, color=WHITE, width=2):
    draw.line(points, fill=color, width=width, joint="curve")


def poly(draw, points, color=WHITE):
    draw.polygon(points, fill=color)


def skull(draw, cx, cy, scale=1, eye=BLACK, wink=False):
    s = scale
    draw.ellipse((cx - 18 * s, cy - 21 * s, cx + 18 * s, cy + 15 * s), fill=WHITE)
    rect(draw, (cx - 13 * s, cy + 5 * s, cx + 13 * s, cy + 21 * s), WHITE)
    draw.rectangle((cx - 11 * s, cy - 7 * s, cx - 4 * s, cy), fill=BLACK)
    draw.rectangle((cx + 4 * s, cy - 7 * s, cx + 11 * s, cy), fill=eye if wink else BLACK)
    poly(draw, [(cx, cy + 1 * s), (cx - 4 * s, cy + 8 * s), (cx + 4 * s, cy + 8 * s)], BLACK)
    rect(draw, (cx - 12 * s, cy + 13 * s, cx + 12 * s, cy + 15 * s), BLACK)
    for x in range(-9, 10, 6):
        rect(draw, (cx + x * s, cy + 13 * s, cx + (x + 2) * s, cy + 20 * s), BLACK)


def sans():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    skull(d, 80, 34, 1, BLUE, True)
    rect(d, (54, 57, 106, 93), WHITE)
    rect(d, (62, 61, 98, 91), BLACK)
    rect(d, (55, 57, 64, 93), BLUE)
    rect(d, (96, 57, 105, 93), BLUE)
    rect(d, (49, 60, 58, 91), WHITE)
    rect(d, (102, 60, 111, 91), WHITE)
    rect(d, (62, 93, 73, 114), WHITE)
    rect(d, (87, 93, 98, 114), WHITE)
    rect(d, (50, 114, 75, 120), WHITE)
    rect(d, (85, 114, 110, 120), WHITE)
    line(d, [(18, 101), (138, 101)], WHITE, 3)
    for x in range(20, 134, 14):
        rect(d, (x, 96, x + 9, 106), WHITE)
    blaster(d, 126, 36, 1)
    save(img, "sans")


def blaster(draw, cx, cy, scale=1):
    s = scale
    rect(draw, (cx - 16 * s, cy - 10 * s, cx + 8 * s, cy + 9 * s), WHITE)
    rect(draw, (cx - 19 * s, cy - 3 * s, cx - 13 * s, cy + 7 * s), WHITE)
    rect(draw, (cx - 8 * s, cy - 3 * s, cx - 4 * s, cy + 1 * s), BLACK)
    rect(draw, (cx + 2 * s, cy - 3 * s, cx + 6 * s, cy + 1 * s), BLACK)
    rect(draw, (cx + 8 * s, cy - 14 * s, cx + 22 * s, cy - 7 * s), WHITE)
    rect(draw, (cx + 8 * s, cy + 6 * s, cx + 22 * s, cy + 13 * s), WHITE)
    rect(draw, (cx + 20 * s, cy - 8 * s, cx + 27 * s, cy + 7 * s), WHITE)


def papyrus():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    skull(d, 80, 26, 1, BLACK)
    line(d, [(76, 10), (128, 3), (135, 9)], YELLOW, 2)
    rect(d, (64, 48, 96, 58), RED)
    rect(d, (49, 56, 111, 85), WHITE)
    rect(d, (60, 62, 100, 90), BLACK)
    rect(d, (63, 64, 97, 86), WHITE)
    rect(d, (70, 68, 90, 82), BLACK)
    line(d, [(50, 58), (35, 92), (20, 117)], WHITE, 3)
    line(d, [(110, 58), (128, 88), (142, 119)], WHITE, 3)
    line(d, [(31, 105), (10, 102)], WHITE, 3)
    rect(d, (63, 90, 73, 122), WHITE)
    rect(d, (87, 90, 97, 122), WHITE)
    rect(d, (50, 120, 74, 126), WHITE)
    rect(d, (86, 120, 110, 126), WHITE)
    save(img, "disbelief")


def undyne(name="undyne", undying=False):
    img = new_canvas()
    d = ImageDraw.Draw(img)
    color = GREEN if undying else BLUE
    armor = GREEN if undying else DEEP_BLUE
    poly(d, [(56, 12), (79, 3), (101, 10), (116, 28), (104, 49), (78, 55), (55, 43)], WHITE)
    rect(d, (58, 20, 69, 28), BLACK)
    rect(d, (88, 22, 101, 29), BLACK)
    line(d, [(54, 13), (29, 3), (18, 7)], color, 3)
    line(d, [(103, 18), (128, 9), (139, 20), (111, 42)], WHITE, 3)
    line(d, [(44, 62), (80, 48), (116, 62)], WHITE, 4)
    poly(d, [(51, 62), (109, 62), (101, 103), (80, 116), (59, 103)], armor)
    rect(d, (66, 76, 94, 91), BLACK)
    if undying:
        rect(d, (69, 72, 91, 88), RED)
        line(d, [(47, 73), (113, 73)], GREEN, 3)
    line(d, [(39, 66), (24, 102), (15, 124)], WHITE, 3)
    line(d, [(122, 63), (139, 101)], WHITE, 3)
    line(d, [(22, 102), (7, 101)], color, 3)
    line(d, [(32, 111), (4, 126)], color, 3)
    rect(d, (61, 103, 72, 126), WHITE)
    rect(d, (88, 103, 99, 126), WHITE)
    spear(d, 26, 110, 47, 24, color)
    save(img, name)


def spear(draw, x1, y1, x2, y2, color):
    line(draw, [(x1, y1), (x2, y2)], color, 2)
    poly(draw, [(x2, y2), (x2 - 7, y2 + 10), (x2 + 5, y2 + 7)], WHITE)


def asgore():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    line(d, [(58, 23), (31, 2), (37, 43)], GOLD, 4)
    line(d, [(102, 23), (129, 2), (123, 43)], GOLD, 4)
    poly(d, [(49, 24), (64, 10), (96, 10), (111, 24), (103, 49), (80, 59), (57, 49)], WHITE)
    rect(d, (65, 27, 74, 34), BLACK)
    rect(d, (86, 27, 95, 34), BLACK)
    line(d, [(70, 43), (80, 48), (90, 43)], BLACK, 2)
    line(d, [(30, 69), (58, 53), (102, 53), (130, 69)], WHITE, 5)
    poly(d, [(42, 70), (118, 70), (106, 118), (80, 127), (54, 118)], WHITE)
    rect(d, (58, 75, 102, 114), BLACK)
    line(d, [(80, 74), (80, 119)], YELLOW, 3)
    trident(d, 132, 65)
    save(img, "asgore")


def trident(draw, x, y):
    line(draw, [(x, y + 55), (x, y - 47)], YELLOW, 3)
    line(draw, [(x - 12, y - 28), (x - 12, y - 52)], YELLOW, 3)
    line(draw, [(x + 12, y - 28), (x + 12, y - 52)], YELLOW, 3)
    line(draw, [(x - 12, y - 28), (x, y - 42), (x + 12, y - 28)], YELLOW, 3)


def omega():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    rect(d, (40, 7, 120, 27), WHITE)
    rect(d, (58, 0, 102, 11), WHITE)
    draw_omega_face(d, 80, 43)
    draw_eye(d, 31, 41)
    draw_eye(d, 129, 41)
    line(d, [(31, 54), (8, 93), (12, 127)], GREEN, 5)
    line(d, [(129, 54), (152, 93), (148, 127)], GREEN, 5)
    line(d, [(51, 87), (18, 116), (43, 127)], GREEN, 5)
    line(d, [(109, 87), (142, 116), (117, 127)], GREEN, 5)
    rect(d, (62, 72, 98, 120), ORANGE)
    rect(d, (72, 86, 88, 111), BLACK)
    save(img, "omega")


def draw_omega_face(draw, cx, cy):
    draw.ellipse((cx - 40, cy - 28, cx + 40, cy + 25), fill=WHITE)
    rect(draw, (cx - 26, cy - 8, cx - 13, cy + 4), BLACK)
    rect(draw, (cx + 13, cy - 8, cx + 26, cy + 4), BLACK)
    line(draw, [(cx - 19, cy + 16), (cx, cy + 7), (cx + 19, cy + 16)], BLACK, 3)


def draw_eye(draw, cx, cy):
    draw.ellipse((cx - 13, cy - 9, cx + 13, cy + 9), fill=WHITE)
    draw.ellipse((cx - 6, cy - 6, cx + 6, cy + 6), fill=BLACK)


def asriel():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    line(d, [(56, 18), (34, 0), (42, 36)], WHITE, 3)
    line(d, [(104, 18), (126, 0), (118, 36)], WHITE, 3)
    poly(d, [(50, 23), (65, 10), (95, 10), (110, 23), (101, 46), (80, 55), (59, 46)], WHITE)
    rect(d, (66, 27, 75, 34), BLACK)
    rect(d, (85, 27, 94, 34), BLACK)
    line(d, [(70, 43), (80, 48), (90, 43)], BLACK, 2)
    poly(d, [(43, 58), (5, 74), (32, 91), (13, 113), (58, 87)], WHITE)
    poly(d, [(117, 58), (155, 74), (128, 91), (147, 113), (102, 87)], WHITE)
    poly(d, [(47, 61), (113, 61), (104, 117), (80, 127), (56, 117)], PURPLE)
    poly(d, [(71, 76), (80, 101), (89, 76), (80, 66)], WHITE)
    line(d, [(41, 86), (21, 123)], WHITE, 3)
    line(d, [(119, 86), (139, 123)], WHITE, 3)
    save(img, "asriel")


def mettaton():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    poly(d, [(67, 3), (101, 7), (115, 24), (108, 44), (82, 52), (54, 43), (46, 22)], WHITE)
    line(d, [(67, 3), (43, 0), (31, 14)], WHITE, 3)
    rect(d, (65, 25, 74, 31), BLACK)
    rect(d, (87, 25, 96, 31), BLACK)
    line(d, [(67, 39), (84, 42), (99, 37)], BLACK, 2)
    line(d, [(22, 60), (58, 54), (102, 54), (138, 60)], WHITE, 4)
    poly(d, [(55, 58), (105, 58), (101, 100), (80, 113), (59, 100)], WHITE)
    d.ellipse((69, 70, 91, 92), fill=PINK)
    line(d, [(52, 71), (17, 115)], WHITE, 3)
    line(d, [(108, 71), (143, 115)], WHITE, 3)
    line(d, [(66, 100), (51, 126)], WHITE, 4)
    line(d, [(94, 100), (109, 126)], WHITE, 4)
    rect(d, (42, 123, 67, 129), WHITE)
    rect(d, (93, 123, 118, 129), WHITE)
    save(img, "mettaton")


def btt():
    img = new_canvas()
    trio = ["disbelief", "sans", "undying"]
    offsets = [(4, 14), (53, 22), (104, 12)]
    for name, offset in zip(trio, offsets):
        part = Image.open(OUT / f"{name}.png").resize((64, 52), Image.Resampling.NEAREST)
        img.alpha_composite(part, offset)
    save(img, "btt")


if __name__ == "__main__":
    sans()
    papyrus()
    undyne("undyne", False)
    undyne("undying", True)
    asgore()
    omega()
    asriel()
    mettaton()
    btt()
