import { generateProductDetails } from "./services/aiService";

export default function App() {
	const runTest = async () => {
		try {
			console.log("Testing AI Service...");
			const result = await generateProductDetails("AeroPress Go", "Coffee & Kitchen");
			console.log("SUCCESS:", result);
		} catch (err) {
			console.error("TEST FAILED:", err.message);
		}
	};

	return <button onClick={runTest} style={{ margin: "2rem" }}>Test AI Service</button>;
}