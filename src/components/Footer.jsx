import './Footer.css'

function Footer() {
  return (
    <footer className="kentank-footer">
      <div className="container kentank-footer-container">

        <div className="row">

          <div className="col-md-6">
            <h5 className="kentank-footer-title">
              Kentank Deliveries
            </h5>

            <p className="kentank-footer-description">
              Quality water tanks delivered to your doorstep.
            </p>
          </div>

          <div className="col-md-6 kentank-footer-right text-md-end">
            <p className="kentank-footer-tagline">
              Reliable. Affordable. Convenient.
            </p>

            <small className="kentank-footer-copyright">
              © {new Date().getFullYear()} Kentank Deliveries.
              All rights reserved.
            </small>
          </div>

        </div>

      </div>
    </footer>
  )
}

export default Footer