<template>
  <div class="container">
    <h1>Danh Sách Tất Cả Sách</h1>

    <!-- Ô tìm kiếm -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm theo tên sách..."
      />
    </div>

    <!-- Nút Thêm Sách -->
    <button v-if="!showForm" @click="toggleForm" class="add-book-btn">Thêm Sách</button>

    <!-- Form Thêm/Cập Nhật Sách -->
    <form v-if="showForm" @submit.prevent="isEditMode ? handleUpdateBook() : handleAddBook()">
      <div>
        <label for="maSach">Mã Sách:</label>
        <input v-model="newBook.MaSach" id="maSach" required />
      </div>
      <div>
        <label for="tenSach">Tên Sách:</label>
        <input v-model="newBook.TenSach" id="tenSach" required />
      </div>

      <div>
        <label for="donGia">Đơn Giá:</label>
        <input v-model.number="newBook.DonGia" id="donGia" type="number" required />
      </div>

      <div>
        <label for="soQuyen">Số Quyển:</label>
        <input v-model.number="newBook.SoQuyen" id="soQuyen" type="number" required />
      </div>

      <div>
        <label for="namXuatBan">Năm Xuất Bản:</label>
        <input v-model.number="newBook.NamXuatBan" id="namXuatBan" type="number" required />
      </div>

      <div>
        <label for="maNXB">Mã NXB:</label>
        <input v-model="newBook.MaNXB" id="maNXB" required />
      </div>

      <div>
        <label for="tacGia">Tác Giả:</label>
        <input v-model="newBook.TacGia" id="tacGia" required />
      </div>

      <div class="buttons">
        <button type="submit">{{ isEditMode ? 'Cập Nhật Sách' : 'Lưu Sách' }}</button>
        <button type="button" @click="cancelEdit">Hủy</button>
      </div>
    </form>

    <!-- Bảng Hiển Thị Danh Sách Sách -->
    <table>
      <thead>
        <tr>
          <th>Mã Sách</th>
          <th>Tên Sách</th>
          <th>Đơn Giá (VND)</th>
          <th>Số Quyển</th>
          <th>Năm Xuất Bản</th>
          <th>Mã NXB</th>
          <th>Tác Giả</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sach in filteredSaches" :key="sach._id">
          <td>{{ sach.MaSach }}</td>
          <td>{{ sach.TenSach }}</td>
          <td>{{ sach.DonGia }}</td>
          <td>{{ sach.SoQuyen }}</td>
          <td>{{ sach.NamXuatBan }}</td>
          <td>{{ sach.MaNXB }}</td>
          <td>{{ sach.TacGia }}</td>
          <td>
            <button class="edit-btn" @click="prepareEditBook(sach)">Chỉnh Sửa</button>
            <button class="delete-btn" @click="handleDeleteBook(sach._id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { fetchSaches, addSach, updateSach, deleteSach } from '../services/api';
import Header from './Header.vue';

export default {
  components: {
    Header // Register the Header component
  },
  setup() {
    const saches = ref([]);
    const message = ref('');
    const isEditMode = ref(false);
    const editBookId = ref(null);
    const searchQuery = ref('');
    const showForm = ref(false); // Controls form visibility

    const newBook = ref({
      MaSach: '',
      TenSach: '',
      DonGia: 0,
      SoQuyen: 0,
      NamXuatBan: 0,
      MaNXB: '',
      TacGia: ''
    });

    const getSaches = async () => {
      try {
        const response = await fetchSaches();
        saches.value = response.data;
      } catch (error) {
        console.error('Error fetching books:', error);
        message.value = 'Không thể tải dữ liệu sách.';
      }
    };

    const filteredSaches = computed(() => {
      if (!searchQuery.value) return saches.value;
      return saches.value.filter((sach) =>
        sach.TenSach.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const handleAddBook = async () => {
      try {
        await addSach(newBook.value);
        message.value = 'Thêm sách thành công!';
        getSaches();
        resetForm();
      } catch (error) {
        console.error('Error adding book:', error);
        message.value = 'Có lỗi xảy ra khi thêm sách.';
      }
    };

    const prepareEditBook = (sach) => {
      newBook.value = { ...sach };
      editBookId.value = sach._id;
      isEditMode.value = true;
      showForm.value = true; // Show form when editing
    };

    const handleUpdateBook = async () => {
      try {
        await updateSach(editBookId.value, newBook.value);
        message.value = 'Cập nhật sách thành công!';
        getSaches();
        resetForm();
      } catch (error) {
        console.error('Error updating book:', error);
        message.value = 'Có lỗi xảy ra khi cập nhật sách.';
      }
    };

    const handleDeleteBook = async (id) => {
      try {
        await deleteSach(id);
        message.value = 'Xóa sách thành công!';
        getSaches();
      } catch (error) {
        console.error('Error deleting book:', error);
        message.value = 'Có lỗi xảy ra khi xóa sách.';
      }
    };

    const cancelEdit = () => {
      resetForm();
    };

    const resetForm = () => {
      newBook.value = {
        MaSach: '',
        TenSach: '',
        DonGia: 0,
        SoQuyen: 0,
        NamXuatBan: 0,
        MaNXB: '',
        TacGia: ''
      };
      editBookId.value = null;
      isEditMode.value = false;
      showForm.value = false; // Hide form after adding or canceling
    };

    const toggleForm = () => {
      showForm.value = !showForm.value;
    };

    onMounted(() => {
      getSaches();
    });

    return {
      saches,
      newBook,
      message,
      isEditMode,
      searchQuery,
      filteredSaches,
      showForm,
      handleAddBook,
      prepareEditBook,
      handleUpdateBook,
      handleDeleteBook,
      cancelEdit,
      toggleForm
    };
  }
};
</script>



  <style scoped>
  /* Tổng thể */
  .container {
    max-width: 1500px;
    margin: 0 auto; /* Căn giữa */
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    background-color: #7fbefe;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  /* Tiêu đề */
  h1 {
    text-align: center;
    color: #007bff;
    margin-bottom: 20px;
  }

  /* Ô tìm kiếm */
  .search-bar {
    margin-bottom: 20px; /* Khoảng cách dưới ô tìm kiếm */
    text-align: center; /* Căn giữa */
  }

  .search-bar input {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ced4da;
    width: 300px; /* Chiều rộng của ô tìm kiếm */
    box-sizing: border-box; /* Bao gồm padding và border trong chiều rộng */
    transition: border-color 0.3s;
  }

  .search-bar input:focus {
    border-color: #007bff;
    outline: none;
  }

  /* Form thêm/cập nhật sách */
  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  /* Nhóm trường nhập */
  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    font-weight: bold;
    color: #555;
  }

  input[type="text"],
  input[type="number"] {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ced4da;
    width: 100%; /* Đảm bảo input chiếm toàn bộ chiều rộng */
    box-sizing: border-box; /* Bao gồm padding và border trong chiều rộng */
    transition: border-color 0.3s;
  }

  input[type="text"]:focus,
  input[type="number"]:focus {
    border-color: #007bff;
    outline: none;
  }

  /* Nút gửi và hủy */
  .buttons {
    display: flex;
    justify-content: space-between;
  }

  button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
  }

  button[type="submit"] {
    background-color: #007bff;
    color: white;
  }

  button[type="button"] {
    background-color: #e0e0e0;
    color: #333;
  }

  button:hover {
    background-color: #0056b3;
  }

  button[type="button"]:hover {
    background-color: #c0c0c0;
  }

  /* Bảng hiển thị sách */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 30px;
  }

  th,
  td {
    padding: 12px;
    border: 1px solid #dee2e6;
    text-align: left;
  }

  th {
    background-color: #007bff;
    color: white;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .add-book-btn {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.add-book-btn:hover {
  background-color: #218838;
}

  .edit-btn,
  .delete-btn {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }

  .edit-btn {
    background-color: #f39c12;
    color: white;
  }

  .delete-btn {
    background-color: #dc3545;
    color: white;
  }

  .edit-btn:hover {
    background-color: #e67e22;
  }

  .delete-btn:hover {
    background-color: #c82333;
  }

  /* Thông báo */
  .message {
    color: green;
    margin-top: 20px;
    font-weight: bold;
    text-align: center;
  }
  </style>
