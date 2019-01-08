import nodemailer from 'nodemailer';
import mailgun from 'nodemailer-mailgun-transport';
import moment from 'moment';

interface TemplateVars {
    name: string,
    email: string,
    date: string,
    time: string,
    before?: string,
    event_data: any
}

const mailgunOptions = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    }
};

const mailer = nodemailer.createTransport(mailgun(mailgunOptions));

// const mailer = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'hexalxyrnovz6wk6@ethereal.email',
//         pass: 'jBCaPvxe7UFeCf61VT'
//     }
// });


export const notify = async (events: TemplateVars[], name: string, explanation: string
    , emailSubject: string, useTemplate: Function) => {
    events.forEach((event: TemplateVars) => {
        event.date = moment(event.date).format('DD.MM.YYYY');
        if (events[0].hasOwnProperty('before')) {
            event.before = events[0].before;
        }
        mailer.sendMail({
            from: process.env.DOMAIN_MAIL,
            to: event.email,
            subject: emailSubject + ' ' + event.event_data.title + ' ' + event.date
                + ' в ' + event.time,
            html: useTemplate({ ...event, user: name, reason: explanation })
        }, function (err, info) {
            if (err) {
                console.log('Error: ' + err);
            }
            else {
                console.log('Response: ' + info);
            }
        });
    })
};

export const notifyVisitor = async (events: TemplateVars[], name: string, explanation: string
    , emailSubject: string, useTemplate: Function) => {
    events.forEach((event: TemplateVars) => {
        let dt = event.date;
        event.date = dt.slice(0,2) + '.' + dt.slice(3,5)+'.'+dt.slice(-4);
        if (events[0].hasOwnProperty('before')) {
            event.before = events[0].before;
        }
        console.log('event:  ', event);
        console.log('emailSubject:  ', emailSubject);
        console.log('event.event_data.title:  ', event.event_data.title);
        console.log('event.date:  ', event.date);
        console.log('event.time:  ', event.time);

        mailer.sendMail({
            from: process.env.DOMAIN_MAIL,
            to: event.email,
            subject: emailSubject + ' ' + event.event_data.title + ' ' + event.date
                + ' в ' + event.time,
            html: useTemplate({ title: event.event_data.title,  user: name, date: event.date, time: event.time })
        }, function (err, info) {
            if (err) {
                console.log('Error: ' + err);
            }
            else {
                console.log('Response: ' + info);
            }
        });
    })
};