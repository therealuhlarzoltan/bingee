import os

from dotenv import load_dotenv
load_dotenv()

API_KEY = str(os.getenv("X-RAPIDAPI-KEY"))
API_HOST = str(os.getenv("X-RAPIDAPI-HOST"))