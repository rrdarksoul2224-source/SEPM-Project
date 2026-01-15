import easyocr
import cv2
from ultralytics import YOLO

reader = easyocr.Reader(['en'], gpu=False)
model = YOLO("runs/detect/train2/weights/best.pt")

def clean_plate(text):
    text = text.upper()
    text = text.replace(" ", "")
    text = ''.join(c for c in text if c.isalnum())
    return text


img = cv2.imread("plates_data/images/val/any_image.png")
results = model(img)

for box in results[0].boxes.xyxy:
    x1, y1, x2, y2 = map(int, box)
    plate = img[y1:y2, x1:x2]

    text = reader.readtext(plate, detail=0)
    print("Detected Plate:", text)
    cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)