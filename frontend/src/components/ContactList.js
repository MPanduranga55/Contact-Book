import React from 'react';

const ContactList = ({ contacts, onDeleteContact, isLoading }) => {
  if (isLoading) {
    return (
      <div className="contacts-container">
        <div className="loading">Loading contacts...</div>
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="contacts-container">
        <div className="loading">
          <h3>No contacts found</h3>
          <p>Add your first contact using the form above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <h2 className="contacts-title">Contacts</h2>
        <div className="contacts-count">
          {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="contacts-list">
        {contacts.map((contact) => (
          <div key={contact.id} className="contact-item">
            <div className="contact-info">
              <h3>{contact.name}</h3>
              <p>{contact.email}</p>
              <p>{contact.phone}</p>
            </div>
            <div className="contact-actions">
              <button
                className="btn btn-danger"
                onClick={() => onDeleteContact(contact.id)}
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;