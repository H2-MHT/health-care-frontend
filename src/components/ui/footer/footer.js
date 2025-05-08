
import React from 'react'
import "./footer.css"
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer>
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="footer_data">
            <a href="#" className="footer_logo">
              <img src="/images/logo.png" className="img-fluid" />
            </a>
            <div className="links">
              <h4>Links</h4>
              <ul>
                <li>
                  <Link to="https://www.my-health.today/">Home</Link>
                </li>
                <li>
                  <a href="#">MyApp Guest</a>
                </li>
                <li>
                  <Link to="/alldoctors">Find Doctor</Link>
                </li>
                <li>
                  <Link to="/allclinics">Clinics</Link>
                </li>
                <li>
                  <Link to="https://www.my-health.today/">About Us</Link>
                </li>
                <li>
                  <Link to="https://www.my-health.today/contact">Contact Us</Link>
                </li>
              </ul>
            </div>
            <div className="adress">
              <h4>H2 Health Help</h4>
              <p>
                A Registerd Brand of My Health Today LTD 85 Portland
                Street, London, UK W1W 7LT <br />
                Company Number : 00000000
              </p>
            </div>
            <div className="getapp">
              <h4>Get the App</h4>
              <div className="download">
                <a href="#" target="_blank">
                  <img
                    src="/images/applestore.png"
                    className="img-fluid"
                  />
                </a>
                <a href="#" target="">
                  <img
                    src="/images/googleplay.png"
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>
            <div className="newsLetter">
              <h4>Subscribe to our newsletter</h4>
              <input type="text" placeholder="Enter your email" />
              <button type="submit" className="blue_btn">
                Submit
              </button>
              <div className="subscheck">
                <input type="checkbox" />
                Yes, subscribe me to your newsletter
              </div>
            </div>
          </div>

          <div className="footer_bottom">
            <div className="left">
              <ul>
                <li>
                    <a href="https://data.my-health.today/website/en/security-governance.pdf" target="_blank" rel="noopener noreferrer">Legal Notice</a>
                </li>
                <li>
                    <a href="https://data.my-health.today/website/en/privacy-policy.pdf" target="_blank" rel="noopener noreferrer">DMCA</a>
                </li>
                <li>
                    <a href="https://data.my-health.today/website/en/terms.pdf" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                </li>
                <li>
                    <a href="https://data.my-health.today/website/en/cookie-policy.pdf" target="_blank" rel="noopener noreferrer">Cookie Policy</a>
                </li>
              </ul>
            </div>
            <div className="right">
              <p>
                {" "}
                &copy; 2024 My Health Today LTD All rights reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  )
}

