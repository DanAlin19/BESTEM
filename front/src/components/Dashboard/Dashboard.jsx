import { useState, useEffect } from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import Modal from './Modal';

function Dashboard() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchUserDevices = async () => {
      try {
        const token = localStorage.getItem('token');
  
        if (!token) {
          console.error('Token not available');
          return;
        }
  
        const response = await fetch('http://207.154.232.144:5001/get_Userdevices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
  
        if (response.ok) {
          const data = await response.json();
  
          if (data.devices && Array.isArray(data.devices)) {
            setTableData(data.devices);
            console.log(tableData);
          } else {
            console.error('Invalid data format:', data);
          }
        } else {
          console.error('Error fetching user devices:', response.statusText);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
      }
    };
  
    fetchUserDevices();
  }, []);

  return (
    <div className='h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900'>
      <div className='sm:w-3/4 w-full relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Device Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Assigned IP
              </th>
              <th scope='col' className='px-6 py-3'>
                Public Key
              </th>
              <th scope='col' className='px-6 py-3'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item) => (
              <tr key={item.device_id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                <td className='px-6 py-4'>{item.nume}</td>
                <td className='px-6 py-4'>{item.IpAddress}</td>
                <td className='px-6 py-4'>{item.Publickey}</td>
                <td className='px-6 py-4'>
                  <button onClick={() => handleAction(item.device_id)}>DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>   
      <Modal/>   
    </div>
  );
}

export default Dashboard;
