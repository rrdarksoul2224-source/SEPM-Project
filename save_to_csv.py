import pandas as pd
from datetime import datetime

def save_plate(text):
    df = pd.DataFrame([[text, datetime.now()]], columns=["Plate", "Time"])
    df.to_csv("plates.csv", mode="a", header=False, index=False)

save_plate("CG04AB1234")
