import pandas as pd
from bs4 import BeautifulSoup as soup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from sqlalchemy import create_engine
from datetime import datetime
import random
import time
import gc
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

# read place id and Info
place_table_all = pd.read_pickle('data/place_table_new.pkl')

# number to scroll
num_of_scroll = 99

# review details
cur_url = 'https://www.google.com.tw/maps/search/%E9%A4%90%E5%BB%B3/@25.0417301,121.522022,14z/data=!3m1!4b1?hl=zh-TW'
driver.get(cur_url)
time.sleep(5)

# loop to get each target place
place_table = place_table_all[0:100].copy()
place_table = place_table.reset_index(drop=True)

drop_date_list = ['2 個月前', '3 個月前', '4 個月前', '5 個月前', '6 個月前', '7 個月前', \
                     '8 個月前', '9 個月前', '10 個月前', '11 個月前', '12 個月前', \
                     '1 年前', '2 年前', '3 年前', '4 年前', '5 年前', \
                     '6 年前', '7 年前', '8 年前', '9 年前', '10 年前']

def getreviews(target_loc, driver, num_of_scroll, road, drop_date_list):
    time.sleep(5)

    wait = WebDriverWait(driver, 60)
    menu_bt = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@data-value=\'排序\']')))  
    menu_bt.click()
    time.sleep(5)

    if (road == 3):  
        high_rating_bt = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="action-menu"]/ul/li[3]')))
        high_rating_bt.click()
        time.sleep(3)
    elif (road == 4):
        high_rating_bt = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="action-menu"]/ul/li[4]')))
        high_rating_bt.click()
        time.sleep(3)
    else:
        # unknown
        pass

    menu_bt = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[@data-value=\'排序\']')))  
    menu_bt.click()
    time.sleep(3)

    recent_rating_bt = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="action-menu"]/ul/li[2]')))
    recent_rating_bt.click()
    time.sleep(10)

#     # for total reviews
#     reviews = []

    for i in range(0, num_of_scroll, 1):
        scrollable_div = driver.find_element_by_css_selector(
         'div.section-layout.section-scrollbox.scrollable-y.scrollable-show'
                             )
        driver.execute_script(
                       'arguments[0].scrollTop = arguments[0].scrollHeight', 
                        scrollable_div
                       )
        time.sleep(5)

        # get rows
        content_page = soup(driver.page_source,'html.parser')
        time.sleep(5)
        # find review section
        rlist = content_page.find_all('div', class_='section-review-content')
        for r in rlist:
            rel_date = r.find('span', class_='section-review-publish-date').text
            # check rel_date
            if rel_date in drop_date_list:
                # 2 months before
                break
        else:
            continue
        break
        
    # get rows
    content_page = soup(driver.page_source,'html.parser')
    time.sleep(5)
    # find review section
    rlist = content_page.find_all('div', class_='section-review-content')
    # for total reviews
    reviews = []
    for r in rlist:
        # for review element
        cur_review = []
        # get each element
        id_r = r.find('button', class_='section-review-action-menu')['data-review-id']
        username = r.find('div', class_='section-review-title').find('span').text
        try:
            review_text = r.find('span', class_='section-review-text').text
        except Exception:
            review_text = None
        rating = r.find('span', class_='section-review-stars')['aria-label'].strip()
        rel_date = r.find('span', class_='section-review-publish-date').text
        # save each element to current review
        cur_review.append(id_r)
        cur_review.append(username)
        cur_review.append(review_text)
        cur_review.append(rating)
        cur_review.append(rel_date)
        # save current review to total reviews
        reviews.append(cur_review)
    return reviews

# db connect
engine = create_engine("mysql+pymysql://{user}:{pswd}@{host}/{db}".format(user=user, pswd=pswd, host=host, db=db))
if(engine):
    print("Connect to mysql successfully!")
else:
    print("Oops, connect to mysql unsuccessfully.")

# total place reviews
for i in range(0, len(place_table), 1):
    place_id = place_table['place_id'][i]
    place_name = place_table['place_name'][i]
    
    # get init page
    driver.get(cur_url)
    time.sleep(8)

    # send to search input & click btn
    searchbox_input = driver.find_elements_by_xpath('//*[@id="searchboxinput"]')[0]
    searchbox_input.clear()
    searchbox_input.send_keys(place_name)
    time.sleep(7)
    
    searchbox_btn = driver.find_elements_by_xpath('//*[@id="searchbox-searchbutton"]')[0]
    searchbox_btn.click()
    time.sleep(7)
    
    rel_loc_section_first = driver.find_elements_by_xpath('//div[@class="section-result"]')
    
    # random a road
    road = random.randint(3, 4) # 3: high, 4: low
    
    if rel_loc_section_first:
        first_btn = driver.find_elements_by_xpath('//*[@id="pane"]/div/div[1]/div/div/div[4]/div[1]/div[1]')
        first_btn[0].click()
        time.sleep(8)
        start_time = time.time()
        reviews = getreviews(place_name, driver, num_of_scroll, road, drop_date_list)
    else:
        start_time = time.time()
        reviews = getreviews(place_name, driver, num_of_scroll, road, drop_date_list)
    
    # save as dataframe
    cur_review_table = pd.DataFrame(reviews, columns=['review_id', 'user_name', 'review_content', 'rating', 'rel_date'])
    cur_review_table.insert(0, 'place_id', place_id)
    cur_review_table.insert(1, 'place_name', place_name)
    now = datetime.now()
    cur_review_table['etl_date'] = now.strftime("%Y-%m-%d %H:%M:%S")

    # leave need record
    cur_review_table = cur_review_table[~cur_review_table['rel_date'].isin(drop_date_list)].copy()

    if len(cur_review_table) < 1:
        print('Empty! No reviews within 1 month.')
        print('Place: {} done.\n'.format(place_name))
    else:
        cur_review_table = cur_review_table.reset_index(drop=True)

        # alter rating to int
        cur_review_table['rating'] = cur_review_table['rating'].apply(lambda x: x.split()[0])
        cur_review_table['rating'] = cur_review_table['rating'].apply(lambda x: int(x))

        # to DB
        print('Start insert to DB.')
        with engine.connect() as connection:
            cur_review_table.to_sql('review', con = engine, index=False, if_exists = 'append', chunksize = 1000)

        print('Number of final reiviews {}.'.format(len(cur_review_table)))
        print('Place: {} done.\n'.format(place_name))

        del cur_review_table
        gc.collect()
        
driver.close()

print('Get Google Maps reviews done.')