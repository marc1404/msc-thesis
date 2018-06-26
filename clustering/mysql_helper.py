import mysql.connector
from dotenv import load_dotenv
import os


def connect():
    load_dotenv(dotenv_path='.env')
    print('Connecting to MySQL database...')

    config = {
        'host': os.getenv('MYSQL_HOST'),
        'user': os.getenv('MYSQL_USER'),
        'password': os.getenv('MYSQL_PASSWORD'),
        'database': os.getenv('MYSQL_DATABASE')
    }
    cnx = mysql.connector.connect(**config)
    cursor = cnx.cursor()

    print('Done.')

    return cnx, cursor


def disconnect(cnx, cursor):
    print('Closing MySQL connection...')
    cnx.commit()
    cursor.close()
    cnx.close()
    print('Done.')
