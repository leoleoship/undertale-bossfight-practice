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


def shirt_panel(draw, x1, y1, x2, y2, base=BLACK, trim=WHITE):
    rect(draw, (x1, y1, x2, y2), trim)
    rect(draw, (x1 + 5, y1 + 4, x2 - 5, y2 - 4), base)


def chest_heart(draw, cx, cy, color=RED):
    rect(draw, (cx - 7, cy - 4, cx + 7, cy + 7), color)
    rect(draw, (cx - 4, cy - 8, cx + 4, cy - 2), color)
    rect(draw, (cx - 2, cy + 8, cx + 2, cy + 12), color)


def face_line(draw, cx, cy, width=18):
    rect(draw, (cx - width // 2, cy, cx + width // 2, cy + 2), BLACK)
    rect(draw, (cx - width // 2 + 3, cy + 3, cx - width // 2 + 6, cy + 5), BLACK)
    rect(draw, (cx + width // 2 - 6, cy + 3, cx + width // 2 - 3, cy + 5), BLACK)


def sans():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    skull(d, 80, 31, 1, BLUE, True)
    rect(d, (70, 42, 90, 44), BLACK)
    for x in range(72, 89, 5):
        rect(d, (x, 42, x + 1, 48), BLACK)
    line(d, [(49, 55), (39, 83), (48, 105)], WHITE, 5)
    line(d, [(111, 55), (121, 83), (112, 105)], WHITE, 5)
    rect(d, (45, 54, 115, 98), WHITE)
    rect(d, (54, 58, 106, 94), BLACK)
    rect(d, (48, 55, 65, 96), BLUE)
    rect(d, (95, 55, 112, 96), BLUE)
    rect(d, (70, 57, 90, 98), WHITE)
    rect(d, (75, 60, 85, 92), BLACK)
    rect(d, (78, 60, 82, 67), WHITE)
    rect(d, (78, 83, 82, 92), WHITE)
    line(d, [(68, 58), (68, 95)], WHITE, 1)
    line(d, [(92, 58), (92, 95)], WHITE, 1)
    rect(d, (57, 64, 68, 79), WHITE)
    rect(d, (92, 64, 103, 79), WHITE)
    rect(d, (54, 79, 70, 91), WHITE)
    rect(d, (90, 79, 106, 91), WHITE)
    rect(d, (59, 82, 68, 91), BLACK)
    rect(d, (92, 82, 101, 91), BLACK)
    rect(d, (62, 94, 75, 116), WHITE)
    rect(d, (85, 94, 98, 116), WHITE)
    rect(d, (63, 99, 75, 112), BLACK)
    rect(d, (85, 99, 97, 112), BLACK)
    rect(d, (49, 116, 76, 123), WHITE)
    rect(d, (84, 116, 111, 123), WHITE)
    rect(d, (50, 112, 77, 117), BLACK)
    rect(d, (83, 112, 110, 117), BLACK)
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
    skull(d, 80, 24, 1, BLACK)
    rect(d, (68, 35, 92, 37), BLACK)
    for x in range(70, 91, 5):
        rect(d, (x, 35, x + 1, 41), BLACK)
    line(d, [(76, 8), (124, 2), (137, 10)], YELLOW, 2)
    rect(d, (50, 43, 110, 56), RED)
    rect(d, (43, 55, 117, 68), WHITE)
    rect(d, (50, 66, 110, 93), WHITE)
    shirt_panel(d, 57, 67, 103, 93, BLACK, WHITE)
    rect(d, (66, 70, 94, 83), WHITE)
    rect(d, (72, 73, 88, 82), BLACK)
    rect(d, (70, 58, 90, 63), RED)
    line(d, [(52, 45), (96, 66)], RED, 5)
    line(d, [(108, 44), (69, 66)], RED, 4)
    rect(d, (55, 55, 65, 67), RED)
    rect(d, (95, 55, 105, 67), RED)
    line(d, [(50, 60), (31, 93), (17, 120)], WHITE, 4)
    line(d, [(110, 60), (130, 90), (145, 121)], WHITE, 4)
    line(d, [(29, 105), (8, 102)], WHITE, 4)
    line(d, [(130, 110), (152, 101)], WHITE, 4)
    rect(d, (62, 90, 74, 123), WHITE)
    rect(d, (86, 90, 98, 123), WHITE)
    rect(d, (63, 100, 74, 118), BLACK)
    rect(d, (86, 100, 97, 118), BLACK)
    rect(d, (46, 121, 75, 128), WHITE)
    rect(d, (85, 121, 114, 128), WHITE)
    spear(d, 25, 118, 132, 20, WHITE)
    save(img, "disbelief")


def undyne(name="undyne", undying=False):
    img = new_canvas()
    d = ImageDraw.Draw(img)
    color = GREEN if undying else BLUE
    armor = GREEN if undying else DEEP_BLUE
    poly(d, [(53, 10), (79, 0), (104, 8), (119, 27), (105, 51), (78, 58), (52, 44)], WHITE)
    rect(d, (57, 20, 70, 30), BLACK)
    rect(d, (86, 21, 103, 31), BLACK)
    rect(d, (55, 18, 71, 24), WHITE)
    rect(d, (61, 23, 66, 28), color)
    rect(d, (91, 23, 99, 29), BLACK)
    line(d, [(62, 43), (78, 49), (96, 42)], BLACK, 2)
    rect(d, (71, 52, 87, 55), BLACK)
    line(d, [(54, 11), (27, 0), (12, 5), (32, 16)], color, 3)
    line(d, [(49, 17), (11, 24), (0, 34)], color, 3)
    line(d, [(104, 18), (129, 8), (142, 19), (111, 44)], WHITE, 3)
    line(d, [(38, 63), (80, 48), (122, 63)], WHITE, 5)
    poly(d, [(44, 63), (116, 63), (105, 107), (80, 121), (55, 107)], armor)
    rect(d, (62, 74, 98, 96), BLACK)
    rect(d, (69, 76, 91, 91), color)
    rect(d, (76, 76, 84, 96), BLACK)
    rect(d, (66, 98, 94, 104), WHITE)
    rect(d, (76, 99, 84, 113), armor)
    line(d, [(57, 69), (103, 69)], WHITE, 2)
    line(d, [(80, 63), (80, 114)], WHITE, 2)
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
    rect(d, (55, 39, 105, 59), GOLD)
    rect(d, (64, 27, 75, 35), BLACK)
    rect(d, (85, 27, 96, 35), BLACK)
    rect(d, (68, 47, 92, 52), BLACK)
    line(d, [(68, 43), (80, 49), (92, 43)], BLACK, 2)
    rect(d, (58, 54, 102, 63), WHITE)
    rect(d, (67, 56, 93, 60), BLACK)
    line(d, [(27, 69), (57, 54), (103, 54), (133, 69)], WHITE, 5)
    poly(d, [(32, 70), (128, 70), (113, 121), (80, 129), (47, 121)], WHITE)
    shirt_panel(d, 56, 74, 104, 116, BLACK, WHITE)
    line(d, [(65, 80), (95, 80)], GOLD, 2)
    chest_heart(d, 80, 95, GOLD)
    line(d, [(56, 74), (80, 121), (104, 74)], GOLD, 2)
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
    rect(d, (36, 5, 124, 29), WHITE)
    rect(d, (57, 0, 103, 13), WHITE)
    rect(d, (49, 11, 111, 24), BLACK)
    rect(d, (55, 14, 63, 20), RED)
    rect(d, (77, 14, 85, 20), RED)
    rect(d, (97, 14, 105, 20), RED)
    rect(d, (69, 5, 91, 11), BLACK)
    draw_omega_face(d, 80, 49)
    for x, y in [(24, 42), (136, 42), (40, 69), (120, 69), (80, 31)]:
        draw_eye(d, x, y)
    for pts in [
        [(26, 55), (4, 86), (9, 129)],
        [(134, 55), (156, 86), (151, 129)],
        [(45, 83), (12, 110), (40, 129)],
        [(115, 83), (148, 110), (120, 129)],
        [(62, 99), (43, 129)],
        [(98, 99), (117, 129)],
        [(33, 32), (8, 20), (2, 45)],
        [(127, 32), (152, 20), (158, 45)],
    ]:
        line(d, pts, GREEN, 5)
    for x, y in [(52, 88), (108, 88), (38, 112), (122, 112)]:
        poly(d, [(x, y - 12), (x + 13, y), (x, y + 12), (x - 13, y)], GREEN)
    rect(d, (58, 70, 102, 123), ORANGE)
    rect(d, (69, 82, 91, 112), BLACK)
    rect(d, (74, 75, 86, 82), YELLOW)
    line(d, [(61, 72), (99, 72)], YELLOW, 2)
    line(d, [(54, 120), (106, 120)], ORANGE, 4)
    save(img, "omega")


def draw_omega_face(draw, cx, cy):
    draw.ellipse((cx - 40, cy - 28, cx + 40, cy + 25), fill=WHITE)
    rect(draw, (cx - 26, cy - 8, cx - 13, cy + 4), BLACK)
    rect(draw, (cx + 13, cy - 8, cx + 26, cy + 4), BLACK)
    line(draw, [(cx - 19, cy + 16), (cx, cy + 7), (cx + 19, cy + 16)], BLACK, 3)
    rect(draw, (cx - 5, cy + 5, cx + 5, cy + 10), BLACK)


def draw_eye(draw, cx, cy):
    draw.ellipse((cx - 13, cy - 9, cx + 13, cy + 9), fill=WHITE)
    draw.ellipse((cx - 6, cy - 6, cx + 6, cy + 6), fill=BLACK)


def asriel():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    line(d, [(56, 18), (34, 0), (42, 36)], WHITE, 3)
    line(d, [(104, 18), (126, 0), (118, 36)], WHITE, 3)
    poly(d, [(50, 23), (65, 10), (95, 10), (110, 23), (101, 46), (80, 55), (59, 46)], WHITE)
    rect(d, (65, 26, 76, 34), BLACK)
    rect(d, (84, 26, 95, 34), BLACK)
    rect(d, (72, 44, 88, 48), BLACK)
    line(d, [(69, 41), (80, 48), (91, 41)], BLACK, 2)
    rect(d, (72, 51, 88, 54), BLACK)
    poly(d, [(43, 58), (5, 74), (32, 91), (13, 113), (58, 87)], WHITE)
    poly(d, [(117, 58), (155, 74), (128, 91), (147, 113), (102, 87)], WHITE)
    line(d, [(37, 59), (123, 59)], WHITE, 5)
    poly(d, [(45, 60), (115, 60), (106, 118), (80, 128), (54, 118)], PURPLE)
    shirt_panel(d, 63, 68, 97, 102, BLACK, PURPLE)
    poly(d, [(69, 72), (80, 104), (91, 72), (80, 62)], WHITE)
    rect(d, (70, 75, 90, 82), RED)
    rect(d, (73, 84, 87, 93), BLUE)
    rect(d, (66, 66, 94, 70), WHITE)
    line(d, [(63, 68), (80, 104), (97, 68)], WHITE, 2)
    line(d, [(63, 64), (46, 104)], WHITE, 2)
    line(d, [(97, 64), (114, 104)], WHITE, 2)
    line(d, [(41, 86), (21, 123)], WHITE, 3)
    line(d, [(119, 86), (139, 123)], WHITE, 3)
    save(img, "asriel")


def mettaton():
    img = new_canvas()
    d = ImageDraw.Draw(img)
    poly(d, [(59, 3), (96, 3), (116, 20), (111, 44), (82, 53), (51, 44), (43, 21)], WHITE)
    poly(d, [(59, 4), (34, 0), (18, 16), (44, 17), (54, 9)], HAIR)
    rect(d, (62, 24, 74, 32), BLACK)
    rect(d, (87, 24, 99, 32), BLACK)
    rect(d, (69, 39, 97, 43), BLACK)
    line(d, [(65, 38), (83, 44), (102, 36)], BLACK, 2)
    rect(d, (72, 45, 96, 48), BLACK)
    line(d, [(18, 61), (56, 55), (104, 55), (142, 61)], WHITE, 4)
    rect(d, (48, 57, 112, 67), PINK)
    poly(d, [(53, 66), (107, 66), (102, 104), (80, 118), (58, 104)], WHITE)
    shirt_panel(d, 63, 70, 97, 103, BLACK, WHITE)
    d.ellipse((67, 73, 93, 99), fill=PINK)
    rect(d, (73, 79, 87, 93), WHITE)
    rect(d, (76, 82, 84, 90), PINK)
    rect(d, (57, 66, 103, 70), PINK)
    line(d, [(64, 70), (80, 118), (96, 70)], PINK, 2)
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
