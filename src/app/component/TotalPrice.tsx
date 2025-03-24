"use client";
import React, { useEffect, useState } from 'react'

const TotalPrice = () => {
    const [totalResult,setTotalResult] = useState(0);
    const [newTotalResult,setNewTotalResult] = useState(0);

    //set ค่าเพื่อทดสอบ
    const order = [
        { id: 1, price: 33, quantity: 3 },
        { id: 2, price: 365, quantity: 2 }
    ];

    //เป้าหมายคือหาจุดที่ทำให้ฟังก์ชันช้าและปรับปรุงให้เร็วขึ้น
    // ปัญหาที่อาจทำให้ฟังก์ชันช้ามีหลายสาเหตุ เช่น การเขียนเรียกทำข้อมูลซ้ำเกินจำเป็น มีโครงสร้างที่ไม่มีประสิทธิภาพ ทำให้มี Time complexity (Big O) ที่ใหญ่เกินไป

    //ถ้านี่คือฟังก์ชั่นเดิม
    function calculateTotal(orderItems: { id: number, price: number, quantity: number }[]): number {
        let total = 0;
        orderItems.forEach(item => { //ใช้ forEach ในการวน loop รวมค่า
            total += item.price * item.quantity; // เอาราคาคูณจำนวนเอาไปบวกเก็บไว้ใน total 
        });
        return total;
    }

    //ฟังก์ชั่นใหม่ 
    function newCalculateTotal(orderItems: { id: number, price: number, quantity: number }[]): number {
        //ใช้ reduce แทน forEach เพราะ forEach มีการเรียกฟังก์ชั่นทุกการวน loop เกิดการทำซ้ำมาก หากข้อมูลมีขนาดเล็กอาจเกิดปัญหาไม่มาก 
        // (ในกรณีนี้ที่ข้อมูลมี 2 ค่า n จะยกกำลัง 2) แต่หากข้อมูลมีขนาดใหญ่การทำซ้ำยิ่งใหญ่ขึ้นเป็นทวีคูณ
        //  แต่ reduce เป็นการสะสมผลลัพธ์ไม่ได้ทำซ้ำฟังก์ชั่น และ code ก็สั้นและดูสะอาดขึ้นมาก
        return orderItems.reduce((total, item) => total + item.price * item.quantity, 0); // เอาราคาคูณจำนวนเอาไปบวกเก็บไว้ใน total 
    }
    
    //ไม่ให้ render ซ้ำ
    useEffect(() => {
        const totalPrice = calculateTotal(order);
        setTotalResult(totalPrice)
        const newTotalPrice = newCalculateTotal(order);
        setNewTotalResult(newTotalPrice)
      }, []);

  return (
    <div style={{marginTop:'4em'}}>
        <h1>Assignment 2: Debugging Task</h1>
        <h4>Total Revenue : {totalResult}</h4>
        <h4>New Total Revenue : {newTotalResult}</h4>
    </div>
  )
}

export default TotalPrice