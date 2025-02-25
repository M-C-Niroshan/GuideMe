import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className='main-container1'>
      <div className="sub-container1">
        <div className="fspace"></div>
        <div className="ficons">
          <ul className='ficonlist'>
            <li className='fb'><i className="fa-brands fa-facebook"></i></li>
            <li className='insta'><i className="fa-brands fa-instagram"></i></li>
            <li className='linkedin'><i className="fa-brands fa-linkedin"></i></li>
          </ul>
        </div>
        <div className="ftext">
          <p className='ftextp'>
            Email: info@guideme.com<br />
            Phone: +94 11 123 4567<br />
            Address: 123 Paradise Road, Colombo, Sri Lanka
          </p>
        </div>
      </div>

      <div className="copyright">
        <p className="copyrightp">
          Copyright © 2024 Sri Lanka GuideMe. All rights reserved. Privacy Policy | Terms of Service
        </p>
      </div>
    </div>
  )
}
