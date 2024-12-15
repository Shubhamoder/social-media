import React, { useState } from 'react';

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const userData = {
            username,
            email,
            password,
        };
    
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log('User registered successfully', data);
            } else {
                console.log('Error:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    return (
        <div className="flex min-h-full flex-col  px-6 py-12 lg:px-8">
        <div>
      <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Register</h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit}>
        <div className='m-2'>
      <label for="email" class="block text-start text-sm/6 font-medium text-gray-900">User Name</label>
            <div className='mt-2'>
            <input 
                type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Username"
            /></div>
            </div>
            <div className='m-2'>
      <label for="email" class="block text-start text-sm/6 font-medium text-gray-900">Email address</label>
            <div className='mt-2'>
            <input 
                type="email" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email"
            />
            </div>
            </div>
            <div className='m-2'>
            <label for="email" class="block text-start text-sm/6 font-medium text-gray-900">Password</label>
            <div className='mt-2'>
            <input 
                type="password" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password"
            />
            </div>
            </div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
        </form>
        <p class="mt-10 text-center text-sm/6 text-gray-500">
      Already have a account?
      <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Login Now</a>
    </p>
        </div>
        </div>
    );
};

export default RegisterPage;
