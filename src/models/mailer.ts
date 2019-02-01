
import { logger } from '../config/host';
import { encryptData } from '../controllers/host';
import {mailer} from '../config/host'
interface TemplateVars {
    name: string,
    email: string,
    date: any,
    time: string,
    eventid?: any,
    event_data: any
}

///testing config

// const mailer = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'hexalxyrnovz6wk6@ethereal.email',
//         pass: 'jBCaPvxe7UFeCf61VT'
//     }
// });

export const sendNotification = (address: string, subject: string, variables:any, useTemplate: Function) => {
    mailer.sendMail({
        from: process.env.DOMAIN_MAIL,
        to: address,
        subject: subject,
        html: useTemplate(variables)
    }, function (err, info) {
        if (err) {
            logger.error('mailer: ' + err);
        }
        else {
            logger.info('Mail response: ' + info);
        }
    });
}


export const notify = (events: TemplateVars[], name: string, explanation: string
    , emailSubject: string, useTemplate: Function) => {
    events.forEach((event: TemplateVars) => {
        let variables: any = { ...event, user: name, reason: explanation };
        if(variables.eventid) {
            variables.eventid = encryptData(variables.eventid.toString());  /// id encryption
            variables.cancelLink = process.env.CANCEL_LINK + variables.eventid;
        }
        sendNotification(event.email, emailSubject + ' ' + event.event_data.title + ' ' + event.date
        + ' в ' + event.time, variables, useTemplate);
    })
};