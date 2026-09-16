import { Link } from 'react-router-dom'

import './AboutPage.css'


function AboutPage() {
  return (
    <div className="kentank-about-page">

      {/* HERO */}

      <section className="kentank-about-hero">

        <div className="container">

          <div className="kentank-about-hero-content">

            <span className="kentank-about-label">
              About Kentank Deliveries
            </span>

            <h1>
              Reliable Water Storage Solutions You Can Count On
            </h1>

            <p>
              We are committed to providing quality water tanks,
              convenient delivery, and dependable customer service
              to households, businesses, farms, institutions, and
              other customers looking for reliable water storage
              solutions.
            </p>

            <div className="kentank-about-hero-actions">

              <Link
                to="/products"
                className="kentank-about-primary-btn"
              >
                Explore Our Tanks
              </Link>

              <Link
                to="/contact"
                className="kentank-about-secondary-btn"
              >
                Contact Us
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* INTRODUCTION */}

      <section className="kentank-about-introduction">

        <div className="container">

          <div className="row align-items-center g-5">

            <div className="col-lg-6">

              <span className="kentank-about-section-label">
                Who We Are
              </span>

              <h2>
                Your Trusted Partner for Water Storage
              </h2>

              <p>
                At Kentank Deliveries, we understand that reliable
                water storage is an important part of everyday life
                and business. Whether you are building a home,
                managing a farm, running a business, or looking for
                additional water storage capacity, having the right
                tank matters.
              </p>

              <p>
                Our goal is to make the process of finding and
                purchasing a water tank simple, convenient, and
                dependable. We provide customers with access to
                quality water tanks while making it easy to view
                available products, compare options, and contact
                our team directly.
              </p>

              <p>
                We believe that good business is built on trust,
                transparency, quality products, and excellent
                customer service. These principles guide the way
                we serve our customers.
              </p>

            </div>


            <div className="col-lg-6">

              <div className="kentank-about-introduction-card">

                <div className="kentank-about-water-icon">
                  💧
                </div>

                <span>
                  Our Commitment
                </span>

                <h3>
                  Quality. Reliability. Service.
                </h3>

                <p>
                  We are focused on helping our customers find
                  practical water storage solutions while providing
                  a professional and straightforward buying
                  experience.
                </p>

                <div className="kentank-about-commitment-list">

                  <div>
                    <span>✓</span>
                    <p>Quality water storage solutions</p>
                  </div>

                  <div>
                    <span>✓</span>
                    <p>Transparent product information</p>
                  </div>

                  <div>
                    <span>✓</span>
                    <p>Convenient customer support</p>
                  </div>

                  <div>
                    <span>✓</span>
                    <p>Reliable delivery arrangements</p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* MISSION */}

      <section className="kentank-about-mission">

        <div className="container">

          <div className="kentank-about-mission-content">

            <span className="kentank-about-section-label">
              Our Mission
            </span>

            <h2>
              Making Quality Water Storage More Accessible
            </h2>

            <p>
              Our mission is to provide dependable water storage
              solutions while delivering a professional, convenient,
              and customer-focused experience. We aim to make it
              easier for individuals, families, businesses, farmers,
              and institutions to access suitable water tanks and
              receive the support they need throughout their
              purchasing journey.
            </p>

          </div>

        </div>

      </section>


      {/* WHY CHOOSE US */}

      <section className="kentank-about-why">

        <div className="container">

          <div className="kentank-about-heading">

            <span className="kentank-about-section-label">
              Why Choose Us
            </span>

            <h2>
              Why Customers Choose Kentank Deliveries
            </h2>

            <p>
              We focus on the things that matter most when
              purchasing a water tank: quality, clarity,
              convenience, and dependable service.
            </p>

          </div>


          <div className="row g-4">

            <div className="col-md-6 col-lg-3">

              <div className="kentank-about-feature">

                <div className="kentank-about-feature-icon">
                  ✓
                </div>

                <h3>
                  Quality Products
                </h3>

                <p>
                  We provide water storage solutions selected
                  with reliability, durability, and everyday
                  use in mind.
                </p>

              </div>

            </div>


            <div className="col-md-6 col-lg-3">

              <div className="kentank-about-feature">

                <div className="kentank-about-feature-icon">
                  ₭
                </div>

                <h3>
                  Competitive Value
                </h3>

                <p>
                  We aim to provide practical water storage
                  options at competitive prices without
                  compromising the customer experience.
                </p>

              </div>

            </div>


            <div className="col-md-6 col-lg-3">

              <div className="kentank-about-feature">

                <div className="kentank-about-feature-icon">
                  🚚
                </div>

                <h3>
                  Convenient Delivery
                </h3>

                <p>
                  We make it easier for customers to arrange
                  delivery of their selected water tanks to
                  their preferred location.
                </p>

              </div>

            </div>


            <div className="col-md-6 col-lg-3">

              <div className="kentank-about-feature">

                <div className="kentank-about-feature-icon">
                  🤝
                </div>

                <h3>
                  Customer Focus
                </h3>

                <p>
                  Our team is committed to providing clear
                  communication and helpful support before
                  and after your purchase.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* WHO WE SERVE */}

      <section className="kentank-about-customers">

        <div className="container">

          <div className="row align-items-center g-5">

            <div className="col-lg-5">

              <span className="kentank-about-section-label">
                Who We Serve
              </span>

              <h2>
                Water Storage Solutions for Different Needs
              </h2>

              <p>
                Our products are suitable for a wide range of
                customers and applications. Whether you need
                water storage for your home, business, farm, or
                institution, we can help you explore available
                options.
              </p>

            </div>


            <div className="col-lg-7">

              <div className="kentank-about-customer-grid">

                <div className="kentank-about-customer-item">
                  <span>🏠</span>
                  <div>
                    <h3>Homes</h3>
                    <p>
                      Reliable storage for everyday household needs.
                    </p>
                  </div>
                </div>


                <div className="kentank-about-customer-item">
                  <span>🏢</span>
                  <div>
                    <h3>Businesses</h3>
                    <p>
                      Practical water storage for commercial operations.
                    </p>
                  </div>
                </div>


                <div className="kentank-about-customer-item">
                  <span>🌱</span>
                  <div>
                    <h3>Farms</h3>
                    <p>
                      Water storage solutions for agricultural needs.
                    </p>
                  </div>
                </div>


                <div className="kentank-about-customer-item">
                  <span>🏫</span>
                  <div>
                    <h3>Institutions</h3>
                    <p>
                      Storage solutions for schools and other facilities.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* BUSINESS VALUES */}

      <section className="kentank-about-values">

        <div className="container">

          <div className="kentank-about-heading">

            <span className="kentank-about-section-label">
              Our Values
            </span>

            <h2>
              Built Around Trust and Professional Service
            </h2>

          </div>


          <div className="row g-4">

            <div className="col-md-4">

              <div className="kentank-about-value">

                <span>
                  01
                </span>

                <h3>
                  Integrity
                </h3>

                <p>
                  We believe in honest communication, transparent
                  product information, and treating every customer
                  with respect.
                </p>

              </div>

            </div>


            <div className="col-md-4">

              <div className="kentank-about-value">

                <span>
                  02
                </span>

                <h3>
                  Reliability
                </h3>

                <p>
                  We strive to provide dependable products and
                  service that our customers can confidently rely
                  on.
                </p>

              </div>

            </div>


            <div className="col-md-4">

              <div className="kentank-about-value">

                <span>
                  03
                </span>

                <h3>
                  Customer Satisfaction
                </h3>

                <p>
                  We put our customers at the centre of our business
                  and continuously work to improve their experience.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FINAL CTA */}

      <section className="kentank-about-cta">

        <div className="container">

          <div className="kentank-about-cta-content">

            <div>

              <span>
                Ready to Get Started?
              </span>

              <h2>
                Find the Right Water Tank for Your Needs
              </h2>

              <p>
                Explore our available tanks or contact our team
                for more information about our products and
                delivery options.
              </p>

            </div>


            <div className="kentank-about-cta-actions">

              <Link
                to="/products"
                className="kentank-about-cta-primary"
              >
                View Our Tanks
              </Link>

              <Link
                to="/contact"
                className="kentank-about-cta-secondary"
              >
                Contact Us
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  )
}


export default AboutPage