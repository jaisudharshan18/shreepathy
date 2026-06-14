import { Link } from 'react-router-dom';

export function AuthNav() {
  return (
    <div className="flex items-center gap-4">
      <Link
        to="/account"
        className="text-sm font-semibold text-bakery-chocolate/85 hover:text-bakery-brown transition-colors"
      >
        Account
      </Link>
      <Link
        to="/admin"
        className="text-sm font-semibold text-bakery-chocolate/85 hover:text-bakery-brown transition-colors"
      >
        Admin
      </Link>
    </div>
  );
}
