import { Pool } from 'pg';

export const connectionPool:Pool = new Pool({
    host:process.env['LB_HOST'], //localhost is default value. if this address is localhost this is undefined, restart vscode
    user:process.env['LB_USER'],
    password:process.env['LB_PASSWORD'],
    database:process.env['LB_DATABASE'],
    port:5432, // standard db port
    max:5 // max # connections
})