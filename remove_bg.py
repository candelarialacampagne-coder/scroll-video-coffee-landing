from PIL import Image
import numpy as np
import sys, os

def remove_white_bg(path_in, path_out, threshold=240):
    img = Image.open(path_in).convert("RGBA")
    data = np.array(img, dtype=np.float32)

    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Pixels that are "white-ish": all channels high and close to each other
    is_white = (r > threshold) & (g > threshold) & (b > threshold)

    # Soft edge: alpha gradual based on how white it is
    whiteness = np.minimum(r, np.minimum(g, b))
    alpha_factor = 1.0 - np.clip((whiteness - (threshold - 30)) / 30.0, 0, 1)
    data[:,:,3] = np.where(is_white, alpha_factor * 255, a)

    result = Image.fromarray(data.astype(np.uint8), "RGBA")
    result.save(path_out, "PNG")
    print(f"✓ {os.path.basename(path_out)}")

public = "/Users/candevazquez/Desktop/ClaudeProject/Cande-Porfolio/scroll-video-landing/public"
images = ["espresso_oscuro", "latte_dorado", "cold_brew_reserve", "cappuccino_natural"]

for name in images:
    remove_white_bg(f"{public}/{name}_t.png", f"{public}/{name}_t.png")
