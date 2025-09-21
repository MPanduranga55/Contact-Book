import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalContacts, 
  contactsPerPage, 
  onPageChange,
  isLoading 
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  const startContact = (currentPage - 1) * contactsPerPage + 1;
  const endContact = Math.min(currentPage * contactsPerPage, totalContacts);

  return (
    <div className="pagination">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        className="btn btn-secondary"
      >
        Previous
      </button>
      
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
        <br />
        Showing {startContact}-{endContact} of {totalContacts} contacts
      </div>
      
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        className="btn btn-secondary"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;