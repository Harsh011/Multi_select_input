import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pills from "./components/Pills";

function App() {
  const [searchTerm, setSearchTearm] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [selectedUser, setSelectedUsers] = useState([]);
  const [selectedUserSet, setSelectedUsersSet] = useState(new Set());

  const refElement = useRef(null);

  const fetchUsers = () => {
    if (searchTerm.trim() === "") {
      setSuggestion([]);
      return;
    }

    fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => setSuggestion(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUser, user]);
    setSelectedUsersSet(new Set([...selectedUserSet, user.email]));
    setSearchTearm("");
    setSuggestion([]);
    refElement.current.focus();
  };

  const handleRemoveUser = (user) => {
    const updateUsers = selectedUser.filter((item) => item.id !== user.id);

    setSelectedUsers(updateUsers);

    const updateEmails = new Set(selectedUserSet);
    updateEmails.delete(user.email);
    setSelectedUsersSet(updateEmails);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUser.length > 0
    ) {
      const lastUser = selectedUser[selectedUser.length - 1];
      handleRemoveUser(lastUser);
      setSuggestion([]);
    }
  };
  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {/* pills */}
        {selectedUser.map((user) => {
          return (
            <Pills
              key={user.email}
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
              onClick={() => handleRemoveUser(user)}
            />
          );
        })}
        {/* input feild with search suggestion  */}
        <div>
          <input
            ref={refElement}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTearm(e.target.value)}
            placeholder="Search for a user ..."
            onKeyDown={handleKeyDown}
          />
          {/* search Suggestions  */}
          <ul className="suggestion-list">
            {suggestion?.users?.map((user, index) => {
              return !selectedUserSet.has(user.email) ? (
                <li key={user.id} onClick={() => handleSelectUser(user)}>
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ) : (
                <></>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
