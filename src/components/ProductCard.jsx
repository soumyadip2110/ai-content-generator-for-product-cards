export default function ProductCard({ data, isLoading }) {
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

    return (
        <article className="product-card fade-in">
            <span className="card-badge">{data.category}</span>
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