import os
import random
import shutil

BASE_DIR = r"D:\PROFFESOR\ANPR_Projetct\plates_data"
IMG_DIR = os.path.join(BASE_DIR, "images")
LBL_DIR = os.path.join(BASE_DIR, "labels")

TRAIN_IMG = os.path.join(IMG_DIR, "train")
VAL_IMG = os.path.join(IMG_DIR, "val")
TRAIN_LBL = os.path.join(LBL_DIR, "train")
VAL_LBL = os.path.join(LBL_DIR, "val")

os.makedirs(TRAIN_IMG, exist_ok=True)
os.makedirs(VAL_IMG, exist_ok=True)
os.makedirs(TRAIN_LBL, exist_ok=True)
os.makedirs(VAL_LBL, exist_ok=True)

images = [f for f in os.listdir(IMG_DIR) if f.endswith(".png")]
random.shuffle(images)

split = int(0.8 * len(images))
train_imgs = images[:split]
val_imgs = images[split:]

for img in train_imgs:
    shutil.move(os.path.join(IMG_DIR, img), os.path.join(TRAIN_IMG, img))
    shutil.move(os.path.join(LBL_DIR, img.replace(".png", ".txt")), os.path.join(TRAIN_LBL, img.replace(".png", ".txt")))

for img in val_imgs:
    shutil.move(os.path.join(IMG_DIR, img), os.path.join(VAL_IMG, img))
    shutil.move(os.path.join(LBL_DIR, img.replace(".png", ".txt")), os.path.join(VAL_LBL, img.replace(".png", ".txt")))

print("✅ Dataset split completed")
