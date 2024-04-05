import { Link } from 'react-router-dom';
import { SidebarItems } from './Index';

const Sidebar = () => {
  return (
    <div className="sm:col-span-2">
      {SidebarItems.map((item) => (
        <Link key={item._id} to={`${item.path}`}>
          <div className="flex items-center justify-center p-2 space-x-2 bg-gray-800 rounded-lg my-3 cursor-pointer hover:bg-gray-700">
            {item.icon}
            <span>{item.title}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
