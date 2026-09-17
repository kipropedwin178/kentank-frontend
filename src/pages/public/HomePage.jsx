import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";
import AddToCartButton from "../../components/AddToCartButton";

import "./HomePage.css";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";


const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl}`;
};


const getWhatsAppNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return "";
  }

  let number = phoneNumber.replace(/\D/g, "");

  if (number.startsWith("0")) {
    number = `254${number.slice(1)}`;
  }

  if (!number.startsWith("254")) {
    number = `254${number}`;
  }

  return number;
};


function HomePage() {
  const [tanks, setTanks] = useState([]);
  const [loadingTanks, setLoadingTanks] = useState(true);
  const [currentTankIndex, setCurrentTankIndex] = useState(0);

  const [contact, setContact] = useState(null);


  useEffect(() => {
    const fetchTanks = async () => {
      try {
        const response = await api.get("/tanks");

        const tanksWithImages = await Promise.all(
          response.data.map(async (tank) => {
            try {
              const imageResponse = await api.get(
                `/tanks/${tank.id}/images`,
              );

              const validImages =
                imageResponse.data.filter(
                  (image) => image.image_url,
                );

              return {
                ...tank,
                images: validImages,
              };
            } catch (error) {
              console.error(
                `Failed to load images for tank ${tank.id}:`,
                error,
              );

              return {
                ...tank,
                images: [],
              };
            }
          }),
        );


        const tanksWithProducts =
          tanksWithImages
            .filter(
              (tank) =>
                tank.images &&
                tank.images.length > 0,
            )
            .slice(0, 4);


        setTanks(tanksWithProducts);
        setCurrentTankIndex(0);

      } catch (error) {
        console.error(
          "Failed to load water tanks:",
          error,
        );
      } finally {
        setLoadingTanks(false);
      }
    };


    fetchTanks();
  }, []);


  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await api.get("/contact");

        setContact(response.data);
      } catch (error) {
        console.error(
          "Failed to load contact information:",
          error,
        );
      }
    };


    fetchContact();
  }, []);


  useEffect(() => {
    if (tanks.length <= 1) {
      return;
    }


    const interval = setInterval(() => {
      setCurrentTankIndex(
        (previousIndex) =>
          (previousIndex + 1) % tanks.length,
      );
    }, 5000);


    return () => clearInterval(interval);
  }, [tanks.length]);


  const currentTank =
    tanks[currentTankIndex];


  const currentImage =
    currentTank?.images?.find(
      (image) => image.image_url,
    );


  const goToPreviousTank = () => {
    if (tanks.length === 0) {
      return;
    }

    setCurrentTankIndex((previousIndex) =>
      previousIndex === 0
        ? tanks.length - 1
        : previousIndex - 1,
    );
  };


  const goToNextTank = () => {
    if (tanks.length === 0) {
      return;
    }

    setCurrentTankIndex(
      (previousIndex) =>
        (previousIndex + 1) % tanks.length,
    );
  };


  const latestTanks = tanks;


  const whatsappNumber =
    getWhatsAppNumber(
      contact?.whatsapp_number,
    );


  const callNumber =
    contact?.call_number || "";


  const whatsappMessage = encodeURIComponent(
    "Hello Kentank Deliveries, I would like to enquire about your water tanks.",
  );


  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : null;


  const callLink = callNumber
    ? `tel:${callNumber}`
    : null;


  return (
    <div className="kentank-home">

      {/* ================================
          HERO SECTION
      ================================= */}

      <section className="kentank-hero">

        <div className="container">

          <div className="row align-items-center kentank-hero-row">

            {/* Hero Text */}

            <div className="col-lg-5">

              <span className="kentank-hero-badge">
                Quality Water Storage Solutions
              </span>


              <h1 className="kentank-hero-title">

                <span className="kentank-hero-title-decoration"></span>


                <span className="kentank-hero-title-text">
                  DELIVERED TO YOU
                </span>


                <span className="kentank-hero-title-decoration"></span>

              </h1>


              <div className="kentank-hero-contact-actions">

                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kentank-hero-contact-button kentank-hero-whatsapp-button"
                  >
                    WhatsApp Us
                  </a>
                ) : (
                  <span className="kentank-hero-contact-button kentank-hero-contact-button-disabled">
                    WhatsApp Us
                  </span>
                )}


                {callLink ? (
                  <a
                    href={callLink}
                    className="kentank-hero-contact-button kentank-hero-call-button"
                  >
                    Call Us
                  </a>
                ) : (
                  <span className="kentank-hero-contact-button kentank-hero-contact-button-disabled">
                    Call Us
                  </span>
                )}

              </div>


              <p className="kentank-hero-description">
                Find quality water tanks at competitive
                prices, with convenient delivery services
                you can rely on.
              </p>

            </div>


            {/* Hero Product */}

            <div className="col-lg-7">

              <div className="kentank-hero-showcase">

                {loadingTanks ? (

                  <div className="kentank-hero-loading">

                    <div
                      className="spinner-border"
                      role="status"
                    >
                      <span className="visually-hidden">
                        Loading...
                      </span>
                    </div>


                    <p>
                      Loading our latest tank...
                    </p>

                  </div>

                ) : currentTank &&
                  currentImage ? (

                  <>

                    <div className="kentank-hero-product">

                      <img
                        src={getImageUrl(
                          currentImage.image_url,
                        )}
                        alt={currentTank.name}
                        className="kentank-hero-product-image"
                      />


                      <div className="kentank-hero-product-overlay">

                        <span className="kentank-hero-product-label">
                          Featured Tank
                        </span>


                        <h2>
                          {currentTank.name}
                        </h2>


                        <div className="kentank-hero-product-details">

                          <span>
                            {Number(
                              currentTank.capacity_liters,
                            ).toLocaleString()}{" "}
                            Liters
                          </span>


                          <span>
                            KES{" "}
                            {Number(
                              currentTank.price,
                            ).toLocaleString()}
                          </span>

                        </div>


                        <span
                          className={`kentank-hero-availability kentank-hero-availability-${currentTank.availability
                            .toLowerCase()
                            .replaceAll(
                              " ",
                              "-",
                            )}`}
                        >
                          {currentTank.availability}
                        </span>

                      </div>

                    </div>


                    {tanks.length > 1 && (

                      <div className="kentank-carousel-controls">

                        <button
                          type="button"
                          className="kentank-carousel-arrow"
                          onClick={
                            goToPreviousTank
                          }
                          aria-label="Previous tank"
                        >
                          ‹
                        </button>


                        <div className="kentank-carousel-dots">

                          {tanks.map(
                            (tank, index) => (

                              <button
                                type="button"
                                key={tank.id}
                                className={`kentank-carousel-dot ${
                                  index ===
                                  currentTankIndex
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() =>
                                  setCurrentTankIndex(
                                    index,
                                  )
                                }
                                aria-label={`View ${tank.name}`}
                              />

                            ),
                          )}

                        </div>


                        <button
                          type="button"
                          className="kentank-carousel-arrow"
                          onClick={
                            goToNextTank
                          }
                          aria-label="Next tank"
                        >
                          ›
                        </button>

                      </div>

                    )}

                  </>

                ) : (

                  <div className="kentank-hero-no-product">

                    <div className="kentank-hero-tank-icon">
                      💧
                    </div>


                    <h3>
                      Quality Water Storage
                    </h3>


                    <p>
                      Quality tanks are coming soon.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================
          LATEST FOUR TANKS
      ================================= */}

      <section className="kentank-tanks-section">

        <div className="container">

          <div className="kentank-section-heading">

            <span className="kentank-section-label">
              Latest Arrivals
            </span>


            <h2>
              Our Latest Water Tanks
            </h2>


            <p>
              Explore our four most recently uploaded
              or updated water tanks.
            </p>

          </div>


          {latestTanks.length > 0 ? (

            <>

              <div className="row g-4">

                {latestTanks.map((tank) => {

                  const primaryImage =
                    tank.images?.find(
                      (image) =>
                        image.image_url,
                    );


                  return (

                    <div
                      className="col-6 col-lg-3"
                      key={tank.id}
                    >

                      <div className="kentank-tank-card">

                        <div className="kentank-tank-image-wrapper">

                          {primaryImage ? (

                            <img
                              src={getImageUrl(
                                primaryImage.image_url,
                              )}
                              alt={tank.name}
                              className="kentank-tank-image"
                            />

                          ) : (

                            <div className="kentank-hero-no-product">

                              <div className="kentank-hero-tank-icon">
                                💧
                              </div>


                              <p>
                                Image coming soon
                              </p>

                            </div>

                          )}


                          <span
                            className={`kentank-availability kentank-availability-${tank.availability
                              .toLowerCase()
                              .replaceAll(
                                " ",
                                "-",
                              )}`}
                          >
                            {tank.availability}
                          </span>

                        </div>


                        <div className="kentank-tank-card-body">

                          <h3>
                            {tank.name}
                          </h3>


                          <p className="kentank-tank-capacity">

                            {Number(
                              tank.capacity_liters,
                            ).toLocaleString()}{" "}

                            Liters

                          </p>


                          <p className="kentank-tank-description">

                            {tank.description ||
                              "Quality water storage tank."}

                          </p>


                          <div className="kentank-tank-card-footer">

                            <strong>
                              KES{" "}
                              {Number(
                                tank.price,
                              ).toLocaleString()}
                            </strong>

                          </div>


                          <AddToCartButton tank={tank} />

                        </div>

                      </div>

                    </div>

                  );
                })}

              </div>


              <div className="kentank-view-more-wrapper">

                <Link
                  to="/products"
                  className="kentank-view-more-btn"
                >
                  View More Tanks
                </Link>


                <Link
                  to="/contact"
                  className="kentank-retained-contact-btn"
                >
                  Contact Us
                </Link>

              </div>

            </>

          ) : (

            <div className="kentank-empty-tanks">

              <h3>
                No tanks available at the moment
              </h3>


              <p>
                Please check back soon for available
                water tanks.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* ================================
          WHY CHOOSE US
      ================================= */}

      <section className="kentank-why-section">

        <div className="container">

          <div className="kentank-section-heading">

            <span className="kentank-section-label">
              Why Choose Us
            </span>


            <h2>
              Water Storage Made Simple
            </h2>


            <p>
              We make it easier to find the right water
              tank for your home, business, or project.
            </p>

          </div>


          <div className="row g-4">

            <div className="col-md-4">

              <div className="kentank-feature-card">

                <div className="kentank-feature-icon">
                  ✓
                </div>


                <h3>
                  Quality Products
                </h3>


                <p>
                  Choose from quality water tanks
                  designed for dependable water storage.
                </p>

              </div>

            </div>


            <div className="col-md-4">

              <div className="kentank-feature-card">

                <div className="kentank-feature-icon">
                  🚚
                </div>


                <h3>
                  Convenient Delivery
                </h3>


                <p>
                  Get your water tank delivered
                  conveniently to your location.
                </p>

              </div>

            </div>


            <div className="col-md-4">

              <div className="kentank-feature-card">

                <div className="kentank-feature-icon">
                  💰
                </div>


                <h3>
                  Competitive Prices
                </h3>


                <p>
                  Find suitable water storage solutions
                  at competitive prices.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================
          CTA
      ================================= */}

      <section className="kentank-home-cta">

        <div className="container">

          <div className="kentank-cta-content">

            <h2>
              Looking for the right water tank?
            </h2>


            <p>
              Explore our complete collection or
              contact us directly for more information.
            </p>


            <Link
              to="/products"
              className="kentank-btn kentank-btn-light"
            >
              Explore All Tanks
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}


export default HomePage;