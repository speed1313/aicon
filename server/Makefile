setup:
	pip install --upgrade pip
	pip install -r requirements.txt

db:
	sqlite3 tables.db < tables.sql
start:
	uvicorn main:app  --host 0.0.0.0 --port 8080 