<template>
  <div class="register-wrapper">
    <h1>Quản Lý Sách</h1>
    <div class="register-container">
      <h2>Đăng ký</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="hoLot">Mã Độc Giả:</label>
          <input type="text" id="maDocGia" v-model="maDocGia" required />
        </div>

        <div class="form-group">
          <label for="hoLot">Họ Lót:</label>
          <input type="text" id="hoLot" v-model="hoLot" required />
        </div>
        
        <div class="form-group">
          <label for="ten">Tên:</label>
          <input type="text" id="ten" v-model="ten" required />
        </div>

        <div class="form-group">
          <label for="dienThoai">Điện Thoại:</label>
          <input type="text" id="dienThoai" v-model="dienThoai" required />
        </div>

        <button type="submit">Đăng Ký</button>
      </form>
      <p>
        Bạn đã có tài khoản? <span @click="navigateToLogin" class="link">Đăng nhập.</span>
      </p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { addDocGia } from '../services/api';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const maDocGia = ref('');
    const hoLot = ref('');
    const ten = ref('');
    const dienThoai = ref('');
    const errorMessage = ref('');
    const successMessage = ref('');

    const handleRegister = async () => {
      if (!maDocGia.value || !hoLot.value || !ten.value || !dienThoai.value) {
        errorMessage.value = 'Vui lòng điền đầy đủ thông tin.';
        return;
      }

      const newDocGia = {
        MaDocGia: maDocGia.value,
        HoLot: hoLot.value,
        Ten: ten.value,
        DienThoai: dienThoai.value,
      };

      try {
        await addDocGia(newDocGia);
        successMessage.value = 'Đăng ký thành công!';
        errorMessage.value = ''; // Clear any error message

        // Clear form fields
        resetForm();

        // Redirect to login page after 1.5 seconds
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } catch (error) {
        errorMessage.value = 'Có lỗi xảy ra, vui lòng thử lại.';
        successMessage.value = ''; // Clear any success message
        console.error(error);
      }
    };

    const resetForm = () => {
      maDocGia.value = '';
      hoLot.value = '';
      ten.value = '';
      dienThoai.value = '';
    };

    const navigateToLogin = () => {
      router.push('/'); // Navigate to the login page
    };

    return {
      maDocGia,
      hoLot,
      ten,
      dienThoai,
      errorMessage,
      successMessage,
      handleRegister,
      navigateToLogin,
    };
  },
};
</script>

<style scoped>
.register-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to right, #4b79a1, #283e51); /* Gradient background */
}

.register-container {
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

input,
select {
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

.success {
  color: green;
  margin-top: 10px;
  text-align: center;
}
</style>

