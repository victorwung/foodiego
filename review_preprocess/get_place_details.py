import pandas as pd
from bs4 import BeautifulSoup as soup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from sqlalchemy import create_engine
import json
from datetime import datetime
import random
import time
import os
from dotenv import load_dotenv

# db info
load_dotenv()
host = os.getenv('DB_HOST')
user = os.getenv('DB_USERNAME')
pswd = os.getenv('DB_PASSWORD')
db = os.getenv('DB_DATABASE')

# driver
options = Options()
#options.add_argument('--headless')
#options.add_argument('--no-sandbox')
options.add_argument("accept-language=en-US")

driver = webdriver.Chrome(executable_path=ChromeDriverManager().install(), options=options)
driver.maximize_window()

# place id and info
MY_GOOGLE_KEY = os.getenv('GOOGLE_KEY')

# place names (restaurant names)
restaurants = pd.read_pickle('data/restaurants.pkl')
remove_place_list = ['Bon Amis 牛排館','Picca義式小廚房','Kurumi 庫入米食豔餐廳','Our Commune 有機風餐廳', 'Plants'] # no reviews
restaurants = restaurants[~restaurants['place_name'].isin(remove_place_list)].copy()
restaurants = restaurants.reset_index(drop=True)
target_restaurants = restaurants[:100].copy()
target_restaurants = target_restaurants.reset_index(drop=True)

# place details
places = []
for cur_place_name in target_restaurants['place_name']:
    cur_place = []
    # get plcae id
    place_id_api = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?&inputtype=textquery&input=' + cur_place_name + '&key=' + MY_GOOGLE_KEY
    driver.get(place_id_api)
    content_page = soup(driver.page_source,'html.parser')
    response = json.loads(content_page.text)
    cur_place_id = response.get('candidates')[0].get('place_id')
    time.sleep(3)
    # get place info
    place_info_api = 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + cur_place_id + '&key=' + MY_GOOGLE_KEY
    driver.get(place_info_api)
    content_page = soup(driver.page_source,'html.parser')
    response = json.loads(content_page.text)
    cur_place_latlng = response.get('result').get('geometry').get('location')
    try:
        cur_place_rating = response.get('result').get('rating')
    except Exception:
        cur_place_rating = None
    cur_place_addr = response.get('result').get('formatted_address')
    try:
        cur_place_phone = response.get('result').get('formatted_phone_number').replace(' ','-')
    except Exception:
        cur_place_phone = None
    # save cur place
    cur_place.append(cur_place_id)
    cur_place.append(cur_place_name)
    cur_place.append(cur_place_latlng)
    cur_place.append(cur_place_rating)
    cur_place.append(cur_place_addr)
    cur_place.append(cur_place_phone)
    # save to places
    places.append(cur_place)
    print('Place: {} done.'.format(cur_place_name))
    # wait
    sleepsecs = random.randint(4,6)
    time.sleep(sleepsecs)

# save as dataframe
place_table = pd.DataFrame(places, columns=['place_id', 'place_name', 'place_latlng', 'place_rating', 'place_addr', 'place_phone'])
place_table.insert(3, 'place_lat', 'test')
place_table.insert(4, 'place_lng', 'test')
place_table['place_lat'] = place_table['place_latlng'].apply(lambda x: str(x.get('lat')))
place_table['place_lng'] = place_table['place_latlng'].apply(lambda x: str(x.get('lng')))
place_table = place_table.drop(['place_latlng'], axis=1)
place_table['etl_date'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
# save as pkl
# place_table.to_pickle('data/place_table_new.pkl')

# db
engine = create_engine("mysql+pymysql://{user}:{pswd}@{host}/{db}".format(user=user, pswd=pswd, host=host, db=db))
if(engine):
    print("Connect to mysql successfully!")
else:
    print("Oops, connect to mysql unsuccessfully.")
    
with engine.connect() as connection:
    place_table.to_sql('place', con = engine, index=False, if_exists = 'append', chunksize = 1000)

driver.close()

print('Get place(restaurants) details done.')