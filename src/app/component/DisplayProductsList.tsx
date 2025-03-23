"use client";
import { useEffect, useReducer } from 'react';
import { ProductType } from '@/app/types/products.interface';
import { addProduct } from '@/app/callapi/callapi';
import { getProduct } from '@/app/callapi/callapi';

//ประกาศค่า
const initialState = {
  name: "",
  price: "",
  stock: "",
  products: [] as ProductType[],
};

//กำหนด action
type Action =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_PRICE"; payload: string }
  | { type: "SET_STOCK"; payload: string }
  | { type: "SET_PRODUCTS"; payload: ProductType[] }
  | { type: "RESET_FORM" };

//กำหนด case สำหรับข้อมูลแต่ละตัว
const productReducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_PRICE":
      return { ...state, price: action.payload };
    case "SET_STOCK":
      return { ...state, stock: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "RESET_FORM":
      return { ...state, name: "", price: "", stock: "" };
    default:
      return state;
  }
};


export default function DisplayProductsList() {
  //ใช้ useReducer แทน useState จะได้จัดการข้อมูลง่ายขึ้น
  const [state, dispatch] = useReducer(productReducer, initialState);

  // ฟังก์ชันสำหรับส่งข้อมูลสินค้าไปที่ API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันการ reload หน้าเมื่อ submit ฟอร์ม

    const product: ProductType = {
      id: 0,
      name: state.name,
      price: parseFloat(state.price), //แปลงค่าเป็น number ก่อนส่ง 
      stock_quantity: parseInt(state.stock), //แปลงค่าเป็น number ก่อนส่ง 
    };

    try {
      const res = await addProduct(product);
      if (res.status === 200) {
        alert('Product added successfully');
        //reset form
        dispatch({ type: "RESET_FORM" });
        //update products list
        dispatch({ type: "SET_PRODUCTS", payload: [...state.products, product] });
        // ดึงข้อมูล product
        fetchProducts(); 
      } else {
        alert('Failed to add product');
      }
    } catch {
      // console.log("Error Submit",error)
      alert('Error Submit');
    }
  };

  // ฟังก์ชันสำหรับดึงรายการสินค้าจาก API
  const fetchProducts = async () => {
    //เรียก api
    const res = await getProduct();
    const data: ProductType[] = await res.data;
    //set product
    dispatch({ type: "SET_PRODUCTS", payload: data }); 
  };

  // ดึงข้อมูลทุกครั้งที่โหลดหน้าเว็บ
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={state.name}
          onChange={(e) => dispatch({ type: "SET_NAME", payload: e.target.value })}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          value={state.price}
          onChange={(e) => dispatch({ type: "SET_PRICE", payload: e.target.value })}
          placeholder="Price"
          required
        />
        <input
          type="number"
          value={state.stock}
          // ถ้าพิมพ์จุดจะ alert กันกรอกปริมาณเป็นทศนิยม
          onKeyDown={(e) => {
            if (e.key === ".") {
              e.preventDefault();
              alert("Integer Only!");
            }
          }}
          onChange={(e) => dispatch({ type: "SET_STOCK", payload: e.target.value })}
          placeholder="Stock Quantity"
          required
        />
        <button type="submit">Add Product</button>
      </form>

      <h2>Product List (Sorted by Price)</h2>
      <ul>
        {/* map data sort by price */}
        {state.products.map((product, index) => (
          <li key={index}>
            ID {product.id} : {product.name} - In Stock: {product.stock_quantity} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

