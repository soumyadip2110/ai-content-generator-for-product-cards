import { useState } from "react";

export default function ProductCard({ data, isLoading }) {
    const [copied, setCopied] = useState(false);

    if (isLoading) {
        return (
            <div className="product-card skeleton" aria-busy="true">
                <div className="skeleton-line title" />
                <div className="skeleton-line text" />
                <div className="skeleton-line text short" />
                <div className="skeleton-tags">
                    <span className="skeleton-pill" />
                    <span className="skeleton-pill" />
                    <span className="skeleton-pill" />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="product-card empty-state">
                <p>Enter a product name and category to preview your AI-generated card.</p>
            </div>
        );
    }

    const handleCopy = async () => {
        const formatted = `${data.title}\n\n${data.description}\n\nKeywords: ${data.keywords.join(", ")}`;
        await navigator.clipboard.writeText(formatted);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <article className="product-card fade-in">
            <div className="card-header">
                <span className="card-badge">{data.category}</span>
                <button type="button" className="btn-copy" onClick={handleCopy}>
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <h2 className="card-title">{data.title}</h2>
            <p className="card-description">{data.description}</p>
            <div className="card-keywords">
                {data.keywords.map((keyword, index) => (
                    <span key={`${keyword}-${index}`} className="keyword-pill">
                        #{keyword}
                    </span>
                ))}
            </div>
        </article>
    );
}