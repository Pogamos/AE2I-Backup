build:
	docker-compose up --build
stop:
	docker-compose stop
up:
	docker-compose up -d
	
react-setup:
	cd frontend && npm install
react-start:
	cd frontend && npm run start
