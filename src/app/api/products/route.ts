import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { ProductType } from "@/app/types/products.interface";

//หา path ที่แน่นอน
const dbPath = path.join(process.cwd(), "database", "products.db");

// เปิดการเชื่อมต่อเพื่อเข้าถึงฐานข้อมูล
async function getDB() {
  return open({ filename: dbPath, driver: sqlite3.Database });
}

//เรียกดูข้อมูล
export async function GET() {
  try {
    //เชื่อมต่อฐานข้อมูล
    const db = await getDB();
    // ทดสอบการเชื่อมต่อ database
    // await db.get("SELECT 1");
    //return NextResponse.json({ message: "Database connected successfully!" });
    const products: ProductType[] = await db.all(`SELECT * FROM products ORDER BY price ASC`); //เลือกข้อมมูลทั้งหมดโดยเรียงตามราคาจากน้อยไปมาก
    return NextResponse.json(products);

  } catch {
    //กรณีเชื่อมต่อไม่สำเร็จ
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}

//ส่งค่าข้อมูลบันทึกลงฐานข้อมูล
export async function POST(req: NextRequest) {
  try {
    // ดึงข้อมูลจาก request body
    const { name, price, stock_quantity }: ProductType = await req.json();
    // เชื่อมต่อฐานข้อมูล
    const db = await getDB();
    // console.log('Database connected!');

    //ถ้าไม่มีตาราง สร้างตาราง products 
    await db.run(`
          CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            stock_quantity INTEGER NOT NULL
          )
        `);

    // เพิ่มข้อมูลสินค้าลงในฐานข้อมูล
    const result = await db.run(
      `INSERT INTO products (name, price, stock_quantity) VALUES (?, ?, ?)`,
      [name, price, stock_quantity]
    );
    // console.log('Product added successfully.', result.lastID);

    // ส่งกลับข้อมูล id แถวล่าสุดที่ถูกเพิ่ม
    return NextResponse.json({ id: result.lastID }, { status: 200 }); 
  } catch{
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });

  }
}

