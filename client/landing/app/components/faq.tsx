import faqStyles from "~/styles/faq.module.css";

export const Faq: React.FC = () => {
  return (
    <section className={faqStyles["faq_section"]} id="faq">
      <div className={faqStyles["faq_header"]}>
        <h3>Faq</h3>
        <span>
          <svg
            viewBox="0 0 195 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4C49.5578 13.4912 93.7302 17.7815 140.444 16.8889C156.146 16.5889 202.911 13.1539 187.556 16.4444C184.596 17.0786 171.189 17.9696 170.889 18C138.266 21.3063 106.246 27.3143 74.2222 34.3333C59.2389 37.6173 28.2656 44.7559 11.2222 50C9.38521 50.5652 4.08781 52.2505 6 52.4444C10.3099 52.8817 14.6129 51.4726 18.8889 50.7778C56.0882 44.7329 92.5668 34.7806 129.778 28.8889C141.648 27.0094 155.35 25.1023 167.111 28.7778C169.638 29.5675 162.457 24.3807 162 24"
              stroke="#E18C3D"
              stroke-width="8"
              stroke-linecap="round"
            />
          </svg>
        </span>
      </div>
      <div className={faqStyles["faq_accordion_area"]}>
        <ul className={faqStyles["faq_accordion"]}>
          <li>
            <div className={faqStyles["accordion_top"]}>
              <p>
                Are there anyway to reach out to the community moderators
                directly?
              </p>

              <div className={faqStyles["accordion_toggle"]}>
                <input type="radio" name="accordion_toggle" id="toggle_1" />
                <label htmlFor="toggle_1">
                  <span></span>
                </label>
              </div>
            </div>

            <div className={faqStyles["accordion_bottom"]}>
              yes. you can reach out to us through our official email
            </div>
          </li>

          <li>
            <div className={faqStyles["accordion_top"]}>
              <p>
                Are there anyway to reach out to the community moderators
                directly?
              </p>
              <div className={faqStyles["accordion_toggle"]}>
                <input type="radio" name="accordion_toggle" id="toggle_2" />
                <label htmlFor="toggle_2">
                  <span></span>
                </label>
              </div>
            </div>
            <div className={faqStyles["accordion_bottom"]}>
              yes. you can reach out to us through our official email
            </div>
          </li>

          <li>
            <div className={faqStyles["accordion_top"]}>
              <p>
                Are there anyway to reach out to the community moderators
                directly?
              </p>
              <div className={faqStyles["accordion_toggle"]}>
                <input type="radio" name="accordion_toggle" id="toggle_3" />
                <label htmlFor="toggle_3">
                  <span></span>
                </label>
              </div>
            </div>
            <div className={faqStyles["accordion_bottom"]}>
              yes. you can reach out to us through our official email
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};
