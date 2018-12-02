import { Request, Response } from "express";
import * as hostModel from '../models/host';
import { logger } from '../config/host';

export const setConfiguration = async (req: Request, res: Response) => {
    try {
        let privateData = {};
        let configuration;
        let publicData = configuration = req.body;
        filterPrivateData(publicData, privateData);
        let status = await hostModel.updateConfig(req.app.get('dbPool'), configuration, publicData, privateData, 1);
        if (status.affectedRows > 0) {

        } else {
            res.status(400).end();
        }
    } catch (err) {
        logger.error(err);
        res.status(500).end();
    }
}

const filterPrivateData = (config: any, secureData: any) => {
    for (let property in config) {
        if (config.hasOwnProperty(property)) {
            if (property.startsWith(process.env.SECRET_PREFIX)) {
                secureData[property.substring(1)] = config[property];
                delete config[property];
            } else {
                if (typeof config[property] === 'object') {
                    filterPrivateData(config[property], secureData);
                }
            }
        }
    }
}

export const getConfigData = async (req: Request, res: Response) => {
    try {
        let json = await hostModel.getConfigData(req.app.get('dbPool'), 'configuration', 1);
        if (json.length > 0) {
            res.json(JSON.parse(json[0].configuration));
        }
        res.status(400).end();
    } catch (err) {
        logger.error(err);
    }
}
