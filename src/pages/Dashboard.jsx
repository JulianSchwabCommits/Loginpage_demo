import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [user, set_user] = useState(null);
  
  const account_balance = 5000.00;
  const transactions = [
    { id: 1, date: '2023-12-01', description: 'Grocery Store', amount: -75.50, type: 'debit' },
    { id: 2, date: '2023-12-01', description: 'Salary Deposit', amount: 2500.00, type: 'credit' },
    { id: 3, date: '2023-11-30', description: 'Electric Bill', amount: -120.00, type: 'debit' },
    { id: 4, date: '2023-11-29', description: 'Restaurant', amount: -45.75, type: 'debit' },
  ];

  useEffect(() => {
    // Check if user is authenticated
    const current_user = JSON.parse(localStorage.getItem('current_user'));
    if (!current_user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    set_user(current_user);
  }, [navigate]);

  const handle_logout = () => {
    localStorage.removeItem('current_user');
    navigate('/login');
  };

  // Return loading state if user data isn't loaded yet
  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>FJ Bank Dashboard</h1>
        <button onClick={handle_logout} className="logout-button">Logout</button>
      </header>

      <div className="welcome-banner">
        <h2 className="welcome-message">
          Welcome, <span className="user-name">{user.first_name} {user.last_name}</span>
        </h2>
      </div>

      <main className="dashboard-content">
        <section className="balance-section">
          <h2>Account Balance</h2>
          <div className="balance-amount">
            ${account_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </section>

        <section className="transactions-section">
          <h2>Recent Transactions</h2>
          <div className="transactions-list">
            {transactions.map(transaction => (
              <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                <div className="transaction-date">{transaction.date}</div>
                <div className="transaction-description">{transaction.description}</div>
                <div className="transaction-amount">
                  {transaction.type === 'credit' ? '+' : '-'}
                  ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;