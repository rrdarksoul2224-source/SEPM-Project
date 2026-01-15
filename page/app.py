from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import pandas as pd
from datetime import datetime
from ultralytics import YOLO
import easyocr

app = Flask(__name__)
CORS(app)  

# ---------------- CONFIG ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MODEL_PATH = "../runs/detect/train2/weights/best.pt"
CSV_PATH = "plates.csv"

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

model = YOLO(MODEL_PATH)
reader = easyocr.Reader(['en'], gpu=False)

seen_plates = set()

# ---------------- UTILS ----------------
def clean_plate(text):
    text = text.upper().replace(" ", "")
    return "".join(c for c in text if c.isalnum())

# ---------------- API ----------------
@app.route("/api/detect-video", methods=["POST"])
def api_detect_video():
    video = request.files.get("file")
    if not video:
        return jsonify({"ok": False, "error": "No file uploaded"}), 400

    video_path = os.path.join(app.config["UPLOAD_FOLDER"], video.filename)
    video.save(video_path)

    cap = cv2.VideoCapture(video_path)
    results_list = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)

        for box in results[0].boxes.xyxy:
            x1, y1, x2, y2 = map(int, box)
            plate_img = frame[y1:y2, x1:x2]

            texts = reader.readtext(plate_img, detail=0)
            if texts:
                plate_text = clean_plate(texts[0])

                if (
                    plate_text
                    and len(plate_text) >= 6
                    and plate_text not in seen_plates
                ):
                    seen_plates.add(plate_text)
                    results_list.append([plate_text, datetime.now()])

    cap.release()

    if results_list:
        df = pd.DataFrame(results_list, columns=["Plate", "Time"])
        df.to_csv(
            CSV_PATH,
            mode="a",
            header=not os.path.exists(CSV_PATH),
            index=False
        )

    return jsonify({
        "ok": True,
        "plates": [r[0] for r in results_list]
    })
@app.route("/api/detect-image", methods=["POST"])
def api_detect_image():
    image = request.files.get("file")
    if not image:
        return jsonify({"ok": False, "error": "No file uploaded"}), 400

    image_path = os.path.join(app.config["UPLOAD_FOLDER"], image.filename)
    image.save(image_path)

    frame = cv2.imread(image_path)
    results = model(frame)
    results_list = []

    for box in results[0].boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        conf = float(box.conf[0]) * 100  # confidence percentage
        plate_img = frame[y1:y2, x1:x2]

        texts = reader.readtext(plate_img, detail=0)
        if texts:
            plate_text = clean_plate(texts[0])
            if plate_text and len(plate_text) >= 6:
                results_list.append({
                    "plate_number": plate_text,
                    "confidence": round(conf, 1),
                    "bbox": [x1, y1, x2, y2]
                })

    return jsonify({
        "ok": True,
        "plates": results_list
    })


if __name__ == "__main__":
    app.run(debug=True)
