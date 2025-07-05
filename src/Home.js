import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BirthdayWishes from "./BirthdayWishes";
import HomeSlider from "./HomeSlider";
import AboutUsSection from "./AboutUsSection";
import Footer from "./Footer";
import BlogPostSlider from "./BlogPostSlider";

function Home() {
  const navigate = useNavigate();
  const [hasBirthdays, setHasBirthdays] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { message: "કૃપા કરીને પહેલા લોગિન કરો." } });
    }

    fetch(`${process.env.REACT_APP_API_URL}/birthdays`)
      .then((res) => res.json())
      .then((data) => setHasBirthdays(data.length > 0))
      .catch((err) => console.error("Error fetching birthdays:", err));
  }, [navigate]);

  return (
    <div>
      <HomeSlider />
      <AboutUsSection />
      <BlogPostSlider />
      {/* Render Birthday Wishes only if there are birthdays */}
      {hasBirthdays && (
        <div className="relative z-10">
          <BirthdayWishes />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Home;
