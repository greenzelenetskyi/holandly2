const { google } = require('googleapis');
import moment from 'moment';
import { logger } from '../config/host';


interface Event {
    
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

export const insertToCalendar = async (newEvent: any) => {
    let dateTime = moment(newEvent.date + ' ' + newEvent.time).format();
    //let id = '1100' + newEvent.eventId;
    try {
        let apiResponse: any = await callApi(calendar.events.insert, {
            auth: jwtClient,
            calendarId: calendId,
            resource: {
                'id': newEvent.eventId,
                'summary': newEvent.type,
                'start': {
                    'dateTime': dateTime,
                },
                'end': {
                    'dateTime': moment(dateTime).add(newEvent.duration, 'minutes'),
                }
            }
        });
        //console.log('Event created: %s', apiResponse.data.htmlLink);
    } catch (err) {
        console.log('The API returned an error: ' + err.message);
    }
}

export const deleteCalendarEvent = async (eventId: string) => {
    try {
        let apiResponse = await callApi(calendar.events.delete, {
            auth: jwtClient,
            calendarId: calendId,
            eventId: eventId
        });
        console.log('Event deleted');
    } catch (err) {
        console.log('The API returned an error: ' + err.message);
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