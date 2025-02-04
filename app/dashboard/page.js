import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Library Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Books</h2>
          <p className="text-gray-700 mb-4">Manage the library's book collection, including adding new books, editing existing ones, and deleting books.</p>
          <Link href="/dashboard/catalog" className="text-blue-600 hover:underline">
            Go to Book Catalog
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Members</h2>
          <p className="text-gray-700 mb-4">Manage library members, including adding new members, editing member details, and removing members.</p>
          <Link href="/dashboard/members" className="text-blue-600 hover:underline">
            Go to Members
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Loans</h2>
          <p className="text-gray-700 mb-4">Manage book loans, including issuing new loans, tracking due dates, and returning books.</p>
          <Link href="/dashboard/loans" className="text-blue-600 hover:underline">
            Go to Loans
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <p className="text-gray-700 mb-4">View various statistics about the library, including the number of books, members, and loans.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Total Books</h3>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Total Members</h3>
            <p className="text-2xl font-bold">567</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Books Loaned</h3>
            <p className="text-2xl font-bold">890</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Books Available</h3>
            <p className="text-2xl font-bold">344</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-700 mb-4">View recent activity in the library, including new books added, recent loans, and member registrations.</p>
        <ul className="list-disc list-inside">
          <li className="mb-2">New book added: "Introduction to Psychology" by John Smith</li>
          <li className="mb-2">Member registered: Maria Garcia</li>
          <li className="mb-2">Book loaned: "Advanced Calculus" to Maria Garcia</li>
          <li className="mb-2">Book returned: "Introduction to Psychology" by John Smith</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <p className="text-gray-700 mb-4">View notifications about overdue books, upcoming events, and other important information.</p>
        <ul className="list-disc list-inside">
          <li className="mb-2">Overdue book: "Introduction to Psychology" by John Smith</li>
          <li className="mb-2">Upcoming event: Book Fair on 25th December</li>
          <li className="mb-2">New member registered: Maria Garcia</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <p className="text-gray-700 mb-4">Manage library settings, including user roles, permissions, and other configurations.</p>
        <Link href="/dashboard/settings" className="text-blue-600 hover:underline">
          Go to Settings
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Help & Support</h2>
        <p className="text-gray-700 mb-4">Get help and support for using the library management system, including FAQs and contact information.</p>
        <Link href="/dashboard/help" className="text-blue-600 hover:underline">
          Go to Help & Support
        </Link>
      </div>
    </div>
  );
}
