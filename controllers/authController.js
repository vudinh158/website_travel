const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');
const { sendPasswordResetEmail } = require('../services/emailService');

/**
 * Render Login Page
 */
const getLogin = (req, res) => {
  if (req.user) return res.redirect('/dashboard');
  res.render('pages/login', {
    title: 'Login - Tranoi Travel',
    metaTitle: 'Login to Your Account | Tranoi Travel',
    metaDescription: 'Login to access your tour bookings, saved wishlist, and travel itinerary.',
    error: req.query.error || null,
    success: req.query.success || null
  });
};

/**
 * Handle Login Submission
 */
const postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      return res.render('pages/login', {
        title: 'Login - Tranoi Travel',
        metaTitle: 'Login | WanderLust',
        metaDescription: 'Login to your account',
        error: 'Invalid email address or password.',
        success: null
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('pages/login', {
        title: 'Login - Tranoi Travel',
        metaTitle: 'Login | WanderLust',
        metaDescription: 'Login to your account',
        error: 'Invalid email address or password.',
        success: null
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role ? user.role.name : 'customer' },
      process.env.JWT_SECRET || 'travel_tour_super_secret_jwt_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const returnUrl = req.session.returnTo || (user.roleId === 1 ? '/admin' : '/dashboard');
    delete req.session.returnTo;
    return res.redirect(returnUrl);
  } catch (err) {
    console.error('Login error:', err);
    return res.render('pages/login', {
      title: 'Login - Tranoi Travel',
      metaTitle: 'Login',
      metaDescription: 'Login error',
      error: 'An error occurred during login. Please try again.',
      success: null
    });
  }
};

/**
 * Render Register Page
 */
const getRegister = (req, res) => {
  if (req.user) return res.redirect('/dashboard');
  res.render('pages/register', {
    title: 'Register Account - Tranoi Travel',
    metaTitle: 'Create an Account | Tranoi Travel',
    metaDescription: 'Sign up for free to book tours, save destinations, and get exclusive travel discounts.',
    error: null,
    formData: {}
  });
};

/**
 * Handle Registration Submission
 */
const postRegister = async (req, res) => {
  const { name, email, password, confirmPassword, phone } = req.body;

  if (password !== confirmPassword) {
    return res.render('pages/register', {
      title: 'Register Account - Tranoi Travel',
      metaTitle: 'Create an Account',
      metaDescription: 'Sign up for free',
      error: 'Passwords do not match.',
      formData: { name, email, phone }
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render('pages/register', {
        title: 'Register Account - Tranoi Travel',
        metaTitle: 'Create an Account',
        metaDescription: 'Sign up for free',
        error: 'Email address is already registered.',
        formData: { name, email, phone }
      });
    }

    const newUser = await User.create({
      roleId: 2, // Customer role
      name,
      email,
      password,
      phone
    });

    // Auto login with token
    const token = jwt.sign(
      { id: newUser.id, role: 'customer' },
      process.env.JWT_SECRET || 'travel_tour_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.redirect('/dashboard?welcome=1');
  } catch (err) {
    console.error('Registration error:', err);
    return res.render('pages/register', {
      title: 'Register Account - Tranoi Travel',
      metaTitle: 'Create an Account',
      metaDescription: 'Sign up for free',
      error: 'Registration failed. Please check your information.',
      formData: { name, email, phone }
    });
  }
};

/**
 * Logout
 */
const logout = (req, res) => {
  res.clearCookie('token');
  if (req.session) {
    req.session.destroy();
  }
  res.redirect('/login?success=' + encodeURIComponent('You have been logged out.'));
};

/**
 * Render Forgot Password Page
 */
const getForgotPassword = (req, res) => {
  res.render('pages/forgot-password', {
    title: 'Forgot Password - Tranoi Travel',
    metaTitle: 'Reset Your Password | Tranoi Travel',
    metaDescription: 'Enter your email to receive password reset instructions.',
    error: null,
    success: null
  });
};

/**
 * Handle Forgot Password
 */
const postForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('pages/forgot-password', {
        title: 'Forgot Password - Tranoi Travel',
        metaTitle: 'Reset Password',
        metaDescription: 'Password reset',
        error: null,
        success: 'If that email address exists in our database, a password reset link has been sent.'
      });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'travel_tour_super_secret_jwt_key_2026', { expiresIn: '1h' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    return res.render('pages/forgot-password', {
      title: 'Forgot Password - Tranoi Travel',
      metaTitle: 'Reset Password',
      metaDescription: 'Password reset',
      error: null,
      success: 'If that email address exists in our database, a password reset link has been sent.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.render('pages/forgot-password', {
      title: 'Forgot Password',
      metaTitle: 'Reset Password',
      metaDescription: 'Reset password',
      error: 'An error occurred. Please try again.',
      success: null
    });
  }
};

/**
 * Render Reset Password Page
 */
const getResetPassword = (req, res) => {
  const { token } = req.query;
  res.render('pages/reset-password', {
    title: 'Reset Password - Tranoi Travel',
    metaTitle: 'Set New Password',
    metaDescription: 'Enter your new password.',
    token,
    error: null
  });
};

/**
 * Handle Reset Password Submission
 */
const postResetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.render('pages/reset-password', {
      title: 'Reset Password',
      metaTitle: 'Set New Password',
      metaDescription: 'Enter your new password',
      token,
      error: 'Passwords do not match.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'travel_tour_super_secret_jwt_key_2026');
    const user = await User.findByPk(decoded.id);

    if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
      return res.render('pages/reset-password', {
        title: 'Reset Password',
        metaTitle: 'Set New Password',
        metaDescription: 'Enter your new password',
        token,
        error: 'Password reset token is invalid or has expired.'
      });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.redirect('/login?success=' + encodeURIComponent('Password reset successful. Please log in with your new password.'));
  } catch (err) {
    return res.render('pages/reset-password', {
      title: 'Reset Password',
      metaTitle: 'Set New Password',
      metaDescription: 'Enter your new password',
      token,
      error: 'Invalid or expired reset token.'
    });
  }
};

module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  logout,
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword
};
