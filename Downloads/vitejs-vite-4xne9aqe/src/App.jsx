import { useEffect, useState } from "react";

const MOCK_USERS = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    maidenName: "",
    age: 30,
    gender: "male",
    phone: "123-456-7890",
    email: "john.doe@example.com",
    height: 180,
    weight: 75,
    image: "https://via.placeholder.com/120",
    address: { city: "New York", state: "NY", address: "123 St", country: "USA" }
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    maidenName: "",
    age: 28,
    gender: "female",
    phone: "987-654-3210",
    email: "jane.smith@example.com",
    height: 165,
    weight: 60,
    image: "https://via.placeholder.com/120",
    address: { city: "Los Angeles", state: "CA", address: "456 Ave", country: "USA" }
  },
  {
    id: 3,
    firstName: "Alice",
    lastName: "Brown",
    maidenName: "White",
    age: 25,
    gender: "female",
    phone: "555-123-4567",
    email: "alice.brown@example.com",
    height: 170,
    weight: 65,
    image: "https://via.placeholder.com/120",
    address: { city: "Chicago", state: "IL", address: "789 Blvd", country: "USA" }
  }
];

export default function App() {
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 2;

  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    maidenName: "",
    age: "",
    gender: "",
    phone: ""
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://dummyjson.com/users?limit=100")
      .then(res => {
        if (!res.ok) throw new Error("Ошибка загрузки")
        return res.json()
      })
      .then(data => {
        setUsers(data.users)
      })
      .catch(() => {
        setError("Не удалось загрузить пользователей. Показаны тестовые данные.")
        setUsers(MOCK_USERS)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Сортировка
  const handleSort = field => {
    if (sortField !== field) {
      setSortField(field);
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortField(null);
      setSortOrder(null);
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField || !sortOrder) return 0;

    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Фильтрация

  const filteredUsers = sortedUsers.filter(user => {
    return (
      user.firstName.toLowerCase().includes(filters.firstName.toLowerCase()) &&
      user.lastName.toLowerCase().includes(filters.lastName.toLowerCase()) &&
      user.maidenName.toLowerCase().includes(filters.maidenName.toLowerCase()) &&
      (filters.age === "" || user.age.toString() === filters.age) &&
      user.gender.toLowerCase().includes(filters.gender.toLowerCase()) &&
      user.phone.includes(filters.phone)
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Модальное окно
 
  const openModal = user => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "auto", width: "100%" }}>
      <h1>Пользователи</h1>

      {/* Фильтры */}
      <div style={{ marginBottom: 15 }}>
        <input placeholder="Фамилия" onChange={e => setFilters({ ...
        filters, lastName: e.target.value })} />
        <input placeholder="Имя" onChange={e => setFilters({ ...filters, firstName: e.target.value })} />
        <input placeholder="Отчество" onChange={e => setFilters({ ...filters, maidenName: e.target.value })} />
        <input placeholder="Возраст" onChange={e => setFilters({ ...filters, age: e.target.value })} />
        <input placeholder="Пол" onChange={e => setFilters({ ...filters, gender: e.target.value })} />
        <input placeholder="Телефон" onChange={e => setFilters({ ...filters, phone: e.target.value })} />
      </div>

      {/* Таблица */}
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      <table border="1" width="100%">
        <thead style={{ minWidth: "50px", resize: "horizontal", overflow: "auto" }}>
          <tr>
            <th style={{ minWidth: "50px", resize: "horizontal", overflow: "auto" }} onClick={() => handleSort("lastName")}>Фамилия</th>
            <th style={{ minWidth: "50px", resize: "horizontal", overflow: "auto" }} onClick={() => handleSort("firstName")}>Имя</th>
            <th style={{ minWidth: "50px", resize: "horizontal", overflow: "auto" }} onClick={() => handleSort("maidenName")}>Отчество</th>
            <th style={{ minWidth: "50px", resize: "horizontal", overflow: "auto" }} onClick={() => handleSort("age")}>Возраст</th>
            <th style={{ minWidth: "50px", resize: "horizontal", overflow: "auto" }} onClick={() => handleSort("gender")}>Пол</th>
            <th style={{ minWidth: "50px", resize: "horizontal", overflow: "auto" }} onClick={() => handleSort("phone")}>Телефон</th>
            <th style={{ minWidth: "50px", resize: "horizontal", overflow: "auto" }}>Email</th>
            <th style={{ minWidth: "50px", resize: "horizontal", overflow: "auto" }}>Страна</th>
            <th style={{ minWidth: "50px", resize: "horizontal", overflow: "auto" }}>Город</th>
          </tr>
        </thead>

        <tbody>
         {currentUsers.map(user => (
            <tr key={user.id} style={{ cursor: "pointer" }} onClick={() => openModal(user)}>
              <td>{user.lastName}</td>
              <td>{user.firstName}</td>
              <td>{user.maidenName}</td>
              <td>{user.age}</td>
              <td>{user.gender}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.address.country}</td>
              <td>{user.address.city}</td>
            </tr>
          ))}
        </tbody>
      </table>

<div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: "10px" }}>
  <button
    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
    disabled={currentPage === 1}
  >
    Назад
  </button>

  <span>Страница {currentPage}</span>

  <button
    onClick={() =>
      setCurrentPage(p =>
        p * usersPerPage < filteredUsers.length ? p + 1 : p
      )
    }
    disabled={currentPage * usersPerPage >= filteredUsers.length}
  >
    Вперед
  </button>
</div>

      {/* Модальное окно */}
      {isModalOpen && selectedUser && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "white", padding: 20 }}
          >
            <h2>
              {selectedUser.firstName} {selectedUser.maidenName} {selectedUser.lastName}
            </h2>
            <p>Возраст: {selectedUser.age}</p>
            <p>Пол: {selectedUser.gender}</p>
            <p>Телефон: {selectedUser.phone}</p>
            <p>Email: {selectedUser.email}</p>
            <p>Рост: {selectedUser.height} см</p>
            <p>Вес: {selectedUser.weight} кг</p>
            <p>
              Адрес: {selectedUser.address.city}, {selectedUser.address.state},{" "}
              {selectedUser.address.address}
            </p>
            <img src={selectedUser.image} width="120" alt="" />
            <br />
            <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}