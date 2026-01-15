from ultralytics import YOLO
import cv2

model = YOLO("runs/detect/train2/weights/best.pt")

video_path = "vid.mp4"  # apna video yahan daalo
cap = cv2.VideoCapture(video_path)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)
    annotated = results[0].plot()

    cv2.imshow("ANPR Detection", annotated)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
