import React from 'react';

interface TestimonialProps {
  text: string;
  author: string;
  rating: number;
  containerClasses?: string;
  imageClasses?: string;
  textClasses?: string;
  authorClasses?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  text,
  author,
  rating,
  containerClasses = "w-full md:w-[340px]",
  imageClasses = "flex space-x-2",
  textClasses = "text-su_primary mt-6 w-full",
  authorClasses = "mt-10 font-Urbanist text-su_primary_lighter",
}) => {
  const renderRatingStars = () => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<img key={i} src="/assets/landing-page/star.png" alt={`Star ${i + 1}`} />);
    }
    return stars;
  };

  return (
    <div className='w-[340px]'>
    <div className={containerClasses}>
      <div className={imageClasses}>
        {renderRatingStars()}
      </div>
      <p className={textClasses}>
        {text}
      </p>
      <p className={authorClasses}>
        {author}
      </p>
    </div>
    </div>
  );
};

export default Testimonial;
