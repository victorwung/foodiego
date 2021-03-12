# FoodieHelper
An online dashboard service which helps users find suitable restaurants from Google Maps reviews and brings insights through multiple aspects of dining experience.

- Link: https://foodiehelper.online

## Table of Contents
- [Technologies](#Technologies)
- [Architecture](#Architecture)
- [Data Flow](#data-flow)
- [Database Schema](#database-schema)
- [Features](#Features)
- [Demo Account](#demo-account)

## Technologies
### Back-End
- Node.js / Express.js
- RESTful API
- NGINX

### Front-End
- HTML
- CSS
- JavaScript

### Web Crawler and Data Preprocessing
- Python
- jieba

### Cloud Service (AWS)
- EC2
- RDS

### Database 
- MySQL

### Networking
- HTTPS
- SSL
- Domain Name System (DNS)

### Others
- Design Pattern: MVC
- Version Control: Git, GitHub
- Third-party APIs: 
	- Google Maps JavaScript API
	- Google Maps Places API
	- Google Natural Language API
- Agile: Trello (Scrum)

## Architecture
[![architecture_figure](https://stylishbucket.s3-ap-northeast-1.amazonaws.com/foodiehelper/architecture.png "architecture_figure")](https://stylishbucket.s3-ap-northeast-1.amazonaws.com/foodiehelper/architecture.png "architecture_figure")

## Data Flow
[![dataflow](https://stylishbucket.s3-ap-northeast-1.amazonaws.com/foodiehelper/dataflow2.png "dataflow")](https://stylishbucket.s3-ap-northeast-1.amazonaws.com/foodiehelper/dataflow2.png "dataflow")

## Database Schema
[![db_schema](https://stylishbucket.s3-ap-northeast-1.amazonaws.com/foodiehelper/database_schema_new2.png "db_schema")](https://stylishbucket.s3-ap-northeast-1.amazonaws.com/foodiehelper/database_schema_new2.png "db_schema")

## Features
![](https://github.com/victorwung/mydata/blob/master/foodiehelper/demo_v3.gif)
- Efficient restaurant search:
	- Restaurants that mentioned the target food in Google Maps reviews will be visualized on Google Maps
	- Review counts of the mentioned target food on Google Maps are displayed with differentiated circle sizes
- Extra insights from the reviews:
	- Feeling about the target food
	- Informative tags extracted from the reviews
	- Detailed rating items including meal, service, environment, CP value, and price
	- Participants mentioned
- Restaurant information:
	- Rating
	- Number of total reviews
	- Number of reviews that mentioned the target food
	- Top keywords
	- Location

## Demo Account
- Welcome try the service without sign in or sing up!
- E-mail: test@gmail.com / password: test