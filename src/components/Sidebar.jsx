import { NavLink, useLocation } from 'react-router-dom';
import { SidebarItems } from './Index';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sm:col-span-2">
      {SidebarItems.map((item) => (
        <NavLink
          key={item._id}
          to={item.path}
          className={`flex items-center justify-center p-2 space-x-2 rounded-lg my-3 cursor-pointer ${
            location.pathname === item.path
              ? 'dark:bg-green-500 bg-green-500 text-white dark:text-black'
              : 'dark:bg-gray-800 bg-slate-200'
          }`}
        >
          <div className='flex space-x-2'>
            {item.icon}
            <span className=''>{item.title}</span>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
