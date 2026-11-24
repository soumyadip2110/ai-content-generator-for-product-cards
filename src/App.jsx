import { useState, useRef, useEffect } from "react";
import ProductForm from "./components/ProductForm";
import ProductCard from "./components/ProductCard";
import { generateProductDetails } from "./services/aiService";
import "./App.css";

const SLOW_THRESHOLD_MS = 15000;

export default function App() {
	const [cardData, setCardData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isTakingLong, setIsTakingLong] = useState(false);
	const [error, setError] = useState("");

	const abortControllerRef = useRef(null);

	useEffect(() => {
		if (!isLoading) {
			setIsTakingLong(false);
			return;
		}

		const timer = setTimeout(() => {
			setIsTakingLong(true);
		}, SLOW_THRESHOLD_MS);

		return () => clearTimeout(timer);
	}, [isLoading]);

	const handleGenerate = async (productName, category) => {
		abortControllerRef.current?.abort();
		const controller = new AbortController();
		abortControllerRef.current = controller;

		setIsLoading(true);
		setIsTakingLong(false);
		setError("");

		try {
			const result = await generateProductDetails(productName, category, controller.signal);
			setCardData({ ...result, category: category.trim() });
		} catch (err) {
			if (err.message === "REQUEST_CANCELED") {
				setError("Generation canceled.");
			} else {
				setError(err.message || "Something went wrong. Please try again.");
			}
		} finally {
			if (abortControllerRef.current === controller) {
				setIsLoading(false);
				setIsTakingLong(false);
			}
		}
	};

	const handleCancel = () => {
		abortControllerRef.current?.abort();
	};

	return (
		<main className="app-container">
			<header className="app-header">
				<h1>CardCraft AI</h1>
				<p>Instant, structured product copy powered by AI.</p>
			</header>

			<section className="workspace">
				<ProductForm onGenerate={handleGenerate} isLoading={isLoading} />

				{isLoading && isTakingLong && (
					<div className="status-banner fade-in" role="status">
						<span>The AI is taking more time than usual, please wait...</span>
						<button type="button" className="btn-cancel" onClick={handleCancel}>
							Cancel
						</button>
					</div>
				)}

				{error && (
					<div className="error-banner fade-in" role="alert">
						{error}
					</div>
				)}

				<ProductCard data={cardData} isLoading={isLoading} />
			</section>
		</main>
	);
}