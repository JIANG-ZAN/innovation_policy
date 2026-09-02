from pathlib import Path

from PIL import Image


ROOT = Path("/Users/wangyijin/Documents/创新政策作业/素材/角色设定")
OUTPUT = ROOT / "独立素材"


def split_sheet(source_name: str, character: str, slices: list[tuple[int, int, str]]) -> None:
    image = Image.open(ROOT / source_name).convert("RGBA")
    destination = OUTPUT / character
    destination.mkdir(parents=True, exist_ok=True)

    for left, right, filename in slices:
        crop = image.crop((left, 0, right, image.height))
        alpha_box = crop.getchannel("A").getbbox()
        if alpha_box is None:
            raise RuntimeError(f"No visible pixels found for {filename}")

        padding = 12
        x0 = max(0, alpha_box[0] - padding)
        y0 = max(0, alpha_box[1] - padding)
        x1 = min(crop.width, alpha_box[2] + padding)
        y1 = min(crop.height, alpha_box[3] + padding)
        crop.crop((x0, y0, x1, y1)).save(destination / filename)


split_sheet(
    "林一-七年龄-透明-v1.png",
    "林一",
    [
        (0, 226, "林一-00-婴儿.png"),
        (226, 428, "林一-08-幼年.png"),
        (428, 670, "林一-16-少年.png"),
        (670, 920, "林一-23-青年.png"),
        (920, 1177, "林一-38-壮年.png"),
        (1177, 1406, "林一-58-中年.png"),
        (1406, 1672, "林一-98-老年.png"),
    ],
)

split_sheet(
    "周岚-三年龄-透明-v1.png",
    "周岚",
    [
        (180, 610, "周岚-35-婴儿期.png"),
        (610, 1060, "周岚-58-青年期.png"),
        (1060, 1480, "周岚-93-中年期.png"),
    ],
)

split_sheet(
    "小满-五年龄-透明-v1.png",
    "小满",
    [
        (50, 375, "小满-08-幼年.png"),
        (375, 640, "小满-16-少年.png"),
        (640, 970, "小满-23-青年.png"),
        (970, 1310, "小满-38-壮年.png"),
        (1310, 1640, "小满-58-中年.png"),
    ],
)

split_sheet(
    "小满-男-五年龄-透明-v2.png",
    "小满-男-v2",
    [
        (0, 330, "小满-男-08-幼年.png"),
        (330, 635, "小满-男-16-少年.png"),
        (635, 970, "小满-男-23-青年.png"),
        (970, 1300, "小满-男-38-壮年.png"),
        (1300, 1672, "小满-男-58-中年.png"),
    ],
)

split_sheet(
    "栖-三状态-透明-v1.png",
    "栖",
    [
        (0, 558, "栖-协助状态.png"),
        (558, 1115, "栖-警告状态.png"),
        (1115, 1672, "栖-静默状态.png"),
    ],
)
