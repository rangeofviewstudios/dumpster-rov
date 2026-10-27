# Photoreal compositor: keys the green screens in plates/*.png, fits each screen's
# perspective quad, and warps real app screenshots onto it with scene-matched
# shading, glass sheen and grain. Run: python composite.py  -> renders/*.png
import os, sys
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(HERE, '..', 'shots')
PLATES = os.path.join(HERE, 'plates')
OUT = os.path.join(HERE, 'renders')
UP = 2  # plates are upscaled before compositing so the UI stays crisp

# plate -> screenshots, ordered left-to-right
JOBS = {
    'p01-wall-hand':     ['dump'],
    'p02-cafe-flatlay':  ['dump-filed'],
    'p03-sofa-shoulder': ['piles'],
    'p04-street':        ['dig'],
    'p05-trio-paper':    ['dump', 'piles', 'dig'],
    'p06-kitchen':       ['pile-watch'],
    'p07-story-tiles':   ['dump-filed-toast'],
}


def font(size, bold=True):
    for f in (['seguisb.ttf', 'segoeuib.ttf'] if bold else ['segoeui.ttf']):
        p = os.path.join(os.environ.get('WINDIR', 'C:/Windows'), 'Fonts', f)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def screen_image(name):
    """Screenshot + iOS status bar, as a BGR array (1170 x 2640)."""
    shot = Image.open(os.path.join(SHOTS, name + '.png')).convert('RGB')
    w, h = shot.size
    sb = 108
    bg = shot.getpixel((6, 6))
    img = Image.new('RGB', (w, h + sb), bg)
    img.paste(shot, (0, sb))
    d = ImageDraw.Draw(img)
    d.text((105, 58), '9:41', font=font(46), fill=(17, 17, 17), anchor='lm')
    # signal bars, wifi-ish dots, battery
    x = w - 300
    for i, bh in enumerate((12, 18, 24, 30)):
        d.rounded_rectangle((x + i * 14, 72 - bh, x + i * 14 + 9, 72), 2, fill=(17, 17, 17))
    bx = w - 190
    d.rounded_rectangle((bx, 44, bx + 76, 74), 9, outline=(17, 17, 17), width=4)
    d.rounded_rectangle((bx + 8, 52, bx + 56, 66), 4, fill=(17, 17, 17))
    d.rounded_rectangle((bx + 80, 53, bx + 86, 65), 2, fill=(17, 17, 17))
    return cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)


def green_alpha(img):
    f = img.astype(np.float32)
    b, g, r = f[..., 0], f[..., 1], f[..., 2]
    spill = g - np.maximum(r, b)
    return np.clip((spill - 25) / 70, 0, 1), spill


def line_fit(pts):
    vx, vy, x0, y0 = cv2.fitLine(pts.astype(np.float32), cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
    return np.array([x0, y0]), np.array([vx, vy])


def intersect(l1, l2):
    (p, d), (q, e) = l1, l2
    A = np.array([d, -e]).T
    t = np.linalg.solve(A, q - p)
    return p + t[0] * d


def fit_quad(mask):
    cnts, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cnts, key=cv2.contourArea)
    # fill the convex hull so the notch and occluding thumbs don't dent the edges,
    # then take its dense outline
    hull = cv2.convexHull(c)
    filled = np.zeros_like(mask)
    cv2.fillConvexPoly(filled, hull, 255)
    hc, _ = cv2.findContours(filled, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    pts = hc[0].reshape(-1, 2).astype(np.float64)
    q = cv2.boxPoints(cv2.minAreaRect(hull)).astype(np.float64)
    # two passes of robust per-edge line fits, tightening the inlier band
    for band in (0.06, 0.015):
        lines = []
        for i in range(4):
            a, b = q[i], q[(i + 1) % 4]
            d = b - a
            L = np.linalg.norm(d)
            u = d / L
            n = np.array([-u[1], u[0]])
            rel = pts - a
            t = rel @ u / L
            dist = np.abs(rel @ n)
            sel = pts[(t > 0.2) & (t < 0.8) & (dist < max(3, band * L))]
            lines.append(line_fit(sel) if len(sel) > 8 else (a, u))
        q = np.array([intersect(lines[(i - 1) % 4], lines[i]) for i in range(4)])
    # clockwise in image coords (y down)
    d1, d2 = q[1] - q[0], q[2] - q[1]
    if d1[0] * d2[1] - d1[1] * d2[0] < 0:
        q = q[::-1]
    # start at the upper of the two short edges: TL -> TR -> BR -> BL
    L = [np.linalg.norm(q[(i + 1) % 4] - q[i]) for i in range(4)]
    pair = (0, 2) if L[0] + L[2] < L[1] + L[3] else (1, 3)
    mid_y = lambda i: (q[i, 1] + q[(i + 1) % 4, 1]) / 2
    top = min(pair, key=mid_y)
    return np.roll(q, -top, axis=0).astype(np.float32)


def composite(plate_name, shots, rng):
    src = cv2.imread(os.path.join(PLATES, plate_name + '.png'))
    img = cv2.resize(src, None, fx=UP, fy=UP, interpolation=cv2.INTER_LANCZOS4)
    alpha, spill = green_alpha(img)
    hard = (alpha > 0.5).astype(np.uint8)
    n, lab, stats, cent = cv2.connectedComponentsWithStats(hard)
    min_area = img.shape[0] * img.shape[1] * 0.004
    comps = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] > min_area]
    comps.sort(key=lambda i: cent[i][0])
    assert len(comps) == len(shots), f'{plate_name}: found {len(comps)} screens, expected {len(shots)}'

    out = img.astype(np.float32)
    H, W = img.shape[:2]
    for ci, name in zip(comps, shots):
        m = (lab == ci).astype(np.uint8)
        quad = fit_quad(m * 255)
        scr = screen_image(name)
        # pre-shrink with area filtering to ~the on-plate size so small text doesn't alias
        tgt_h = max(np.linalg.norm(quad[3] - quad[0]), np.linalg.norm(quad[2] - quad[1]))
        k = min(1.0, 1.15 * tgt_h / scr.shape[0])
        scr = cv2.resize(scr, None, fx=k, fy=k, interpolation=cv2.INTER_AREA)
        sh, sw = scr.shape[:2]
        M = cv2.getPerspectiveTransform(np.float32([[0, 0], [sw, 0], [sw, sh], [0, sh]]), quad)
        warped = cv2.warpPerspective(scr, M, (W, H), flags=cv2.INTER_LINEAR,
                                     borderMode=cv2.BORDER_REPLICATE).astype(np.float32)
        warped = cv2.GaussianBlur(warped, (0, 0), 0.4)

        # alpha = green mask of this screen, grown slightly to eat the fringe
        region = cv2.dilate(m, np.ones((25, 25), np.uint8))
        a = alpha * region
        a = cv2.dilate(a, np.ones((3, 3), np.uint8))
        a = cv2.GaussianBlur(a, (0, 0), 0.8)
        a = np.clip(a * 1.15, 0, 1)

        # shading from the green itself (light falloff / shadows across the screen)
        g = img[..., 1].astype(np.float32)
        inside = m.astype(bool)
        med = np.median(g[inside])
        shade = cv2.GaussianBlur(np.where(inside, g / med, 1).astype(np.float32), (0, 0), 25)
        shade = np.clip(shade, 0.7, 1.08) ** 0.55
        lit = warped * shade[..., None] * 0.97

        # faint diagonal glass sheen
        x0, y0, bw, bh = cv2.boundingRect(m)
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        diag = ((xx - x0) / max(bw, 1) * 0.8 + (yy - y0) / max(bh, 1) * 0.6)
        sheen = np.clip(1 - np.abs(diag - 0.55) / 0.22, 0, 1) * 0.06
        lit = lit + (255 - lit) * sheen[..., None]

        out = out * (1 - a[..., None]) + lit * a[..., None]

        # green bounce/reflection off nearby surfaces -> retint with the screen's color
        x0, y0, bw, bh = cv2.boundingRect(m)
        zone = np.zeros((H, W), np.float32)
        zone[max(0, y0 - bh // 4):min(H, y0 + bh + bh // 2), max(0, x0 - bw // 2):min(W, x0 + bw + bw // 2)] = 1
        zone *= 1 - cv2.dilate(m, np.ones((9, 9), np.uint8))
        # greenness relative to the local surface color (works on red wood too)
        tint = scr.reshape(-1, 3).mean(0).astype(np.float32)
        e = out[..., 1] - 0.5 * (out[..., 0] + out[..., 2])
        base = cv2.GaussianBlur(np.where(zone > 0, e, 0), (0, 0), 60) / \
               np.maximum(cv2.GaussianBlur(zone, (0, 0), 60), 1e-3)
        base = np.minimum(base, np.median(e[zone > 0]) if zone.any() else 0)
        delta = np.clip(e - base - 3, 0, None) * zone
        delta = cv2.GaussianBlur(delta, (0, 0), 1.5)
        out[..., 1] -= delta
        out += delta[..., None] * (tint / tint.max())[None, None, :] * 0.7
        # despill the fringe right around the screen
        ring = (cv2.dilate(m, np.ones((15, 15), np.uint8)) > 0)
        gmax = np.maximum(out[..., 0], out[..., 2]) + 6
        out[..., 1] = np.where(ring, np.minimum(out[..., 1], gmax), out[..., 1])

    o = out
    # unify with film grain over the whole frame
    grain = rng.normal(0, 3.2, (H, W, 1)).astype(np.float32)
    grain = cv2.GaussianBlur(grain, (0, 0), 0.6)[..., None] * 1.6
    o = np.clip(o + grain, 0, 255).astype(np.uint8)
    return o


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    rng = np.random.default_rng(7)
    only = sys.argv[1:]
    for plate, shots in JOBS.items():
        if only and plate not in only:
            continue
        res = composite(plate, shots, rng)
        cv2.imwrite(os.path.join(OUT, plate + '.png'), res)
        print('ok', plate, res.shape[1], 'x', res.shape[0])
