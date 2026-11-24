import ProductCard from "./components/ProductCard";

const MOCK_DATA = {
	category: "Coffee & Kitchen",
	title: "AeroPress Go Portable Travel Coffee Press",
	description:
		"Engineered for an active lifestyle, the AeroPress Go delivers rich, smooth coffee anywhere your adventures take you. This compact all-in-one system conveniently packs into its own travel mug.",
	keywords: ["aeropress", "travel coffee", "espresso", "portable brew"],
};

export default function App() {
	return (
		<div style={{ maxWidth: "500px", margin: "2rem auto", display: "grid", gap: "1rem" }}>
			<ProductCard data={null} isLoading={false} />
			<ProductCard data={MOCK_DATA} isLoading={false} />
		</div>
	);
}