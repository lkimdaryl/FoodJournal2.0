import './StarRating.css'

interface StarRatingProps {
        rating: number;
    }

export default function StarRating({ rating }: StarRatingProps) {
    const totalStars = 5;
    return(
        <div className="star-rating">
            {Array.from({ length: totalStars }, (_, i) => (
            <span key={i} className={i < rating ? 'star filled' : 'star'}>&#9733;</span>
            ))}
      </div>
    );
}