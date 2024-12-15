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
