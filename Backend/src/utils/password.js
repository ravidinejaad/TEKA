import bcrypt from 'bcryptjs';

// Hash password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password with hash
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Validate password strength
export function validatePasswordStrength(password) {
  const minLength = parseInt(process.env.PASSWORD_MIN_LENGTH || 8);
  
  if (password.length < minLength) {
    return {
      valid: false,
      message: `Password minimal ${minLength} karakter`
    };
  }

  return {
    valid: true,
    message: 'Password valid'
  };
}
