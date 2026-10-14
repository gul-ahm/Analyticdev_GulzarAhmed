import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
    let connection;
    try {
        console.log('Connecting to database for migration...');

        // Use the same connection logic as the app
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT || '3306'),
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            multipleStatements: true
        });

        console.log('Attempting to add svg_icons column...');

        const sql = `ALTER TABLE projects ADD COLUMN svg_icons LONGTEXT NULL AFTER tags;`;

        await connection.query(sql);

        console.log('Migration successful.');
        return NextResponse.json({ success: true, message: 'Column svg_icons added successfully. code: 200' });

    } catch (error: any) {
        console.error('Migration error:', error);

        if (error.code === 'ER_DUP_FIELDNAME') {
            return NextResponse.json({ success: true, message: 'Column svg_icons already exists. No changes made.' });
        }

        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    } finally {
        if (connection) await connection.end();
    }
}
