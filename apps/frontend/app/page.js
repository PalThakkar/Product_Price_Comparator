'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Home(){
  const [products, setProducts] = useState([]);
  async function fetch(){
    const res = await axios.get('http://localhost:4000/api/products');
    setProducts(res.data);
  }
  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">PriceWatch</h1>
      <button onClick={fetch} className="px-4 py-2 bg-slate-800 text-white rounded">Load Products</button>
      <ul>
        {products.map(p => <li key={p._id}>{p.title} — ₹{p.currentPrice}</li>)}
      </ul>
    </main>
  )
}
