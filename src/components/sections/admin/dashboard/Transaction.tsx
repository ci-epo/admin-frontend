/**
 * Carte "Recent Sales". Le tableau est généré par GridJS via
 * le script /assets/libs/gridjs/gridjs.umd.js qui cherche #gridjs_sort-table.
 */
export default function Transaction() {
  return (
    <div className="card card-h-100">
      <div className="card-header">
        <h4>Transactions</h4>
        <a href="#" className="link">
          View All
        </a>
      </div>
      <div className="card-body">
        <div id="gridjs_sort-table"></div>
      </div>
    </div>
  );
}