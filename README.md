# Holandly

###Installing
This is a step-by-step tutorial on how to install Holandly
Start your installation from getting repository.
After that run command:

    npm install
    
Database and table preparation:

    dbstart.sh

You'll also have to manually typing the username and password 
of the user as there is no registration page in this version.

Customize configuration.

Add **.env** file to the working directory (please, fill the provided .env.example with your actual data)

###Run your backend application

    ./startup.sh
    
***Access the UI***
    
    yoursHost/edit  - web admin page. 
Provides the ability to view a list of people subscribed to events, as well as access to configure and edit events.

    yoursHost/owner - web events page of somes owner
That page contains all the events available for user registration for this owner

####_For example:_

___usaername = SHPP. SHPP is owner of events.___

___yoursHost = localhost___

admin page is ___localhost:port/edit___

events page is ___localhost:port/SHPP___

####HOW TO CREATE EVENTS

Holandly accepts a json file of the following structure as a configuration:
      
    toplevel:obj - general information of the owner
        title:String - title
        endmessage:String - event notification text message
        description:String - extended description
    timezone:String - owner’s time zone
    XwebhookUrl:String - URL notifications
    types:obj - owner events section
        enentNmae1:obj - event structure 1
              form:obj - form of registration
                    fields: array - info, required fields and validation
                        {
                        type:String
                        label:String
                        regex:String
                        minLen:String
                        },{
                        type:String
                        label:String
                        regex:String
                        }
              color:String - define colour of event
              title:String - name of event
              secret:Boolean - define visibility of event for all. if true event is invisible,
              enabled:Boolean - define enabling of event,
              location:String - description the location of the event
              override:Obj - define exceptions and overrides of scheduled events
                exactday: { - exceptions date
                  date: {
                    "slots": []
                  },
                  date: { overrides date
                    "reuse": date
                  }
              uniqueId:String - unique identifier of the event
              canCancel:Boolean - sets permission for event cancellation. If true the event can cancel
              rangeDays:Number - sets the number of days of event activity
              recurring:Obj - sets time slots per week for the event 
                weekly:Obj {
                  days:array - sets time slots per week 
                  [ 
                    { - day 0 slot
                      "slots":array - sets time slots per day 
                      [
                        {
                          time:String - time (foe example "10:00")
                        },
                      ]
                    },
                    { - day 1 slot
                      "reuse": 0 - sets use time slots  day's 0
                    },
                    { - day 2 slot
                    },
                    { - day 3 slot
                    },
                    { - day 4 slot
                    },
                    {  - day 5 slot
                      slots: 
                      [
                        {
                          time:String - time (foe example "11:00")
                        },
                        {
                          time:String - time (foe example "12:00")
                        },
                      ]
                    }
                  ]
                }
              },
              api_enabled:Boolean - allows api access,
              description:String -  event description
              durationMinutes:Number - sets the number of minutes of event duration
              cancellationPolicy:String - sets the Policy of cancellation
              concurrentVisitors:Number - version of event
            },
        enentNmae2:obj - event structure 2
         .... etc.
for example:
        
    { 
      toplevel":
         {
            title: "Школа программирования Ш++",
            endmessage: "Спасибо за регистрацию!",
            description: "Добро пожаловать! Выберите, пожалуйста, удобную для вас дату и время"
         },
      timezone: "GMT+3",
      XwebhookUrl: "http://....{{}}", //String 
      types: 
         {
        "grownups": {
          "form": {
            "fields": [
              {
                "type": "text",
                "label": "Имя И фамилия",
                "regex": ".+ .+",
                "minLen": 54
              },
              {
                "type": "text",
                "label": "email",
                "regex": ".*@.*\\..*"
              }
            ]
          },
          "color": "#00ffff",
          "title": "[14+ лет] Вступительный тест",
          "secret": false,
          "enabled": true,
          "location": "Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж",
          "override": {
            "exactday": {
              "2018.11.11": {
                "slots": []
              },
              "2018.11.12": {
                "reuse": "2018.11.11"
              }
            }
          },
          "uniqueId": "exam",
          "canCancel": true,
          "rangeDays": 15,
          "recurring": {
            "weekly": {
              "days": [
                {
                  "slots": [
                    {
                      "time": "10:00"
                    },
                    {
                      "time": "11:00"
                    },
                    {
                      "time": "12:00"
                    },
                    {
                      "time": "13:00"
                    },
                    {
                      "time": "14:00"
                    },
                    {
                      "time": "15:00"
                    },
                    {
                      "time": "16:00"
                    },
                    {
                      "time": "17:00"
                    }
                  ]
                },
                {
                  "reuse": 0
                },
                {
                  "reuse": 0
                },
                {
                  "reuse": 0
                },
                {
                  "reuse": 0
                },
                {
                  "slots": [
                    {
                      "time": "11:00"
                    },
                    {
                      "time": "12:00"
                    },
                    {
                      "time": "13:00"
                    },
                    {
                      "time": "14:00"
                    },
                    {
                      "time": "15:00"
                    },
                    {
                      "time": "16:00"
                    }
                  ]
                }
              ]
            }
          },
          "api_enabled": true,
          "description": "Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз",
          "durationMinutes": 120,
          "cancellationPolicy": "...",
          "concurrentVisitors": 2
        },
      }
    }
Сreation and editing can be performed on the admin page in the "patterns" tab
Also on the admin page there is the ability to upload JSON files from a PC
and download JSON file to PC for editing by any other editors.

####HOW TO USE WEBHOOKS
1. Add a secret XwebHookUrl field to the config json with your endpoint
2. Put true into the enableWebHook field of every event type, which you whould like receive web hook data about.
3. Set post routes for endpoint + registered and endpoint + cancelled

API DOC:
 
    https://speca.io/greenzelenetskyi/holandlyapi?key=d4dea78d92f11f0b8c7370dadd8301b7

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

for example:

    { 
      timezone: 2, // means +2
      eventid: 98,
      type: 'exam',
      name: 'Adil Ramses',
      email: 'ramses@gmail.com',
      insertion_time: '2019-01-15T19:34:04.000Z',
      timestamp: 1547650800000 
    }


