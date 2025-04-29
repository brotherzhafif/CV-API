// Fungsi untuk melakukan login
const login = async () => {
    const email = "raja@example.com"; // Ganti dengan email yang ingin digunakan
    const password = "woylah1234"; // Ganti dengan password yang ingin digunakan

    try {
        // Kirim request ke API login
        const response = await fetch('https://cv-api-six.vercel.app/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Periksa apakah respons valid
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            return;
        }

        const data = await response.json();
        console.log('Login berhasil:', data);

        // Tampilkan token di console atau gunakan sesuai kebutuhan
        console.log('Token:', data.token);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Panggil fungsi login
login();