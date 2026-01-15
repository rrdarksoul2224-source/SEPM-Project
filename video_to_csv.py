from ultralytics import YOLO
import cv2
import easyocr
import pandas as pd
from datetime import datetime

model = YOLO("runs/detect/train2/weights/best.pt")
reader = easyocr.Reader(['en'], gpu=False)

cap = cv2.VideoCapture("input.mp4")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)

    for box in results[0].boxes.xyxy:
        x1, y1, x2, y2 = map(int, box)
        plate_img = frame[y1:y2, x1:x2]

        text = reader.readtext(plate_img, detail=0)
        if text:
            df = pd.DataFrame([[text[0], datetime.now()]],
                              columns=["Plate", "Time"])
            df.to_csv("plates.csv", mode="a", header=False, index=False)

    cv2.imshow("ANPR", results[0].plot())
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
