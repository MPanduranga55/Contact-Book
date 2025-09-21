import React, { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Pagination from './components/Pagination';
import { contactsAPI } from './services/api';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
    contactsPerPage: 10
  });

  const fetchContacts = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await contactsAPI.getContacts(page, pagination.contactsPerPage);
      setContacts(response.contacts);
      setPagination(prev => ({
        ...prev,
        currentPage: response.page,
        totalPages: response.totalPages,
        totalContacts: response.total
      }));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (contactData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await contactsAPI.addContact(contactData);
      setSuccessMessage('Contact added successfully!');
      await fetchContacts(pagination.currentPage);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await contactsAPI.deleteContact(contactId);
      setSuccessMessage('Contact deleted successfully!');
      await fetchContacts(pagination.currentPage);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      setError(err.message);
      console.error('Error deleting contact:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage !== pagination.currentPage && !isLoading) {
      fetchContacts(newPage);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  return (
    <div className="App">
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#333', fontSize: '2.5rem', fontWeight: '700' }}>
            Contact Book
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px' }}>
            Manage your contacts easily and efficiently
          </p>
        </header>

        {successMessage && (
          <div className="success">
            {successMessage}
            <button 
              onClick={clearMessages}
              style={{ 
                float: 'right', 
                background: 'none', 
                border: 'none', 
                fontSize: '18px', 
                cursor: 'pointer' 
              }}
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="error">
            {error}
            <button 
              onClick={clearMessages}
              style={{ 
                float: 'right', 
                background: 'none', 
                border: 'none', 
                fontSize: '18px', 
                cursor: 'pointer' 
              }}
            >
              ×
            </button>
          </div>
        )}

        <ContactForm 
          onAddContact={handleAddContact}
          isLoading={isLoading}
        />

        <ContactList 
          contacts={contacts}
          onDeleteContact={handleDeleteContact}
          isLoading={isLoading}
        />

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalContacts={pagination.totalContacts}
          contactsPerPage={pagination.contactsPerPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default App;