# Advanced Weather App

## Overview
The **Advanced Weather App** is a comprehensive weather monitoring system that provides real-time updates and forecasts using the OpenWeatherMap API. It features an intuitive user interface, allowing users to track and analyze weather data effortlessly.

## Key Features

### Real-Time Weather Data Retrieval
- Continuously fetches weather data from the OpenWeatherMap API.
- Displays real-time updates for any selected city, including major metro cities in India.
- <img width="1433" alt="Screenshot 2024-10-23 at 7 59 21 PM" src="https://github.com/user-attachments/assets/3334d948-4c35-470a-9c14-b21bf404dc18">


### Dynamic Background Visuals
- Background video changes according to temperature and weather conditions for a more immersive experience.
- <img width="1440" alt="Screenshot 2024-10-23 at 8 02 25 PM" src="https://github.com/user-attachments/assets/58b187f1-5f17-4072-8138-03e9b9605a4f">

## Top Metro Cities single click retrival
- <img width="1440" alt="Screenshot 2024-10-23 at 8 01 32 PM" src="https://github.com/user-attachments/assets/0f49da55-84a0-4f35-aa7c-ca84f6f92fbe">


### User-Friendly Analytics
- Toggle button for switching between Kelvin and Celsius scales (Every Statistics)
- Provides real-time highlights such as:
  - Sunset and sunrise times
  - Wind speed
  - Humidity levels
  - Minimum and maximum temperatures
  - <img width="1440" alt="Screenshot 2024-10-23 at 8 00 23 PM" src="https://github.com/user-attachments/assets/c1d88fe8-3225-4ff3-94e6-b22f34044c3b">


### Weather Forecasting
- 7-day weather forecast for future planning.
- <img width="1440" alt="Screenshot 2024-10-23 at 8 00 40 PM" src="https://github.com/user-attachments/assets/103adbbd-6e0c-4cc7-b788-58afdb7027aa">

- Hourly weather data for the next 24 hours in 3-hour intervals, visualized in a line graph for easy insights.
- <img width="1440" alt="Screenshot 2024-10-23 at 8 00 54 PM" src="https://github.com/user-attachments/assets/b303ccc7-aaef-4762-84e3-64130acd2197">


### User Authentication and Profiles (Exclusive Feature)
- Secure login functionality with encrypted credentials.
- <img width="1440" alt="Screenshot 2024-10-25 at 12 41 47 AM" src="https://github.com/user-attachments/assets/d79598c6-6261-4027-8007-4c303879b47e">

- Quick look at desired Cities
- <img width="1440" alt="Screenshot 2024-10-25 at 12 43 30 AM" src="https://github.com/user-attachments/assets/013581a0-f597-40e6-a368-8968682d97ae">
- All at a single dashboard
- <img width="1440" alt="Screenshot 2024-10-25 at 12 43 37 AM" src="https://github.com/user-attachments/assets/494f26a7-1e61-4f03-9e52-5956d9b51f5e">



### Weather Alerts
- Users can set real-time weather alerts based on specific conditions.
- <img width="1440" alt="Screenshot 2024-10-25 at 12 47 20 AM" src="https://github.com/user-attachments/assets/0c386623-d5f6-4922-9d7a-0a03ba650f45">

- Alerts are stored in the database for future analysis and can be customized with various types and threshold values.
-  <img width="1440" alt="Screenshot 2024-10-25 at 12 47 55 AM" src="https://github.com/user-attachments/assets/81b68dca-dd16-4f71-84eb-92a3dd2f05a4">


- The system automatically checks for violations and triggers alerts when conditions are breached.
<img width="1440" alt="Screenshot 2024-10-25 at 12 56 56 AM" src="https://github.com/user-attachments/assets/257bc2b2-7982-4679-8aac-54fb98658630">

- Real-Time Insights from Violation Data
- <img width="1440" alt="Screenshot 2024-10-25 at 12 48 59 AM" src="https://github.com/user-attachments/assets/9be16f98-c68d-41ea-8c2f-ab0aa557d2be">


### Statistics Storage and Analysis
- Daily storage of weather data entries at the start of each day.
- <img width="1440" alt="Screenshot 2024-10-25 at 12 49 44 AM" src="https://github.com/user-attachments/assets/7bbb3641-0f1f-4350-a5c8-aa290906f349">

- Stores statistics for future analysis, including:
  - Average temperature
  - Minimum and maximum temperatures
  - Wind speed
  - Humidity
  - Dominant weather conditions
  - Time Stamp
- Ensures rollups and aggregates for comprehensive analysis.

- <img width="1440" alt="Screenshot 2024-10-25 at 12 52 02 AM" src="https://github.com/user-attachments/assets/5054b5e3-1313-4929-ae84-98b448b62823">


### Responsive User Interface
- Designed to be user-friendly and responsive across devices.
- Users can easily navigate and access features seamlessly.

## Technical Architecture
- **Backend**: Utilizes MongoDB for efficient data retrieval and storage.
- **API Integration**: Integrates with the OpenWeatherMap API for accurate weather data.
- **Data Processing**: Continuous monitoring and automatic checks for alert violations.

## How to run 

