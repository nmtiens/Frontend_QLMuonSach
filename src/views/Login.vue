<template>
  <div class="login-wrapper">
    <h1>Quản Lý Sách</h1>
    <div class="login-container">
      <h2>Đăng Nhập</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Tên người dùng:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Mật khẩu:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Đăng Nhập</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>
        Chưa có tài khoản? <span @click="navigateToRegister" class="link">Đăng ký.</span>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchDocGias } from '../services/api'; // Ensure this API service is correctly imported

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');

   const handleLogin = async () => {
  try {
    const { data: docGias } = await fetchDocGias();
    console.log("Fetched Readers:", docGias);

    const matchedReader = docGias.find(docGia => 
      `${docGia.HoLot} ${docGia.Ten}`.trim() === username.value.trim() && 
      docGia.DienThoai === password.value.trim()
    );

    if (matchedReader) {
      // Save the reader's ID, name, and role to localStorage
      localStorage.setItem('loggedInUser', JSON.stringify({
        MaDocGia: matchedReader.MaDocGia,
        HoLot: matchedReader.HoLot,
        Ten: matchedReader.Ten,
        role: 'reader' // Make sure to set the correct role here
      }));
      errorMessage.value = '';
      router.push('/user');
    } else if (username.value === 'admin' && password.value === '1234') {
      // Store admin user in localStorage
      localStorage.setItem('loggedInUser', JSON.stringify({
        MaDocGia: null, // Admin might not have this; adjust as needed
        HoLot: 'Admin', // Or the admin's full name
        Ten: '',
        role: 'admin'
      }));
      errorMessage.value = '';
      router.push('/admin');
    } else {
      errorMessage.value = 'Tên người dùng hoặc số điện thoại không đúng!';
    }
  } catch (error) {
    errorMessage.value = 'Có lỗi xảy ra, vui lòng thử lại.';
    console.error("Error fetching readers:", error);
  }
};



    const navigateToRegister = () => {
      router.push('/register'); // Navigate to the Register page
    };

    return {
      username,
      password,
      errorMessage,
      handleLogin,
      navigateToRegister,
    };
  },
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to right, #4b79a1, #283e51); /* Gradient background */
}

.login-container {
  max-width: 400px;
  width: 100%;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.9); /* Semi-transparent white */
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

h1 {
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.link {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>

