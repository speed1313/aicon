setup:
	pip install --upgrade pip
	pip install -r requirements.txt

db:
	sqlite3 tables.db < tables.sql
start:
	gunicorn main:app