import { useState } from "react";
import ProductForm from "./components/ProductForm";
import ProductCard from "./components/ProductCard";
import { generateProductDetails } from "./services/aiService";
import "./App.css";

export default function App() {
	const [cardData, setCardData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleGenerate = async (productName, category) => {
		setIsLoading(true);
		setError("");

		try {
			const result = await generateProductDetails(productName, category);
			setCardData({ ...result, category: category.trim() });
		} catch (err) {
			setError(err.message || "Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="app-container">
			<header className="app-header">
				<h1>CardCraft AI</h1>
				<p>Instant, structured product copy powered by AI.</p>
			</header>

			<section className="workspace">
				<ProductForm onGenerate={handleGenerate} isLoading={isLoading} />

				{error && (
					<div className="error-banner" role="alert">
						{error}
					</div>
				)}

				<ProductCard data={cardData} isLoading={isLoading} />
			</section>
		</main>
	);
}