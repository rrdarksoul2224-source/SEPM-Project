from ultralytics import YOLO
import cv2

MODEL_PATH = "runs/detect/train2/weights/best.pt"
IMAGE_PATH = "plates_data/images/val"  # koi bhi image yahan se

model = YOLO(MODEL_PATH)

img = cv2.imread(IMAGE_PATH + "/" + cv2.os.listdir(IMAGE_PATH)[5])

results = model(img)

annotated = results[0].plot()
cv2.imshow("Detection", annotated)
cv2.waitKey(0)
cv2.destroyAllWindows()
