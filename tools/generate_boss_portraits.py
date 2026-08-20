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
HAIR = (17, 17, 24, 255)


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
    line(d, [(52, 56), (42, 84), (50, 103)], WHITE, 4)
    line(d, [(108, 56), (118, 84), (110, 103)], WHITE, 4)
    rect(d, (52, 57, 108, 96), WHITE)
    rect(d, (62, 61, 98, 92), BLACK)
    rect(d, (55, 57, 64, 93), BLUE)
    rect(d, (96, 57, 105, 93), BLUE)
    rect(d, (75, 58, 85, 94), WHITE)
    rect(d, (49, 78, 64, 91), WHITE)
    rect(d, (96, 78, 111, 91), WHITE)
    rect(d, (57, 82, 67, 92), BLACK)
    rect(d, (93, 82, 103, 92), BLACK)
    rect(d, (62, 93, 73, 114), WHITE)
    rect(d, (87, 93, 98, 114), WHITE)
    rect(d, (63, 96, 73, 110), BLACK)
    rect(d, (87, 96, 97, 110), BLACK)
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
    rect(d, (61, 47, 99, 57), RED)
    rect(d, (45, 56, 115, 66), WHITE)
    rect(d, (52, 65, 108, 88), WHITE)
    rect(d, (60, 64, 100, 92), BLACK)
    rect(d, (64, 67, 96, 87), WHITE)
    rect(d, (71, 70, 89, 83), BLACK)
    line(d, [(51, 60), (33, 92), (20, 117)], WHITE, 3)
    line(d, [(109, 60), (128, 88), (142, 119)], WHITE, 3)
    line(d, [(31, 105), (10, 102)], WHITE, 3)
    line(d, [(131, 110), (151, 102)], WHITE, 3)
    rect(d, (63, 90, 73, 122), WHITE)
    rect(d, (87, 90, 97, 122), WHITE)
    rect(d, (63, 99, 73, 117), BLACK)
    rect(d, (87, 99, 97, 117), BLACK)
    rect(d, (50, 120, 74, 126), WHITE)
    rect(d, (86, 120, 110, 126), WHITE)
    save(img, "disbelief")


def undyne(name="undyne", undying=False):
    img = new_canvas()
    d = ImageDraw.Draw(img)
    color = GREEN if undying else BLUE
    armor = GREEN if undying else DEEP_BLUE
    poly(d, [(53, 10), (79, 0), (104, 8), (119, 27), (105, 51), (78, 58), (52, 44)], WHITE)
    rect(d, (57, 20, 69, 29), BLACK)
    rect(d, (88, 22, 102, 30), BLACK)
    rect(d, (54, 19, 70, 25), WHITE)
    line(d, [(54, 11), (27, 0), (12, 5), (32, 16)], color, 3)
    line(d, [(49, 17), (11, 24), (0, 34)], color, 3)
    line(d, [(104, 18), (129, 8), (142, 19), (111, 44)], WHITE, 3)
    line(d, [(38, 63), (80, 48), (122, 63)], WHITE, 5)
    poly(d, [(48, 64), (112, 64), (102, 105), (80, 118), (58, 105)], armor)
    rect(d, (66, 76, 94, 91), BLACK)
    line(d, [(60, 69), (100, 69)], WHITE, 2)
    line(d, [(80, 63), (80, 111)], WHITE, 2)
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
    line(d, [(58, 23), (25, 0), (33, 47)], GOLD, 5)
    line(d, [(102, 23), (135, 0), (127, 47)], GOLD, 5)
    poly(d, [(45, 24), (62, 8), (98, 8), (115, 24), (106, 51), (80, 63), (54, 51)], WHITE)
    rect(d, (57, 40, 103, 57), GOLD)
    rect(d, (65, 27, 74, 34), BLACK)
    rect(d, (86, 27, 95, 34), BLACK)
    line(d, [(70, 43), (80, 48), (90, 43)], BLACK, 2)
    line(d, [(27, 69), (57, 54), (103, 54), (133, 69)], WHITE, 5)
    poly(d, [(35, 70), (125, 70), (111, 120), (80, 129), (49, 120)], WHITE)
    rect(d, (58, 75, 102, 114), BLACK)
    poly(d, [(52, 72), (20, 126), (55, 122)], WHITE)
    poly(d, [(108, 72), (140, 126), (105, 122)], WHITE)
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
    rect(d, (38, 6, 122, 28), WHITE)
    rect(d, (58, 0, 102, 12), WHITE)
    rect(d, (50, 11, 110, 23), BLACK)
    rect(d, (55, 14, 63, 19), RED)
    rect(d, (77, 14, 85, 19), RED)
    rect(d, (96, 14, 104, 19), RED)
    draw_omega_face(d, 80, 47)
    for x, y in [(25, 42), (135, 42), (42, 68), (118, 68)]:
        draw_eye(d, x, y)
    for pts in [
        [(26, 55), (5, 87), (10, 128)],
        [(134, 55), (155, 87), (150, 128)],
        [(46, 84), (14, 112), (42, 128)],
        [(114, 84), (146, 112), (118, 128)],
        [(62, 101), (45, 128)],
        [(98, 101), (115, 128)],
    ]:
        line(d, pts, GREEN, 5)
    for x, y in [(52, 88), (108, 88), (38, 112), (122, 112)]:
        poly(d, [(x, y - 12), (x + 13, y), (x, y + 12), (x - 13, y)], GREEN)
    rect(d, (61, 73, 99, 122), ORANGE)
    rect(d, (71, 84, 89, 112), BLACK)
    line(d, [(54, 120), (106, 120)], ORANGE, 4)
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
    line(d, [(37, 59), (123, 59)], WHITE, 5)
    poly(d, [(47, 61), (113, 61), (104, 117), (80, 127), (56, 117)], PURPLE)
    poly(d, [(70, 72), (80, 103), (90, 72), (80, 63)], WHITE)
    line(d, [(63, 64), (46, 104)], WHITE, 2)
    line(d, [(97, 64), (114, 104)], WHITE, 2)
    line(d, [(41, 86), (21, 123)], WHITE, 3)
    line(d, [(119, 86), (139, 123)], WHITE, 3)
    save(img, "asriel")


def mettaton():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    poly(d, [(59, 3), (96, 3), (116, 20), (111, 44), (82, 53), (51, 44), (43, 21)], WHITE)
    poly(d, [(58, 4), (33, 1), (20, 17), (44, 16)], HAIR)
    rect(d, (63, 25, 73, 32), BLACK)
    rect(d, (88, 25, 98, 32), BLACK)
    line(d, [(66, 40), (84, 43), (101, 37)], BLACK, 2)
    line(d, [(18, 61), (56, 55), (104, 55), (142, 61)], WHITE, 4)
    rect(d, (48, 57, 112, 67), PINK)
    poly(d, [(55, 66), (105, 66), (101, 102), (80, 116), (59, 102)], WHITE)
    d.ellipse((67, 73, 93, 99), fill=PINK)
    rect(d, (72, 78, 88, 94), WHITE)
    line(d, [(50, 73), (17, 117)], WHITE, 3)
    line(d, [(110, 73), (143, 117)], WHITE, 3)
    line(d, [(65, 101), (43, 126)], WHITE, 4)
    line(d, [(95, 101), (117, 126)], WHITE, 4)
    rect(d, (33, 123, 68, 129), WHITE)
    rect(d, (92, 123, 127, 129), WHITE)
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
