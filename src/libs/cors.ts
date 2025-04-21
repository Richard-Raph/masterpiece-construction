import { NextApiRequest, NextApiResponse } from 'next';

export const allowCors = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        return await handler(req, res);
    };
};