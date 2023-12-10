import { useState, useEffect } from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import Modal from './Modal';

function Dashboard() {
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/devices')
      .then((response) => response.json())
      .then((data) => setTableData(data))
      .catch((error) => console.error('Error fetching data:', error));
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
              <tr key={item.id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                <td className='px-6 py-4'>{item.deviceName}</td>
                <td className='px-6 py-4'>{item.assignedIP}</td>
                <td className='px-6 py-4'>{item.publicKey}</td>
                <td className='px-6 py-4'>
                  <button onClick={() => handleAction(item.id)}>Action</button>
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
