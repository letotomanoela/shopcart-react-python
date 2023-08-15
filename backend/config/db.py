import cx_Oracle

def db():
    conn = cx_Oracle.connect("demouser/demouser@localhost:1521/xepdb1")
    cursor = conn.cursor()
    return conn ,cursor

    
        


