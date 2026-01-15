import os
import xml.etree.ElementTree as ET

IMAGE_DIR = r"D:\PROFFESOR\ANPR_Projetct\plates_data\images"
XML_DIR = r"D:\PROFFESOR\ANPR_Projetct\plates_data\annotations"
LABEL_DIR = r"D:\PROFFESOR\ANPR_Projetct\plates_data\labels"

os.makedirs(LABEL_DIR, exist_ok=True)

for xml_file in os.listdir(XML_DIR):
    if not xml_file.endswith(".xml"):
        continue

    xml_path = os.path.join(XML_DIR, xml_file)
    tree = ET.parse(xml_path)
    root = tree.getroot()

    image_name = root.find("filename").text
    image_path = os.path.join(IMAGE_DIR, image_name)

    size = root.find("size")
    img_w = int(size.find("width").text)
    img_h = int(size.find("height").text)

    label_file = image_name.replace(".png", ".txt")
    label_path = os.path.join(LABEL_DIR, label_file)

    with open(label_path, "w") as f:
        for obj in root.findall("object"):
            class_id = 0  # license plate

            bbox = obj.find("bndbox")
            xmin = int(bbox.find("xmin").text)
            ymin = int(bbox.find("ymin").text)
            xmax = int(bbox.find("xmax").text)
            ymax = int(bbox.find("ymax").text)

            x_center = ((xmin + xmax) / 2) / img_w
            y_center = ((ymin + ymax) / 2) / img_h
            width = (xmax - xmin) / img_w
            height = (ymax - ymin) / img_h

            f.write(f"{class_id} {x_center} {y_center} {width} {height}\n")

print("✅ XML to YOLO conversion completed")
