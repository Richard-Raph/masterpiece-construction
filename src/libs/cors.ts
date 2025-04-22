import { NextApiRequest, NextApiResponse } from 'next';

export const allowCors = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const allowedOrigins = process.env.NODE_ENV === 'production'
            ? ['https://masterpiece-construction.onrender.com']
            : ['*'];

        const origin = req.headers.origin;
        if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin))) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        } else {
            res.setHeader('Access-Control-Allow-Origin', '');
        }

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        return await handler(req, res);
    };
};
