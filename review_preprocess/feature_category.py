import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

# db info
load_dotenv()
host = os.getenv('DB_HOST')
user = os.getenv('DB_USERNAME')
pswd = os.getenv('DB_PASSWORD')
db = os.getenv('DB_DATABASE')

# read data
df = pd.read_csv('data/review_category.csv', encoding='BIG5')

# db connect
engine = create_engine("mysql+pymysql://{user}:{pswd}@{host}/{db}".format(user=user, pswd=pswd, host=host, db=db))
if(engine):
    print("Connect to mysql successfully!")
else:
    print("Oops, connect to mysql unsuccessfully.")

with engine.connect() as connection:
    df.to_sql('review_category', con=engine, index=False, if_exists='append', chunksize=1000)
    
print('Insert feature category done.')