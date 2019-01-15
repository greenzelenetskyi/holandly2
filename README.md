How to start with the project

1. Run npm install

2. Export database:

  - Run dbstart.sh
  
  - manually add username and password of the user as there is no registration page in this version
  
3. Add .env file to the working directory (please, fill the provided .env.example with your actual data)

4. Run ./startup.sh


API DOC: https://speca.io/greenzelenetskyi/holandlyapi?key=d4dea78d92f11f0b8c7370dadd8301b7


HOW TO USE WEBHOOKS

1. Add a secret XwebHookUrl field to the config json with your endpoint
2. Put true into the enableWebHook field of every event type, which you whould like receive web hook data about.
3. Set post routes for endpoint + registered and endpoint + cancelled

Request body object
{ 
  timezone: number, // positive integer means + zone
  eventid: number,
  type: string,
  name: string,
  email: string,
  insertion_time: string,
  timestamp: number 
}

example:

{ 
  timezone: 2, // means +2
  eventid: 98,
  type: 'exam',
  name: 'Adil Ramses',
  email: 'ramses@gmail.com',
  insertion_time: '2019-01-15T19:34:04.000Z',
  timestamp: 1547650800000 
}


