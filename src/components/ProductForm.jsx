import { useState } from "react";

export default function ProductForm({ onGenerate, isLoading }) {
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!productName.trim() || !category.trim() || isLoading) return;
        onGenerate(productName, category);
    };

    return (
        <form className="card-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="productName">Product Name</label>
                <input
                    id="productName"
                    type="text"
                    placeholder="e.g., AeroPress Go"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    maxLength={100}
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                    id="category"
                    type="text"
                    placeholder="e.g., Coffee & Kitchen"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    maxLength={50}
                    required
                    disabled={isLoading}
                />
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate Details"}
            </button>
        </form>
    );
}