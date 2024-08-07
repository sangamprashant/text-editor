import React, { useEffect, useLayoutEffect } from "react";
import { useAppContext } from "../../context";

const DayNight = () => {
  const { theme } = useAppContext();
  const { isDark, setIsDark } = theme;

  useLayoutEffect(() => {
    const fetchTheme = async () => {
      if (window.electron && window.electron.getTheme) {
        const savedTheme = await window.electron.getTheme();
        setIsDark(savedTheme === "dark");
      } else {
        const savedTheme = localStorage.getItem("theme");
        setIsDark(savedTheme === "dark");
      }
    };
    fetchTheme();
  }, [setIsDark]);

  useEffect(() => {
    if (window.electron && window.electron.setTheme) {
      window.electron.setTheme(isDark ? "dark" : "light");
    } else {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="day-night" onClick={toggleTheme}>
      {isDark && <img src="day.png" alt="Day Night Image" height={30} />}
      <p>{!isDark ? "Night" : "Day"}</p>
      {!isDark && <img src="night.png" alt="Day Night Image" height={30} />}
    </div>
  );
};

export default DayNight;
