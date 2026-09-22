// Created by: Brigham
// Edited by: Brigham

import "./SavedItems.css";

function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 15H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function SavedItemSkeleton() {
  return (
    <div className="saved-item-card saved-item-skeleton">
      <div className="skeleton-image" />

      <div className="skeleton-content">
        <div className="skeleton-line skeleton-provider" />
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-price" />
        <div className="skeleton-line skeleton-rating" />

        <div className="skeleton-buttons">
          <div className="skeleton-button" />
          <div className="skeleton-button" />
        </div>
      </div>
    </div>
  );
}

function SavedItems() {
  return (
    <main className="saved-items-page">
      <div className="saved-items-container">
        <nav className="saved-items-breadcrumb" aria-label="Breadcrumb">
          <span className="breadcrumb-home">
            <HomeIcon />
            <span>Home</span>
          </span>

          <ChevronRightIcon />

          <span className="breadcrumb-current">Saved Items</span>
        </nav>

        <header className="saved-items-header">
          <h1>Saved Items</h1>

          <p>
            Keep track of the products and services you love. You can remove
            items anytime.
          </p>
        </header>

        <div className="saved-items-controls">
          <div className="saved-items-tabs">
            <button className="saved-items-tab active" type="button">
              Products
              <span className="saved-items-count">—</span>
            </button>

            <button className="saved-items-tab" type="button">
              Services
              <span className="saved-items-count">—</span>
            </button>
          </div>

          <button className="clear-all-button" type="button">
            <TrashIcon />
            <span>Clear all</span>
          </button>
        </div>

        <section className="saved-items-grid" aria-label="Saved items">
          {Array.from({ length: 8 }, (_, index) => (
            <SavedItemSkeleton key={index} />
          ))}
        </section>

        <div className="saved-items-pagination">
          <p className="pagination-summary">Loading saved items...</p>

          <div className="pagination-controls">
            <button
              className="pagination-button"
              type="button"
              aria-label="Previous page"
              disabled
            >
              <ChevronRightIcon />
            </button>

            <button
              className="pagination-button pagination-number active"
              type="button"
            >
              1
            </button>

            <button
              className="pagination-button pagination-number"
              type="button"
            >
              2
            </button>

            <button
              className="pagination-button"
              type="button"
              aria-label="Next page"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SavedItems;