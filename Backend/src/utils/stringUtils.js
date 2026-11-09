// Normalize string for comparison (for short answer questions)
export function normalizeString(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[.,!?;:]/g, ''); // Remove punctuation
}

// Check if two strings match (for short answer grading)
export function compareAnswers(userAnswer, correctAnswer) {
  const normalized1 = normalizeString(userAnswer);
  const normalized2 = normalizeString(correctAnswer);
  
  return normalized1 === normalized2;
}

// Generate random string (for class codes)
export function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Format response
export function successResponse(message, data = null, statusCode = 200) {
  return {
    statusCode,
    body: {
      success: true,
      message,
      data
    }
  };
}

export function errorResponse(message, statusCode = 400, data = null) {
  return {
    statusCode,
    body: {
      success: false,
      message,
      data
    }
  };
}

// Pagination helper
export function getPaginationInfo(page, limit, total) {
  const currentPage = Math.max(1, parseInt(page) || 1);
  const itemsPerPage = Math.min(100, parseInt(limit) || 10);
  const totalPages = Math.ceil(total / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;

  return {
    currentPage,
    itemsPerPage,
    totalItems: total,
    totalPages,
    offset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}
