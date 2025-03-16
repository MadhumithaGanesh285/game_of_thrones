import React from "react";
import "./LogoMarQuee.css"// Ensure you have the styles

// Import images from assets folder
import img1 from '../../assets/images/img1.png';
import img2 from '../../assets/images/img2.png';
import img3 from '../../assets/images/img3.png';
import img4 from '../../assets/images/img4.png';
import img5 from '../../assets/images/img5.png';
import img6 from '../../assets/images/img6.png';
import img7 from '../../assets/images/img7.png';
import img8 from '../../assets/images/img8.png';
import img9 from '../../assets/images/img9.png';

const logos: string[] = [img1,img2,img3,img4,img5,img6,img7,img8,img9];

const LogoMarquee: React.FC = () => {
  return (
    <div className="marquee">
      <div className="marquee__inner">
        {/* Duplicate the logos to create a seamless scrolling effect */}
        {[...logos, ...logos, ...logos].map((logo, index) => (
          <img key={index} src={logo} alt={`logo-${index}`} className="logo" />
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;
