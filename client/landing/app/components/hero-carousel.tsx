import carouselStyles from "~/styles/hero-carousel.module.css";

export const HeroCarousel: React.FC = () => {
  return (
    <div className={carouselStyles["hero_carousel"]}>
      <ul>
        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_img"]
          }
        >
          <img
            src="/images/compressed/compressed_image_35.jpg"
            alt="testimonial card"
            loading="lazy"
          />
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_card"]
          }
        >
          <div>
            <div className={carouselStyles["cec_top"]}>
              <img
                src="/images/compressed/compressed_image_30.jpg"
                alt="avatar image of a social card component"
                loading="lazy"
              />
              <div>
                <h3>daniel emmanuel</h3>
                <p>peterstokes200@gmail.com</p>
              </div>
            </div>
            <div className={carouselStyles["cec_bottom"]}>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sapiente corrupti enim vel neque tenetur molestiae blanditiis
                minima earum necessitatibus beatae amet, aperiam obcaecati
                aliquam architecto!
              </p>
            </div>
          </div>
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_img"]
          }
        >
          <img
            src="/images/compressed/compressed_image_35.jpg"
            alt="testimonial card"
            loading="lazy"
          />
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_card"]
          }
        >
          <div>
            <div className={carouselStyles["cec_top"]}>
              <img
                src="/images/compressed/compressed_image_30.jpg"
                alt="avatar image of a social card component"
                loading="lazy"
              />
              <div>
                <h3>daniel emmanuel</h3>
                <p>peterstokes200@gmail.com</p>
              </div>
            </div>
            <div className={carouselStyles["cec_bottom"]}>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sapiente corrupti enim vel neque tenetur molestiae blanditiis
                minima earum necessitatibus beatae amet, aperiam obcaecati
                aliquam architecto!
              </p>
            </div>
          </div>
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_img"]
          }
        >
          <img
            src="/images/compressed/compressed_image_35.jpg"
            alt="testimonial card"
            loading="lazy"
          />
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_card"]
          }
        >
          <div>
            <div className={carouselStyles["cec_top"]}>
              <img
                src="/images/compressed/compressed_image_30.jpg"
                alt="avatar image of a social card component"
                loading="lazy"
              />
              <div>
                <h3>daniel emmanuel</h3>
                <p>peterstokes200@gmail.com</p>
              </div>
            </div>
            <div className={carouselStyles["cec_bottom"]}>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sapiente corrupti enim vel neque tenetur molestiae blanditiis
                minima earum necessitatibus beatae amet, aperiam obcaecati
                aliquam architecto!
              </p>
            </div>
          </div>
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_img"]
          }
        >
          <img
            src="/images/compressed/compressed_image_35.jpg"
            alt="testimonial card"
            loading="lazy"
          />
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_card"]
          }
        >
          <div>
            <div className={carouselStyles["cec_top"]}>
              <img
                src="/images/compressed/compressed_image_30.jpg"
                alt="avatar image of a social card component"
                loading="lazy"
              />
              <div>
                <h3>daniel emmanuel</h3>
                <p>peterstokes200@gmail.com</p>
              </div>
            </div>
            <div className={carouselStyles["cec_bottom"]}>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sapiente corrupti enim vel neque tenetur molestiae blanditiis
                minima earum necessitatibus beatae amet, aperiam obcaecati
                aliquam architecto!
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};
