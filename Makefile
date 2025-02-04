build:
	docker build . -t express-typescript-docker

run:
	docker run -p 3000:3000 -d express-typescript-docker:latest

up:
	docker-compose up

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

down: 
	docker-compose down