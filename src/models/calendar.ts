const { google } = require('googleapis');
import moment from 'moment';
import { logger } from '../config/host';


interface Event {
    date: string,
    time: string,
    email: string,
    name: string, 
    event_data: any
}

const calendId = process.env.CALENDAR_ID;

// configure a JWT auth client
let jwtClient = new google.auth.JWT(
    process.env.GOOGLE_EMAIL,
    null,
    process.env.GOOGLE_KEY.replace(/\\n/g, '\n'),
    [process.env.GOOGLE_PATH]);

//authenticate request
jwtClient.authorize((err: Error, tokens: any) => {
    if (err) {
        return;
    } else {
        logger.info('Google api authorization is successful');
    }
});

const callApi = (apiFunction: Function, apiObject: any) => {
    return new Promise((resolve, reject) => {
        apiFunction(apiObject, (err: Error, response: any) => {
            if (err) {
                return reject(err);
            }
            resolve(response);
        })
    })
}

//Google Calendar API
const calendar = google.calendar('v3');

export const insertToCalendar = async (data: Event, id: string) => {
    try {
        let apiResponse: any = await callApi(calendar.events.insert, {
            auth: jwtClient,
            calendarId: calendId,
            resource: {
                'id': id,
                'summary': data.event_data.title,
                'start': {
                    'dateTime': moment(data.date + ' ' + data.time, "DD-MM-YYYY HH:mm")
                },
                'end' : {
                    'dateTime' :  moment(data.date + ' ' + data.time, "DD-MM-YYYY HH:mm")
                },
                "attendees": [
                    {
                      "email": data.email,
                      "displayName": data.name
                    }
                ]
            }
        });
        logger.info('Event created: %s', apiResponse.data.htmlLink);
    } catch (err) {
        logger.error('The API returned an error: ' + err.message);
    }
}

export const deleteCalendarEvent = async (eventId: string) => {
    try {
        let apiResponse = await callApi(calendar.events.delete, {
            auth: jwtClient,
            calendarId: calendId,
            eventId: eventId
        });
        logger.info('Event deleted');
    } catch (err) {
        logger.error('The API returned an error: ' + err.message);
    }
}

export const updateEvent = async (eventId: any, resourceFields: any) => {
    try {
        let apiResponse = await callApi(calendar.events.patch, {
            auth: jwtClient,
            calendarId: calendId,
            eventId: eventId,
            resource: resourceFields
        });
        console.log('Event updated');
    } catch (err) {
        console.log('The API returned an error: ' + err.message);
    }
}