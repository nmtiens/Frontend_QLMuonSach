<template>
    <Header />
    <div class="search-wrapper">
        <h1>Tìm Kiếm Sách</h1>
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Nhập tên sách, tác giả..."
            class="search-input"
        />

        <!-- Toggle button for showing ThongKeMuonSach component -->
        <button @click="toggleStats" class="stats-button">
            📊 Xem Thống Kê Mượn Sách
        </button>

        <!-- Conditionally render the ThongKeMuonSach component -->
        <ThongKeMuonSach v-if="showStats" />

        <table class="book-table">
            <thead>
                <tr>
                    <th>Mã Sách</th>
                    <th>Tên Sách</th>
                    <th>Đơn Giá</th>
                    <th>Số Quyển</th>
                    <th>Năm Xuất Bản</th>
                    <th>Nhà Xuất Bản</th>
                    <th>Tác Giả</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="book in filteredBooks" :key="book.MaSach">
                    <td>{{ book.MaSach }}</td>
                    <td>{{ book.TenSach }}</td>
                    <td>{{ book.DonGia }}</td>
                    <td>{{ book.SoQuyen }}</td>
                    <td>{{ book.NamXuatBan }}</td>
                    <td>{{ book.MaNXB }}</td>
                    <td>{{ book.TacGia }}</td>
                    <td>
                        <button @click="openBorrowForm(book)" class="borrow-btn">Mượn</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Borrow Form -->
        <FormMuonSach
            v-if="showBorrowForm"
            :selectedBook="selectedBook"
            @close="closeBorrowForm"
            @borrowSuccess="handleBorrowSuccess"
        />

        <div v-if="message" class="message">{{ message }}</div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { fetchSaches } from '../services/api';
import Header from './Header.vue';
import FormMuonSach from './FormMuonSach.vue';
import ThongKeMuonSach from './ThongKeMuonSach.vue'; // Import the ThongKeMuonSach component

export default {
    components: {
        Header,
        FormMuonSach,
        ThongKeMuonSach
    },
    setup() {
        const saches = ref([]);
        const filteredBooks = ref([]);
        const searchQuery = ref('');
        const message = ref('');
        const showBorrowForm = ref(false);
        const selectedBook = ref(null);
        const showStats = ref(false); // Toggle flag for statistics visibility

        // Fetch books data from the API
        const getSaches = async () => {
            const response = await fetchSaches();
            saches.value = response.data;
            filteredBooks.value = response.data;
        };

        // Filter books based on search query
        const filterBooks = () => {
            filteredBooks.value = saches.value.filter(book =>
                (book.TenSach && book.TenSach.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
                (book.TacGia && book.TacGia.toLowerCase().includes(searchQuery.value.toLowerCase()))
            );
        };

        // Watch for changes in search query and filter books accordingly
        watch(searchQuery, filterBooks);

        // Open the borrow form if the book is available
        const openBorrowForm = (book) => {
            if (book.SoQuyen <= 0) {
                message.value = 'Sách đã hết số lượng. Không thể mượn.';
            } else {
                selectedBook.value = book;
                showBorrowForm.value = true;
                message.value = ''; // Clear any previous messages
            }
        };

        // Close the borrow form
        const closeBorrowForm = () => {
            showBorrowForm.value = false;
        };

        // Handle borrow success and refresh books data
        const handleBorrowSuccess = () => {
            message.value = 'Mượn sách thành công!';
            getSaches(); // Refresh the book list
        };

        // Toggle visibility for ThongKeMuonSach component
        const toggleStats = () => {
            showStats.value = !showStats.value;
        };

        // Fetch books on component mount
        onMounted(() => {
            getSaches();
        });

        return {
            saches,
            filteredBooks,
            searchQuery,
            message,
            showBorrowForm,
            selectedBook,
            showStats,
            toggleStats,
            openBorrowForm,
            closeBorrowForm,
            handleBorrowSuccess
        };
    },
};
</script>

<style scoped>
.search-wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 20px;
}

.book-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
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

.borrow-btn {
    padding: 5px 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.borrow-btn:hover {
    background-color: #218838;
}

.stats-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 20px;
}

.stats-button:hover {
    background-color: #0056b3;
}

.message {
    color: red;
    margin-top: 10px;
    text-align: center;
}
</style>
