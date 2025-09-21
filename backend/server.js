const express = require('express');
const cors = require('cors');
const { dbHelpers } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const validateEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const validateContact = (contactData) => {
  const { name, email, phone } = contactData;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!email || !validateEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!phone || !validatePhone(phone)) {
    errors.push('Valid 10-digit phone number is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

app.get('/api/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1-100'
      });
    }

    const result = await dbHelpers.getContacts(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contactData = req.body;

    const validation = validateContact(contactData);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const newContact = await dbHelpers.addContact(contactData);
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error adding contact:', error);
    
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        error: 'A contact with this email already exists'
      });
    }

    res.status(500).json({ error: 'Failed to add contact' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const contactId = parseInt(req.params.id);

    if (isNaN(contactId)) {
      return res.status(400).json({ error: 'Invalid contact ID' });
    }

    const result = await dbHelpers.deleteContact(contactId);
    
    if (!result.deleted) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;