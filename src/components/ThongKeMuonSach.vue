<template>
  <div class="thong-ke-muon-sach">
    <h3>Thống Kê Sách Đã Mượn</h3>
    <table v-if="borrowedBooks.length > 0" class="book-table">
      <thead>
        <tr>
          <th>Mã Độc Giả</th> <!-- New column for MaDocGia -->
          <th>Mã Sách</th>
          <th>Tên Sách</th>
          <th>Ngày Mượn</th>
          <th>Ngày Trả</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in borrowedBooks" :key="book._id"> <!-- Use unique ID as key -->
          <td>{{ book.MaDocGia }}</td> <!-- Display MaDocGia -->
          <td>{{ book.MaSach }}</td>
          <td>{{ book.TenSach }}</td> <!-- Display book title -->
          <td>{{ new Date(book.NgayMuon).toLocaleDateString() }}</td> <!-- Format borrow date -->
          <td>{{ book.NgayTra ? new Date(book.NgayTra).toLocaleDateString() : 'Chưa trả' }}</td> <!-- Format return date -->
        </tr>
      </tbody>
    </table>
    <p v-else>Không có sách đã mượn nào.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { fetchBorrowedBooksByReader, fetchAllBorrowedBooks } from '../services/api';

export default {
  name: 'ThongKeMuonSach',
  setup() {
    const borrowedBooks = ref([]);

    const getBorrowedBooks = async () => {
      const user = JSON.parse(localStorage.getItem('loggedInUser')); // Get user info from localStorage
      const MaDocGia = user ? user.MaDocGia : null; // Get MaDocGia if user exists

      if (user) {
        try {
          if (user.role === 'admin') {
            // For admin: Fetch all borrowed books
            const response = await fetchAllBorrowedBooks(); // Fetch all borrowed books for admin
            borrowedBooks.value = response.data; // Assuming response.data contains the list of borrowed books
          } else {
            // For reader: Fetch borrowed books by reader
            if (MaDocGia) {
              const response = await fetchBorrowedBooksByReader(MaDocGia); // Fetch books by reader ID
              borrowedBooks.value = response.data; // Assuming response.data contains the list of borrowed books
            }
          }
        } catch (error) {
          console.error("Error fetching borrowed books:", error);
        }
      } else {
        console.warn("No user found in localStorage");
      }
    };

    onMounted(() => {
      getBorrowedBooks(); // Call function when component mounts
    });

    return {
      borrowedBooks,
    };
  },
};
</script>

<style scoped>
.thong-ke-muon-sach {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.book-table {
  width: 100%;
  border-collapse: collapse;
}

.book-table th, .book-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.book-table th {
  background-color: #007bff;
  color: white;
}

p {
  text-align: center;
  color: #666;
}
</style>
