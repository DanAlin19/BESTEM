import React, { useState } from 'react';

export default function Modal() {
    const [showModal, setShowModal] = React.useState(false);
    const [nume, setDeviceName] = useState('');
    const [public_key, setPublicKey] = useState('')
    const [data, setData] = useState(null);

    const handleCloseModal = () => {
        setShowModal(false);
        window.location.reload();
      };

    const handleDeviceSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not available');
                return;
            }

            const response = await fetch('http://207.154.232.144:5001/create_device', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nume, token, public_key }),
            });

            if (response.ok) {
                const responseData = await response.json();

                if (responseData.error) {
                    console.error('Error creating device:', responseData.error);
                } else {
                    setData(responseData);
                }
            } else {
                console.error('Error creating device:', response.statusText);
            }
        } catch (error) {
            console.error('Error during device creation:', error.message);
        }
    };

    return (
        <>
            <button
                className="mt-5 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(true)}
            >
                ADD DEVICE
            </button>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                                    <h3 className="text-3xl font-semibold">
                                        Add device
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                <div className="relative p-6 flex-auto bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                                    {data ? (
                                        <>
                                            <h3>Config file for WireGuard:</h3>
                                            <pre>
                                                {`
[Interface]
PrivateKey = your_private_key
Address = ${data.ip_address}
DNS = 8.8.8.8

[Peer]
PublicKey = Re4wZYULpX35UvNu58tb/ILlcgfesgCmc/94cDXJrns=
AllowedIPs = 0.0.0.0/0
Endpoint = 207.154.232.144:5100
                        `}
                                            </pre>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                value={nume}
                                                onChange={(e) => setDeviceName(e.target.value)}
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                required
                                            />
                                            <input
                                                value={public_key}
                                                onChange={(e) => setPublicKey(e.target.value)}
                                                type="text"
                                                name="public_key"
                                                id="public_key"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                required
                                            />
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-solid bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => handleCloseModal()}
                                    >
                                        Close
                                    </button>
                                    {data ? <></> : <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => handleDeviceSubmit()}
                                    >
                                        Generate
                                    </button>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}
