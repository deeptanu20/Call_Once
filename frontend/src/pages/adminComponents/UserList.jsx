const UserList = ({ users }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li 
            key={user._id} 
            className="flex items-center px-6 py-5 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
          >
            <div className="flex-shrink-0 h-10 w-10">
              <img 
                className="h-10 w-10 rounded-full object-cover" 
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                alt={`${user.name}'s avatar`}
              />
            </div>
            <div className="ml-4 flex-grow">
              <div className="text-sm font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <div className="ml-4 flex-shrink-0">
              <a href={`tel:${user.phone}`} className="text-sm text-blue-500 hover:text-blue-700">
                {user.phone}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;

