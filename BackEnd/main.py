from db import get_snowflake_connection
from snowflake.connector import Error as SnowflakeError

def check_snowflake_connection():
    try:
        print("Attempting to connect to Snowflake...")
        
        # Get connection using your existing db.py function
        conn = get_snowflake_connection()
        
        # Execute a simple query to verify connection
        cursor = conn.cursor()
        cursor.execute("SELECT CURRENT_VERSION(), CURRENT_WAREHOUSE(), CURRENT_DATABASE()")
        version, warehouse, database = cursor.fetchone()
        
        print(f"Successfully connected to Snowflake!")
        print(f"Version: {version}")
        print(f"Warehouse: {warehouse}")
        print(f"Database: {database}")
        return True
        
    except SnowflakeError as e:
        print(f"Snowflake connection error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False
    finally:
        # Close connection if it was established
        if 'conn' in locals() and conn is not None:
            conn.close()
            print("Connection closed.")

if __name__ == "__main__":
    if check_snowflake_connection():
        print("✅ Snowflake connection test: SUCCESS")
    else:
        print("❌ Snowflake connection test: FAILED")