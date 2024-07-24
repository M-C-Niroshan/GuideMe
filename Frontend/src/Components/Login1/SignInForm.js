import React from 'react';
import DropdownAd from '../SpecialComponents/DropdownAd';

const SignInForm = () => {
  return (
    <form>
      <h1>Sign In</h1>
      <span>or use your email password</span>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <a href="#">Forget Your Password?</a>
      <button>Sign In</button>
    </form>
  );
};

export default SignInForm;
