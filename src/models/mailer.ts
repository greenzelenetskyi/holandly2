import nodemailer from 'nodemailer';
import mailgun from 'nodemailer-mailgun-transport';
import { logger } from '../config/visitor';
import { encryptData } from '../controllers/host';

interface TemplateVars {
    name: string,
    email: string,
    date: any,
    time: string,
    eventid?: any,
    event_data: any
}

const mailgunOptions = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    }
};

const mailer = nodemailer.createTransport(mailgun(mailgunOptions));

///testing config

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
        let variables: any = { ...event, user: name, reason: explanation };
        if(variables.eventid) {
            variables.eventid = encryptData(variables.eventid.toString());  /// id encryption
            variables.cancelLink = process.env.CANCEL_LINK + variables.eventid;
        }
        mailer.sendMail({
            from: process.env.DOMAIN_MAIL,
            to: event.email,
            subject: emailSubject + ' ' + event.event_data.title + ' ' + event.date
                + ' в ' + event.time,
            html: useTemplate(variables)
        }, function (err, info) {
            if (err) {
                logger.error('mailer: ' + err);
            }
            else {
                logger.info('Mail response: ' + info);
            }
        });
    })
};