import sys
from rembg import remove
from PIL import Image

input_path = "C:/Users/Vadim/Pictures/logo_budget.jpg"
output_path = "C:/Users/Vadim/Desktop/repo/smart-budget-frontend/public/logo_budget_transparent.png"

input_img = Image.open(input_path)
output_img = remove(input_img)
output_img.save(output_path)
print("Background removed successfully!")
